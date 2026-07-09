import { Controller, Get, Patch, Delete, Body, Req, UseGuards } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { UpdateDraftDto } from './dto/update-draft.dto';
import { JwtAuthGuard } from '@modules/auth/guards/jwt-auth.guard';

@Controller('checkout')
@UseGuards(JwtAuthGuard)
export class CheckoutController {
    constructor(private readonly checkoutService: CheckoutService) { }

    @Get('draft')
    async getDraft(@Req() req: any) {
        return this.checkoutService.getDraft(req.user.userId);
    }

    @Patch('draft')
    async updateDraft(@Req() req: any, @Body() dto: UpdateDraftDto) {
        return this.checkoutService.updateDraft(req.user.userId, dto);
    }

    @Delete('draft')
    async deleteDraft(@Req() req: any) {
        return this.checkoutService.deleteDraft(req.user.userId);
    }
}
