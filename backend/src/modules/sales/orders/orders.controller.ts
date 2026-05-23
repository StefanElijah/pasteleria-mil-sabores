import { Controller, Get, Post, Body, Patch, Param, UseGuards, Req } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';
import { OptionalJwtAuthGuard } from '@modules/auth/guards/optional-jwt.guard';
import { RolesGuard } from '@modules/auth/guards/roles.guard';
import { Roles } from '@modules/auth/decorators/roles.decorator';

@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    @UseGuards(OptionalJwtAuthGuard)
    async create(@Req() req: any, @Body() createOrderDto: CreateOrderDto) {
        const userId = req.user?.userId || null;
        let cartId = req.headers['x-cart-id'] || req.cookies?.cartId;
        if (userId) cartId = `user:${userId}`;
        return this.ordersService.create(userId, createOrderDto, cartId);
    }

    @Get()
    @UseGuards(JwtAuthGuard)
    async findAll(@Req() req: any) {
        return this.ordersService.findAllByUser(req.user.userId);
    }

    @Get(':id')
    @UseGuards(JwtAuthGuard)
    async findOne(@Param('id') id: string, @Req() req: any) {
        return this.ordersService.findOne(id, req.user.userId);
    }

    @Patch(':id/status')
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles('ADMIN')
    async updateStatus(@Param('id') id: string, @Body('estado') estado: string) {
        return this.ordersService.updateStatus(id, estado as any);
    }
}