import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import Redis from 'ioredis';
import { UpdateDraftDto } from './dto/update-draft.dto';

@Injectable()
export class CheckoutService {
    private readonly DRAFT_TTL = 7 * 24 * 60 * 60; // 7 días

    constructor(
        @Inject('REDIS_CLIENT') private readonly redis: Redis,
        @Inject('PrismaClient') private readonly prisma: any,
    ) { }

    private getCacheKey(userId: string): string {
        return `draft:active:${userId}`;
    }

    async getDraft(userId: string) {
        // 1. Buscar en Redis
        const cachedId = await this.redis.get(this.getCacheKey(userId));

        if (cachedId) {
            const draft = await this.prisma.pedidoBorrador.findUnique({ where: { id: cachedId } });
            if (draft) return draft;
        }

        // 2. Buscar el más reciente en Prisma
        const existing = await this.prisma.pedidoBorrador.findFirst({
            where: { usuarioId: userId },
            orderBy: { updatedAt: 'desc' },
        });

        if (existing) {
            await this.redis.setex(this.getCacheKey(userId), this.DRAFT_TTL, existing.id);
            return existing;
        }

        // 3. Crear uno nuevo vacío
        const newDraft = await this.prisma.pedidoBorrador.create({
            data: { usuarioId: userId },
        });
        await this.redis.setex(this.getCacheKey(userId), this.DRAFT_TTL, newDraft.id);
        return newDraft;
    }

    async updateDraft(userId: string, dto: UpdateDraftDto) {
        const draft = await this.getDraft(userId);

        const updated = await this.prisma.pedidoBorrador.update({
            where: { id: draft.id },
            data: {
                recipient: dto.recipient !== undefined ? dto.recipient : draft.recipient,
                address: dto.address !== undefined ? dto.address : draft.address,
                shippingMethod: dto.shippingMethod !== undefined ? dto.shippingMethod : draft.shippingMethod,
                paymentMethod: dto.paymentMethod !== undefined ? dto.paymentMethod : draft.paymentMethod,
            },
        });
        await this.redis.setex(this.getCacheKey(userId), this.DRAFT_TTL, updated.id);
        return updated;
    }

    async deleteDraft(userId: string) {
        const draft = await this.prisma.pedidoBorrador.findFirst({
            where: { usuarioId: userId },
        });
        if (draft) {
            await this.prisma.pedidoBorrador.delete({ where: { id: draft.id } });
        }
        await this.redis.del(this.getCacheKey(userId));
        return { message: 'Borrador eliminado' };
    }
}
