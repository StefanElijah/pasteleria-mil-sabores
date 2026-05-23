import { Injectable, NotFoundException, Inject, BadRequestException, ConflictException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
    constructor(@Inject('PrismaClient') private prisma: any) { }

    async create(createCategoryDto: CreateCategoryDto) {
        const { nombre, slug, icono, activo = true } = createCategoryDto;
        // Verificar slug único
        const existing = await this.prisma.categoria.findUnique({ where: { slug } });
        if (existing) throw new ConflictException('El slug ya existe');

        // Verificar nombre único (opcional, pero recomendado)
        const existingName = await this.prisma.categoria.findUnique({ where: { nombre } });
        if (existingName) throw new ConflictException('Ya existe una categoría con ese nombre');

        return this.prisma.categoria.create({
            data: { nombre, slug, icono, activo },
        });
    }

    async findAll(activo?: boolean) {
        const where: any = {};
        if (activo !== undefined) where.activo = activo;
        return this.prisma.categoria.findMany({
            where,
            orderBy: { nombre: 'asc' },
            include: { productos: { select: { id: true, nombre: true } } }, // opcional: contar productos
        });
    }

    async findOne(id: string) {
        const category = await this.prisma.categoria.findUnique({
            where: { id },
            include: { productos: true },
        });
        if (!category) throw new NotFoundException('Categoría no encontrada');
        return category;
    }

    async findBySlug(slug: string) {
        const category = await this.prisma.categoria.findUnique({
            where: { slug },
            include: { productos: { where: { activo: true } } },
        });
        if (!category) throw new NotFoundException('Categoría no encontrada');
        return category;
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto) {
        await this.findOne(id); // verificar existencia
        const { slug, nombre, ...data } = updateCategoryDto;

        // Si se envía slug, verificar que no esté en uso por otra categoría
        if (slug) {
            const existing = await this.prisma.categoria.findFirst({
                where: { slug, id: { not: id } },
            });
            if (existing) throw new ConflictException('El slug ya está en uso');
        }

        // Si se envía nombre, verificar que no esté en uso por otra categoría
        if (nombre) {
            const existingName = await this.prisma.categoria.findFirst({
                where: { nombre, id: { not: id } },
            });
            if (existingName) throw new ConflictException('Ya existe una categoría con ese nombre');
        }

        return this.prisma.categoria.update({
            where: { id },
            data: { ...data, slug, nombre },
        });
    }

    async remove(id: string) {
        // Verificar que no tenga productos asociados antes de eliminar
        const category = await this.prisma.categoria.findUnique({
            where: { id },
            include: { productos: { take: 1 } },
        });
        if (!category) throw new NotFoundException('Categoría no encontrada');
        if (category.productos.length > 0) {
            throw new BadRequestException('No se puede eliminar una categoría que tiene productos asociados');
        }
        return this.prisma.categoria.delete({ where: { id } });
    }
}