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
            data: {
                ...data,
                imagenes: data.imagenes || [],
                categoria: { connect: { id: categoriaId } },
            },
            include: { categoria: true },
        });
    }

    async findAll(onlyActive: boolean = true) {
        const where = onlyActive ? { activo: true } : {};
        return this.prisma.producto.findMany({
            where,
            include: { categoria: true },
            orderBy: { createdAt: 'desc' },
        });
    }

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

    async findFeatured() {
        return this.prisma.producto.findMany({
            where: { destacado: true, activo: true },
            take: 4,
            orderBy: { createdAt: 'desc' }
        });
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
        await this.findOne(id, true);
        const { categoriaId, slug, ...data } = updateProductDto;

        if (slug) {
            const existing = await this.prisma.producto.findFirst({
                where: { slug, id: { not: id } },
            });
            if (existing) throw new BadRequestException('El slug ya está en uso');
        }

        const updateData: any = { ...data, slug };

        // Normalizar imagenes: si se envía explícitamente, se usa (puede ser []). Si no se envía, no se toca.
        if (updateProductDto.imagenes !== undefined) {
            updateData.imagenes = updateProductDto.imagenes || [];
        }

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
        const product = await this.prisma.producto.findUnique({ where: { id } });
        if (!product) throw new NotFoundException('Producto no encontrado');
        return this.prisma.producto.update({
            where: { id },
            data: { activo: false },
        });
    }
}