import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import { CreateAddressDto } from './dto/create-address.dto';
import { UpdateAddressDto } from './dto/update-address.dto';

@Injectable()
export class AddressesService {
    constructor(@Inject('PrismaClient') private prisma: any) { }

    async create(userId: string, createAddressDto: CreateAddressDto) {
        const { comunaId, isDefault, ...data } = createAddressDto;

        // Verificar que la comuna existe
        const comuna = await this.prisma.comuna.findUnique({ where: { id: comunaId } });
        if (!comuna) throw new NotFoundException('Comuna no encontrada');

        // Si es dirección por defecto, desmarcar otras
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
                usuario: { connect: { id: userId } },
            },
            include: { comuna: true }, // incluir comuna para respuesta
        });
    }

    async findAllByUser(userId: string) {
        return this.prisma.direccion.findMany({
            where: { usuarioId: userId },
            include: { comuna: { include: { region: true } } }, // anidar región a través de comuna
            orderBy: { isDefault: 'desc' },
        });
    }

    async findOne(id: string, userId: string) {
        const address = await this.prisma.direccion.findFirst({
            where: { id, usuarioId: userId },
            include: { comuna: { include: { region: true } } },
        });
        if (!address) throw new NotFoundException('Dirección no encontrada');
        return address;
    }

    async update(id: string, userId: string, updateAddressDto: UpdateAddressDto) {
        await this.findOne(id, userId);
        const { comunaId, isDefault, ...data } = updateAddressDto;

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

        return this.prisma.direccion.update({
            where: { id },
            data: updateData,
            include: { comuna: { include: { region: true } } },
        });
    }

    async remove(id: string, userId: string) {
        await this.findOne(id, userId);
        return this.prisma.direccion.delete({ where: { id } });
    }
}