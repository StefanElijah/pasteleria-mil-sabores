import { Injectable, Inject, NotFoundException, BadRequestException } from '@nestjs/common';
import Redis from 'ioredis';

@Injectable()
export class CartService {
    private readonly CART_TTL = 60 * 60 * 24 * 30; // 30 días

    constructor(
        @Inject('REDIS_CLIENT') private readonly redis: Redis,
        @Inject('PrismaClient') private readonly prisma: any,
    ) { }

    private getCartKey(cartId: string): string {
        return `cart:${cartId}`;
    }

    async getCart(cartId: string) {
        const key = this.getCartKey(cartId);
        const data = await this.redis.get(key);
        if (!data) return { items: [], total: 0 };
        return JSON.parse(data);
    }

    async addItem(cartId: string, productId: string, quantity: number) {
        if (quantity <= 0) throw new BadRequestException('La cantidad debe ser mayor a 0');
        const cart = await this.getCart(cartId);
        const product = await this.prisma.producto.findUnique({
            where: { id: productId, activo: true },
        });
        if (!product) throw new NotFoundException('Producto no disponible');
        if (product.stock < quantity) throw new BadRequestException('Stock insuficiente');

        const existingIndex = cart.items.findIndex(item => item.productId === productId);
        if (existingIndex >= 0) {
            cart.items[existingIndex].quantity += quantity;
        } else {
            cart.items.push({
                productId: product.id,
                name: product.nombre,
                price: product.precio,
                quantity,
                image: product.imagenes?.[0] || null,
            });
        }
        cart.total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        await this.redis.setex(this.getCartKey(cartId), this.CART_TTL, JSON.stringify(cart));
        return cart;
    }

    async removeItem(cartId: string, productId: string) {
        const cart = await this.getCart(cartId);
        const newItems = cart.items.filter(item => item.productId !== productId);
        if (newItems.length === cart.items.length) throw new NotFoundException('Producto no encontrado en el carrito');
        cart.items = newItems;
        cart.total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        await this.redis.setex(this.getCartKey(cartId), this.CART_TTL, JSON.stringify(cart));
        return cart;
    }

    async updateQuantity(cartId: string, productId: string, quantity: number) {
        if (quantity < 0) throw new BadRequestException('La cantidad no puede ser negativa');
        if (quantity === 0) return this.removeItem(cartId, productId);
        const cart = await this.getCart(cartId);
        const item = cart.items.find(item => item.productId === productId);
        if (!item) throw new NotFoundException('Producto no encontrado en el carrito');
        const product = await this.prisma.producto.findUnique({ where: { id: productId } });
        if (product && product.stock < quantity) throw new BadRequestException('Stock insuficiente');
        item.quantity = quantity;
        cart.total = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        await this.redis.setex(this.getCartKey(cartId), this.CART_TTL, JSON.stringify(cart));
        return cart;
    }

    async clearCart(cartId: string) {
        await this.redis.del(this.getCartKey(cartId));
    }

    async mergeCarts(anonCartId: string, userId: string) {
        const anonCart = await this.getCart(anonCartId);
        if (!anonCart.items.length) return;
        const userCartKey = `cart:user:${userId}`;
        let userCart = await this.getCart(userCartKey);
        // Fusionar items (sumar cantidades)
        for (const anonItem of anonCart.items) {
            const existing = userCart.items.find(i => i.productId === anonItem.productId);
            if (existing) existing.quantity += anonItem.quantity;
            else userCart.items.push(anonItem);
        }
        userCart.total = userCart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
        await this.redis.setex(userCartKey, this.CART_TTL, JSON.stringify(userCart));
        await this.redis.del(this.getCartKey(anonCartId));
    }
}