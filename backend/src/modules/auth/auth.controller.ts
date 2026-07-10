import { Controller, Post, Get, Body, Headers, Req, Res, UseGuards, HttpCode, HttpStatus } from '@nestjs/common';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { JwtRefreshAuthGuard } from './guards/jwt-refresh.guard';
import { Throttle } from '@nestjs/throttler';

const ACCESS_TOKEN_COOKIE = 'access_token';
const REFRESH_TOKEN_COOKIE = 'refresh_token';
const REFRESH_PATH = '/api/auth';
const ACCESS_MAX_AGE = 15 * 60; // 15 min
const REFRESH_MAX_AGE = 7 * 24 * 60 * 60; // 7 days
const COOKIE_SECURE = process.env.COOKIE_SECURE === 'true';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    private setTokenCookies(res: Response, accessToken: string, refreshToken: string, rememberMe: boolean) {
        const accessMaxAge = rememberMe ? 30 * 24 * 60 * 60 : ACCESS_MAX_AGE;
        res.cookie(ACCESS_TOKEN_COOKIE, accessToken, {
            httpOnly: true,
            sameSite: 'strict',
            secure: COOKIE_SECURE,
            maxAge: accessMaxAge * 1000,
            path: '/',
        });
        res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
            httpOnly: true,
            sameSite: 'strict',
            secure: COOKIE_SECURE,
            maxAge: REFRESH_MAX_AGE * 1000,
            path: REFRESH_PATH,
        });
    }

    private clearTokenCookies(res: Response) {
        res.clearCookie(ACCESS_TOKEN_COOKIE, { path: '/', secure: COOKIE_SECURE });
        res.clearCookie(REFRESH_TOKEN_COOKIE, { path: REFRESH_PATH, secure: COOKIE_SECURE });
    }

    @Post('register')
    @Throttle({ default: { limit: 3, ttl: 60000 } })
    async register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @Throttle({ default: { limit: 5, ttl: 60000 } })
    async login(
        @Body() loginDto: LoginDto,
        @Headers('x-cart-id') anonCartId: string | undefined,
        @Req() req: any,
        @Res({ passthrough: true }) res: Response,
    ) {
        const cartIdFromCookie = req.cookies?.cartId;
        const finalAnonCartId = anonCartId || (cartIdFromCookie?.startsWith('anon_') ? cartIdFromCookie : undefined);
        const result = await this.authService.login(loginDto, finalAnonCartId);
        this.setTokenCookies(res, result.access_token, result.refresh_token, !!loginDto.rememberMe);
        // Limpiar cookie de carrito anon (ya se mergeó al user)
        res.clearCookie('cartId', { path: '/' });
        return { user: result.user };
    }

    @Post('logout')
    @HttpCode(HttpStatus.OK)
    async logout(@Res({ passthrough: true }) res: Response) {
        this.clearTokenCookies(res);
        res.clearCookie('cartId', { path: '/' });
        return { message: 'Sesión cerrada' };
    }

    @Post('refresh')
    @HttpCode(HttpStatus.OK)
    @UseGuards(JwtRefreshAuthGuard)
    async refresh(
        @Req() req: any,
        @Res({ passthrough: true }) res: Response,
    ) {
        const tokens = await this.authService.refresh(req.user.userId);
        this.setTokenCookies(res, tokens.access_token, tokens.refresh_token, true);
        return { message: 'Token renovado' };
    }

    @Get('me')
    @UseGuards(JwtAuthGuard)
    async me(@Req() req: any) {
        return this.authService.findById(req.user.userId);
    }
}
