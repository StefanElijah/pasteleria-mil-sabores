import { Injectable, NotFoundException, Inject, BadRequestException, ConflictException } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
    constructor(@Inject('PrismaClient') private prisma: any) { }

    async create(createCategoryDto: CreateCategoryDto) {
        const { nombre, slug, descripcion, padreId, activo = true } = createCategoryDto;

        const existing = await this.prisma.categoria.findUnique({ where: { slug } });
        if (existing) throw new ConflictException('El slug ya existe');

        if (padreId) {
            const parent = await this.prisma.categoria.findUnique({ where: { id: padreId } });
            if (!parent) throw new BadRequestException('La categoría padre no existe');
        }

        const maxOrden = await this.prisma.categoria.aggregate({
            _max: { ordenVisual: true },
            where: { padreId: padreId || null },
        });
        const ordenVisual = (maxOrden._max.ordenVisual || 0) + 1;

        return this.prisma.categoria.create({
            data: {
                nombre,
                slug,
                descripcion: descripcion || null,
                padreId: padreId || null,
                ordenVisual,
                activo,
            },
            include: { padre: true },
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
            orderBy: [{ padreId: { sort: 'asc', nulls: 'first' } }, { ordenVisual: 'asc' }],
            include: {
                padre: { select: { id: true, nombre: true } },
                subcategorias: { where: { activo: true }, orderBy: { ordenVisual: 'asc' } },
                _count: { select: { productos: true, subcategorias: true } },
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
            include: {
                padre: { select: { id: true, nombre: true } },
                subcategorias: { orderBy: { ordenVisual: 'asc' } },
                productos: true,
                _count: { select: { productos: true, subcategorias: true } },
            },
        });
        if (!category) throw new NotFoundException('Categoría no encontrada');
        return category;
    }

    async findBySlug(slug: string) {
        const category = await this.prisma.categoria.findUnique({
            where: { slug, activo: true },
            include: {
                productos: { where: { activo: true } },
                padre: { select: { id: true, nombre: true, slug: true } },
                subcategorias: { where: { activo: true }, orderBy: { ordenVisual: 'asc' } },
            },
        });
        if (!category) throw new NotFoundException('Categoría no encontrada');
        return category;
    }

    async update(id: string, updateCategoryDto: UpdateCategoryDto) {
        await this.findOne(id, true);
        const { slug, nombre, padreId, ...data } = updateCategoryDto;

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

        if (padreId !== undefined) {
            if (padreId) {
                const parent = await this.prisma.categoria.findUnique({ where: { id: padreId } });
                if (!parent) throw new BadRequestException('La categoría padre no existe');

                if (padreId === id) throw new BadRequestException('Una categoría no puede ser su propio padre');

                const isDescendant = await this.isDescendant(padreId, id);
                if (isDescendant) {
                    throw new BadRequestException('No se puede asignar un descendiente como padre (ciclo jerárquico)');
                }

                const maxOrden = await this.prisma.categoria.aggregate({
                    _max: { ordenVisual: true },
                    where: { padreId },
                });
                data['ordenVisual'] = (maxOrden._max.ordenVisual || 0) + 1;
            } else {
                data['padreId'] = null;
            }
        }

        const updateData: any = { ...data, slug, nombre };
        if (padreId !== undefined) {
            updateData.padreId = padreId || null;
        }

        return this.prisma.categoria.update({
            where: { id },
            data: updateData,
            include: { padre: { select: { id: true, nombre: true } }, subcategorias: true },
        });
    }

    async remove(id: string) {
        const category = await this.prisma.categoria.findUnique({
            where: { id },
            include: {
                productos: { where: { activo: true } },
                subcategorias: true,
            },
        });
        if (!category) throw new NotFoundException('Categoría no encontrada');

        const activeProducts = category.productos.filter((p: any) => p.activo);
        if (activeProducts.length > 0) {
            throw new BadRequestException('No se puede eliminar una categoría que tiene productos activos');
        }

        const fullTreeProducts = await this.getFullTreeProducts(id);
        if (fullTreeProducts > 0) {
            throw new BadRequestException('No se puede eliminar: hay productos activos en las subcategorías');
        }

        return this.prisma.categoria.update({
            where: { id },
            data: { activo: false },
        });
    }

    async reordenar(ordenes: { id: string; ordenVisual: number }[]) {
        const ops = ordenes.map((o) =>
            this.prisma.categoria.update({
                where: { id: o.id },
                data: { ordenVisual: o.ordenVisual },
            })
        );
        await this.prisma.$transaction(ops);
        return { success: true };
    }

    private async isDescendant(ancestorId: string, childId: string): Promise<boolean> {
        const descendants = await this.prisma.categoria.findMany({
            where: { padreId: ancestorId },
        });
        for (const d of descendants) {
            if (d.id === childId) return true;
            if (await this.isDescendant(d.id, childId)) return true;
        }
        return false;
    }

    private async getFullTreeProducts(categoryId: string): Promise<number> {
        const subcats = await this.prisma.categoria.findMany({
            where: { padreId: categoryId },
            include: { productos: { where: { activo: true } } },
        });
        let count = 0;
        for (const sub of subcats) {
            count += sub.productos.length;
            count += await this.getFullTreeProducts(sub.id);
        }
        return count;
    }
}
