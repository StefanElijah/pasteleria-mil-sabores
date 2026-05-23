import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressesService {
    constructor(@Inject('PrismaClient') private prisma: any) { }

    async create(userId: string, createAddressDto: CreateAddressDto) {
        const { comunaId, regionId, isDefault, ...data } = createAddressDto;

        const comuna = await this.prisma.comuna.findUnique({ where: { id: comunaId } });
        if (!comuna) throw new NotFoundException('Comuna no encontrada');
        const region = await this.prisma.region.findUnique({ where: { id: regionId } });
        if (!region) throw new NotFoundException('Región no encontrada');

        if (isDefault) {
            await this.prisma.direccion.updateMany({
                where: { usuarioId: userId, isDefault: true },
                data: { isDefault: false },
            });
        }

        return this.prisma.direccion.create({
            data: {
                ...data,
                isDefault: isDefault || false,
                comuna: { connect: { id: comunaId } },
                region: { connect: { id: regionId } },
                usuario: { connect: { id: userId } },
            },
        });
    }

    async findAllByUser(userId: string) {
        return this.prisma.direccion.findMany({
            where: { usuarioId: userId },
            include: { comuna: true, region: true },
            orderBy: { isDefault: 'desc' },
        });
    }

    async findOne(id: string, userId: string) {
        const address = await this.prisma.direccion.findFirst({
            where: { id, usuarioId: userId },
            include: { comuna: true, region: true },
        });
        if (!address) throw new NotFoundException('Dirección no encontrada');
        return address;
    }

    async update(id: string, userId: string, updateAddressDto: UpdateAddressDto) {
        await this.findOne(id, userId);
        const { comunaId, regionId, isDefault, ...data } = updateAddressDto;

        if (isDefault) {
            await this.prisma.direccion.updateMany({
                where: { usuarioId: userId, isDefault: true, id: { not: id } },
                data: { isDefault: false },
            });
        }

        const updateData: any = { ...data, isDefault };
        if (comunaId) {
            const comuna = await this.prisma.comuna.findUnique({ where: { id: comunaId } });
            if (!comuna) throw new NotFoundException('Comuna no encontrada');
            updateData.comuna = { connect: { id: comunaId } };
        }
        if (regionId) {
            const region = await this.prisma.region.findUnique({ where: { id: regionId } });
            if (!region) throw new NotFoundException('Región no encontrada');
            updateData.region = { connect: { id: regionId } };
        }

        return this.prisma.direccion.update({
            where: { id },
            data: updateData,
        });
    }

    async remove(id: string, userId: string) {
        await this.findOne(id, userId);
        return this.prisma.direccion.delete({ where: { id } });
    }
}