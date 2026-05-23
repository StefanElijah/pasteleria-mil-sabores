import { Injectable, Inject, NotFoundException } from '@nestjs/common';

@Injectable()
export class ComunasService {
    constructor(@Inject('PrismaClient') private prisma: any) { }

    async findAll(regionId?: string) {
        const where: any = {};
        if (regionId) where.regionId = regionId;
        return this.prisma.comuna.findMany({
            where,
            include: { region: true },
            orderBy: { nombre: 'asc' },
        });
    }

    async findOne(id: string) {
        const comuna = await this.prisma.comuna.findUnique({
            where: { id },
            include: { region: true },
        });
        if (!comuna) throw new NotFoundException('Comuna no encontrada');
        return comuna;
    }
}