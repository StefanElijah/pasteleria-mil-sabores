import { Controller, Get, Post, Delete, Patch, Body, Param, Req, Headers, BadRequestException, UseGuards } from '@nestjs/common';
import { CartService } from './cart.service';
import { OptionalJwtAuthGuard } from '@modules/auth/guards/optional-jwt.guard';
import { v4 as uuidv4 } from 'uuid';

@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) { }

    private getCartId(req: any): string {
        // Si el usuario está autenticado, usamos su ID
        if (req.user?.userId) return `user:${req.user.userId}`;
        // Si no, usamos el header x-cart-id o generamos uno nuevo
        let cartId = req.headers['x-cart-id'] || req.cookies?.cartId;
        if (!cartId) cartId = `anon_${uuidv4()}`;
        return cartId;
    }

    @Get()
    @UseGuards(OptionalJwtAuthGuard)
    async getCart(@Req() req: any) {
        const cartId = this.getCartId(req);
        const cart = await this.cartService.getCart(cartId);
        return { cartId, ...cart };
    }

    @Post('add')
    @UseGuards(OptionalJwtAuthGuard)
    async addItem(@Req() req: any, @Body() body: { productId: string; quantity: number }) {
        if (!body.productId || !body.quantity) throw new BadRequestException('productId y quantity son requeridos');
        const cartId = this.getCartId(req);
        const cart = await this.cartService.addItem(cartId, body.productId, body.quantity);
        return { cartId, ...cart };
    }

    @Delete('remove/:productId')
    @UseGuards(OptionalJwtAuthGuard)
    async removeItem(@Req() req: any, @Param('productId') productId: string) {
        const cartId = this.getCartId(req);
        const cart = await this.cartService.removeItem(cartId, productId);
        return { cartId, ...cart };
    }

    @Patch('update/:productId')
    @UseGuards(OptionalJwtAuthGuard)
    async updateQuantity(@Req() req: any, @Param('productId') productId: string, @Body('quantity') quantity: number) {
        const cartId = this.getCartId(req);
        const cart = await this.cartService.updateQuantity(cartId, productId, quantity);
        return { cartId, ...cart };
    }

    @Delete('clear')
    @UseGuards(OptionalJwtAuthGuard)
    async clearCart(@Req() req: any) {
        const cartId = this.getCartId(req);
        await this.cartService.clearCart(cartId);
        return { message: 'Carrito vaciado' };
    }

    @Post('discount')
    @UseGuards(OptionalJwtAuthGuard)
    async applyDiscount(@Req() req: any, @Body('codigo') codigo: string) {
        if (!codigo) throw new BadRequestException('El código de cupón es requerido');
        const cartId = this.getCartId(req);
        const cart = await this.cartService.applyDiscount(cartId, codigo, req.user?.userId);
        return { cartId, ...cart };
    }

    @Delete('discount')
    @UseGuards(OptionalJwtAuthGuard)
    async removeDiscount(@Req() req: any) {
        const cartId = this.getCartId(req);
        const cart = await this.cartService.removeDiscount(cartId);
        return { cartId, ...cart };
    }
}