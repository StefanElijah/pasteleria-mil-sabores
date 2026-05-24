import { Injectable, Inject, BadRequestException, NotFoundException } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { EstadoPedido } from '@prisma/client';
import { CartService } from '@modules/sales/cart/cart.service';

@Injectable()
export class OrdersService {
    constructor(
        @Inject('PrismaClient') private prisma: any,
        private cartService: CartService,
    ) { }

    private async calcularEnvio(comunaId: string, metodoEnvio: string): Promise<{ costo: number; fechaEstimada: Date }> {
        const comuna = await this.prisma.comuna.findUnique({
            where: { id: comunaId },
            include: { region: true },
        });
        if (!comuna) throw new NotFoundException('Comuna no encontrada');

        let costo = 0;
        let dias = 3;
        if (comuna.region.nombre === 'Metropolitana') {
            if (metodoEnvio === 'Chilexpress') costo = 3000;
            if (metodoEnvio === 'Starken') costo = 2500;
            dias = 1;
        } else {
            if (metodoEnvio === 'Chilexpress') costo = 5000;
            if (metodoEnvio === 'Starken') costo = 4500;
            dias = 3;
        }

        const fechaEstimada = new Date();
        fechaEstimada.setDate(fechaEstimada.getDate() + dias);
        return { costo, fechaEstimada };
    }

