import { Controller, Get, Post, Delete, Patch, Body, Param, Req, Headers, BadRequestException } from '@nestjs/common';
import { CartService } from './cart.service';
import { v4 as uuidv4 } from 'uuid';

@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) { }

    private getCartId(req: any): string {
        if (req.user?.userId) return `user:${req.user.userId}`;
        let cartId = req.headers['x-cart-id'] || req.cookies?.cartId;
        if (!cartId) cartId = `anon_${uuidv4()}`;
        return cartId;
    }

    @Get()
    async getCart(@Req() req: any) {
        const cartId = this.getCartId(req);
        const cart = await this.cartService.getCart(cartId);
        return { cartId, ...cart };
    }

    @Post('add')
    async addItem(@Req() req: any, @Body() body: { productId: string; quantity: number }) {
        if (!body.productId || !body.quantity) throw new BadRequestException('productId y quantity son requeridos');
        const cartId = this.getCartId(req);
        const cart = await this.cartService.addItem(cartId, body.productId, body.quantity);
        return { cartId, ...cart };
    }

    @Delete('remove/:productId')
    async removeItem(@Req() req: any, @Param('productId') productId: string) {
        const cartId = this.getCartId(req);
        const cart = await this.cartService.removeItem(cartId, productId);
        return { cartId, ...cart };
    }

    @Patch('update/:productId')
    async updateQuantity(@Req() req: any, @Param('productId') productId: string, @Body('quantity') quantity: number) {
        const cartId = this.getCartId(req);
        const cart = await this.cartService.updateQuantity(cartId, productId, quantity);
        return { cartId, ...cart };
    }

    @Delete('clear')
    async clearCart(@Req() req: any) {
        const cartId = this.getCartId(req);
        await this.cartService.clearCart(cartId);
        return { message: 'Carrito vaciado' };
    }
}