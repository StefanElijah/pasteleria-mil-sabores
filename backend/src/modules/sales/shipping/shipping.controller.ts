import { Controller, Post, Body } from '@nestjs/common';
import { ShippingService } from './shipping.service';

@Controller('shipping')
export class ShippingController {
    constructor(private readonly shippingService: ShippingService) { }

    @Post('calculate')
    async calculate(@Body() body: { comunaId: string; metodoEnvio: string }) {
        return this.shippingService.calculateShipping(body.comunaId, body.metodoEnvio);
    }
}