    async create(
        userId: string | null,
        createOrderDto: CreateOrderDto,
        cartId?: string,
    ) {
        let {
            items,
            direccionId,
            direccion,
            metodoPago,
            metodoEnvio,
            costoEnvio,
            descuentoId,
            notas,
            nombreDestinatario,
            emailDestinatario,
            telefonoDestinatario
        } = createOrderDto;

        // 1. Si es invitado, validar datos del destinatario
        if (!userId) {
            if (!nombreDestinatario || !emailDestinatario || !telefonoDestinatario) {
                throw new BadRequestException(
                    'Para pedidos sin usuario (invitado), debe proporcionar nombre, email y teléfono del destinatario'
                );
            }
        }

        // 2. Determinar los items del pedido (desde el DTO o desde el carrito)
        let finalItems: Array<{ productId: string; quantity: number }> = [];

        if (items && items.length > 0) {
            finalItems = items;
        } else if (cartId) {
            const cart = await this.cartService.getCart(cartId);
            if (!cart.items.length) throw new BadRequestException('El carrito está vacío');
            finalItems = cart.items.map((item: any) => ({
                productId: item.productId,
                quantity: item.quantity,
            }));
        } else {
            throw new BadRequestException('No se proporcionaron items ni carrito');
        }

        // 3. Obtener o crear la dirección
        let direccionFinal: any = null;

        if (direccionId) {
            direccionFinal = await this.prisma.direccion.findUnique({
                where: { id: direccionId },
                include: { comuna: true, region: true },
            });
            if (!direccionFinal) throw new NotFoundException('Dirección no encontrada');
            if (userId && direccionFinal.usuarioId !== userId) {
                throw new BadRequestException('La dirección no pertenece al usuario');
            }
        } else if (direccion) {
            const { comunaId, regionId, ...dirData } = direccion;
            const comuna = await this.prisma.comuna.findUnique({ where: { id: comunaId } });
            if (!comuna) throw new NotFoundException('Comuna no encontrada');
            const region = await this.prisma.region.findUnique({ where: { id: regionId } });
            if (!region) throw new NotFoundException('Región no encontrada');

            direccionFinal = await this.prisma.direccion.create({
                data: {
                    ...dirData,
                    comunaId,
                    regionId,
                    usuarioId: userId || null,
                },
                include: { comuna: true, region: true },
            });
        } else {
            throw new BadRequestException('Debe proporcionar direccionId o direccion temporal');
        }

        // 4. Calcular costo de envío si no viene del front
        let envioCosto = costoEnvio;
        let fechaEstimadaEntrega: Date;
        if (!envioCosto) {
            const envioCalc = await this.calcularEnvio(direccionFinal.comunaId, metodoEnvio);
            envioCosto = envioCalc.costo;
            fechaEstimadaEntrega = envioCalc.fechaEstimada;
        } else {
            fechaEstimadaEntrega = new Date();
            fechaEstimadaEntrega.setDate(fechaEstimadaEntrega.getDate() + 3);
        }

        // 5. Validar productos y calcular subtotal
        let subtotal = 0;
        const orderItemsData: any[] = [];
        for (const item of finalItems) {
            const product = await this.prisma.producto.findUnique({
                where: { id: item.productId, activo: true },
            });
            if (!product) throw new NotFoundException(`Producto ${item.productId} no encontrado`);
            if (product.stock < item.quantity) {
                throw new BadRequestException(`Stock insuficiente para ${product.nombre}`);
            }
            const unitPrice = product.precio;
            const totalItem = unitPrice * item.quantity;
            subtotal += totalItem;
            orderItemsData.push({
                productoId: product.id,
                nombre: product.nombre,
                precio: unitPrice,
                cantidad: item.quantity,
                total: totalItem,
            });
        }

        // 6. Aplicar descuento
        let discountAmount = 0;
        if (descuentoId) {
            const descuento = await this.prisma.descuento.findUnique({
                where: { id: descuentoId, activo: true },
            });
            if (descuento && descuento.fechaFin >= new Date()) {
                if (descuento.tipo === 'PORCENTAJE') {
                    discountAmount = (subtotal * descuento.valor) / 100;
                } else if (descuento.tipo === 'MONTO_FIJO') {
                    discountAmount = descuento.valor;
                }
                await this.prisma.descuento.update({
                    where: { id: descuentoId },
                    data: { contadorUso: { increment: 1 } },
                });
            }
        }

        const total = subtotal + envioCosto - discountAmount;
        const orderNumber = `ORD-${Date.now()}`;

        // 7. Crear pedido y envío en transacción
        const result = await this.prisma.$transaction(async (tx: any) => {
            const newOrder = await tx.pedido.create({
                data: {
                    numeroPedido: orderNumber,
                    estado: EstadoPedido.PENDIENTE,
                    subtotal,
                    costoEnvio: envioCosto,
                    total,
                    metodoPago,
                    notas,
                    usuarioId: userId,
                    direccionId: direccionFinal.id,
                    descuentoId: discountAmount > 0 ? descuentoId : null,
                    nombreDestinatario: userId ? null : nombreDestinatario,
                    emailDestinatario: userId ? null : emailDestinatario,
                    telefonoDestinatario: userId ? null : telefonoDestinatario,
                    items: { create: orderItemsData },
                },
                include: { items: true, direccion: true },
            });

            const envio = await tx.envio.create({
                data: {
                    metodoEnvio,
                    empresaLogistica: metodoEnvio,
                    fechaEstimadaEntrega,
                    pedidoId: newOrder.id,
                    usuarioId: userId,
                },
            });

            // Reducir stock
            for (const item of finalItems) {
                await tx.producto.update({
                    where: { id: item.productId },
                    data: { stock: { decrement: item.quantity } },
                });
            }

            // Vaciar carrito
            if (cartId) {
                await this.cartService.clearCart(cartId);
            }

            return { ...newOrder, envio };
        });

        return result;
    }

    async findAllByUser(userId: string) {
        return this.prisma.pedido.findMany({
            where: { usuarioId: userId },
            include: { items: true, direccion: true, envio: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findOne(id: string, userId?: string) {
        const order = await this.prisma.pedido.findUnique({
            where: { id },
            include: {
                items: { include: { producto: true } },
                direccion: { include: { comuna: true, region: true } },
                envio: true,
            },
        });
        if (!order) throw new NotFoundException('Pedido no encontrado');
        if (userId && order.usuarioId !== userId) throw new BadRequestException('No tienes permiso');
        return order;
    }

    async updateStatus(id: string, estado: EstadoPedido, userId?: string) {
        const order = await this.findOne(id, userId);
        return this.prisma.pedido.update({
            where: { id },
            data: { estado },
            include: { envio: true },
        });
    }
}