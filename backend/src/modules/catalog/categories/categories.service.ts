import { Injectable, NotFoundException, Inject, BadRequestException, ConflictException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
    constructor(@Inject('PrismaClient') private prisma: any) { }

    async create(createCategoryDto: CreateCategoryDto) {
        const { nombre, slug, activo = true } = createCategoryDto;
        const existing = await this.prisma.categoria.findUnique({ where: { slug } });
        if (existing) throw new ConflictException('El slug ya existe');
        const existingName = await this.prisma.categoria.findFirst({ where: { nombre } });
        if (existingName) throw new ConflictException('Ya existe una categoría con ese nombre');
        return this.prisma.categoria.create({
            data: { nombre, slug, activo },
        });
    }

    async findAll(activo?: boolean | null, includeProducts = false) {
        const where: any = {};
        if (activo === null) {
        } else if (activo !== undefined) {
            where.activo = activo;
        } else {
            where.activo = true;
        }
        return this.prisma.categoria.findMany({
            where,
            orderBy: { nombre: 'asc' },
            include: {
                _count: { select: { productos: true } },
                ...(includeProducts
                    ? { productos: { select: { id: true, nombre: true } } }
                    : {}),
            },
        });
    }

    async findOne(id: string, includeInactive = false) {
        const where: any = { id };
        if (!includeInactive) where.activo = true;
        const category = await this.prisma.categoria.findUnique({
            where,
            include: { productos: true },
        });
        if (!category) throw new NotFoundException('Categoría no encontrada');
        return category;
    }

    async findBySlug(slug: string) {
        const category = await this.prisma.categoria.findUnique({
            where: { slug, activo: true },
            include: { productos: { where: { activo: true } } },
        });
        if (!category) throw new NotFoundException('Categoría no encontrada');
        return category;
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto) {
        // Permitir actualizar incluso si está inactiva (para reactivarla)
        await this.findOne(id, true);
        const { slug, nombre, ...data } = updateCategoryDto;
        if (slug) {
            const existing = await this.prisma.categoria.findFirst({
                where: { slug, id: { not: id } },
            });
            if (existing) throw new ConflictException('El slug ya está en uso');
        }
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
        // Soft delete: solo si no tiene productos asociados
        const category = await this.prisma.categoria.findUnique({
            where: { id },
            include: { productos: { where: { activo: true }, take: 1 } },
        });
        if (!category) throw new NotFoundException('Categoría no encontrada');
        if (category.productos.length > 0) {
            throw new BadRequestException('No se puede eliminar una categoría que tiene productos asociados');
        }
        // Marcamos como inactiva en lugar de borrar
        return this.prisma.categoria.update({
            where: { id },
            data: { activo: false },
        });
    }
}