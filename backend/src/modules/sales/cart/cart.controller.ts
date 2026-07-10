import { Controller, Get, Post, Delete, Patch, Body, Param, Req, Res, Headers, BadRequestException, UseGuards } from '@nestjs/common';
import type { Response } from 'express';
import { CartService } from './cart.service';
import { OptionalJwtAuthGuard } from '@modules/auth/guards/optional-jwt.guard';
import { v4 as uuidv4 } from 'uuid';

const CART_COOKIE = 'cartId';
const CART_COOKIE_MAX_AGE = 30 * 24 * 60 * 60 * 1000; // 30 días

@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) { }

    private setCartCookieIfAnon(res: Response, cartId: string) {
        if (cartId.startsWith('anon_')) {
            res.cookie(CART_COOKIE, cartId, {
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.COOKIE_SECURE === 'true',
                maxAge: CART_COOKIE_MAX_AGE,
                path: '/',
            });
        }
    }

    private getCartId(req: any): string {
        if (req.user?.userId) return `user:${req.user.userId}`;
        let cartId = req.headers['x-cart-id'] || req.cookies?.cartId;
        if (!cartId) cartId = `anon_${uuidv4()}`;
        return cartId;
    }

    @Get()
    @UseGuards(OptionalJwtAuthGuard)
    async getCart(@Req() req: any, @Res({ passthrough: true }) res: Response) {
        const cartId = this.getCartId(req);
        this.setCartCookieIfAnon(res, cartId);
        const cart = await this.cartService.getCart(cartId);
        return { cartId, ...cart };
    }

    @Post('add')
    @UseGuards(OptionalJwtAuthGuard)
    async addItem(
        @Req() req: any,
        @Res({ passthrough: true }) res: Response,
        @Body() body: { productId: string; quantity: number },
    ) {
        if (!body.productId || !body.quantity) throw new BadRequestException('productId y quantity son requeridos');
        const cartId = this.getCartId(req);
        this.setCartCookieIfAnon(res, cartId);
        const cart = await this.cartService.addItem(cartId, body.productId, body.quantity);
        return { cartId, ...cart };
    }

    @Delete('remove/:productId')
    @UseGuards(OptionalJwtAuthGuard)
    async removeItem(
        @Req() req: any,
        @Res({ passthrough: true }) res: Response,
        @Param('productId') productId: string,
    ) {
        const cartId = this.getCartId(req);
        this.setCartCookieIfAnon(res, cartId);
        const cart = await this.cartService.removeItem(cartId, productId);
        return { cartId, ...cart };
    }

    @Patch('update/:productId')
    @UseGuards(OptionalJwtAuthGuard)
    async updateQuantity(
        @Req() req: any,
        @Res({ passthrough: true }) res: Response,
        @Param('productId') productId: string,
        @Body('quantity') quantity: number,
    ) {
        const cartId = this.getCartId(req);
        this.setCartCookieIfAnon(res, cartId);
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
    async applyDiscount(
        @Req() req: any,
        @Res({ passthrough: true }) res: Response,
        @Body('codigo') codigo: string,
    ) {
        if (!codigo) throw new BadRequestException('El código de cupón es requerido');
        const cartId = this.getCartId(req);
        this.setCartCookieIfAnon(res, cartId);
        const cart = await this.cartService.applyDiscount(cartId, codigo, req.user?.userId);
        return { cartId, ...cart };
    }

    @Delete('discount')
    @UseGuards(OptionalJwtAuthGuard)
    async removeDiscount(
        @Req() req: any,
        @Res({ passthrough: true }) res: Response,
    ) {
        const cartId = this.getCartId(req);
        this.setCartCookieIfAnon(res, cartId);
        const cart = await this.cartService.removeDiscount(cartId);
        return { cartId, ...cart };
    }
}
