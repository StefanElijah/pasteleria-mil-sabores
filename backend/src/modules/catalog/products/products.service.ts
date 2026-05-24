import { Injectable, NotFoundException, Inject, BadRequestException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
    constructor(@Inject('PrismaClient') private prisma: any) { }

    async create(createProductDto: CreateProductDto) {
        const { categoriaId, ...data } = createProductDto;
        const category = await this.prisma.categoria.findUnique({ where: { id: categoriaId } });
        if (!category) throw new BadRequestException('Categoría no encontrada');
        const existing = await this.prisma.producto.findUnique({ where: { slug: data.slug } });
        if (existing) throw new BadRequestException('El slug ya existe');
        return this.prisma.producto.create({
            data: { ...data, categoria: { connect: { id: categoriaId } } },
            include: { categoria: true },
        });
    }

    async findAll() {
        return this.prisma.producto.findMany({
            where: { activo: true },
            include: { categoria: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    // Permite opcionalmente incluir inactivos (para uso interno del admin)
    async findOne(id: string, includeInactive = false) {
        const where: any = { id };
        if (!includeInactive) where.activo = true;
        const product = await this.prisma.producto.findUnique({
            where,
            include: { categoria: true },
        });
        if (!product) throw new NotFoundException('Producto no encontrado');
        return product;
    }

    async findBySlug(slug: string) {
        const product = await this.prisma.producto.findUnique({
            where: { slug, activo: true },
            include: { categoria: true },
        });
        if (!product) throw new NotFoundException('Producto no encontrado');
        return product;
    }

    async update(id: string, updateProductDto: UpdateProductDto) {
        // Permitir actualizar incluso si está inactivo (para reactivarlo)
        await this.findOne(id, true);
        const { categoriaId, slug, ...data } = updateProductDto;
        if (slug) {
            const existing = await this.prisma.producto.findFirst({
                where: { slug, id: { not: id } },
            });
            if (existing) throw new BadRequestException('El slug ya está en uso');
        }
        const updateData: any = { ...data, slug };
        if (categoriaId) {
            const category = await this.prisma.categoria.findUnique({ where: { id: categoriaId } });
            if (!category) throw new BadRequestException('Categoría no encontrada');
            updateData.categoria = { connect: { id: categoriaId } };
        }
        return this.prisma.producto.update({
            where: { id },
            data: updateData,
            include: { categoria: true },
        });
    }

    async remove(id: string) {
        // Soft delete: marcar como inactivo
        const product = await this.prisma.producto.findUnique({ where: { id } });
        if (!product) throw new NotFoundException('Producto no encontrado');
        return this.prisma.producto.update({
            where: { id },
            data: { activo: false },
        });
    }
}