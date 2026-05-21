import { Injectable, NotFoundException, Inject, ForbiddenException } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
    constructor(@Inject('PrismaClient') private prisma: any) { }

    async create(createProductDto: CreateProductDto) {
        const { categoriaId, ...data } = createProductDto;
        // Verificar que la categoría existe
        const category = await this.prisma.categoria.findUnique({ where: { id: categoriaId } });
        if (!category) throw new NotFoundException('Categoría no encontrada');

        return this.prisma.producto.create({
            data: {
                ...data,
                categoria: { connect: { id: categoriaId } },
            },
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

    async findOne(id: string) {
        const product = await this.prisma.producto.findUnique({
            where: { id },
            include: { categoria: true },
        });
        if (!product) throw new NotFoundException('Producto no encontrado');
        return product;
    }

    async findBySlug(slug: string) {
        const product = await this.prisma.producto.findUnique({
            where: { slug },
            include: { categoria: true },
        });
        if (!product) throw new NotFoundException('Producto no encontrado');
        return product;
    }

    async update(id: string, updateProductDto: UpdateProductDto) {
        // Verificar que existe
        await this.findOne(id);
        const { categoriaId, ...data } = updateProductDto;
        const updateData: any = { ...data };
        if (categoriaId) {
            const category = await this.prisma.categoria.findUnique({ where: { id: categoriaId } });
            if (!category) throw new NotFoundException('Categoría no encontrada');
            updateData.categoria = { connect: { id: categoriaId } };
        }
        return this.prisma.producto.update({
            where: { id },
            data: updateData,
            include: { categoria: true },
        });
    }

    async remove(id: string) {
        await this.findOne(id);
        return this.prisma.producto.delete({ where: { id } });
    }
}