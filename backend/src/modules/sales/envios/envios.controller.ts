import {
  Controller,
  Get,
  Patch,
  Param,
  Query,
  Body,
  UseGuards,
} from '@nestjs/common';
import { EnviosService } from './envios.service';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from '@/modules/auth/guards/roles.guard';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { ParseCuidPipe } from '@/lib/parse-cuid.pipe';

@Controller('envios')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN', 'MODERADOR')
export class EnviosController {
  constructor(private readonly enviosService: EnviosService) {}

  @Get()
  async findAll(
    @Query('page') page?: string,
    @Query('size') size?: string,
    @Query('estadoEnvio') estadoEnvio?: string,
  ) {
    const p = page !== undefined ? parseInt(page, 10) : undefined;
    const s = size !== undefined ? parseInt(size, 10) : undefined;
    return this.enviosService.findAll(p, s, estadoEnvio);
  }

  @Get('problemas')
  async findProblemas() {
    return this.enviosService.findProblemas();
  }

  @Get('pedido/:pedidoId')
  async findByPedidoId(@Param('pedidoId', ParseCuidPipe) pedidoId: string) {
    return this.enviosService.findByPedidoId(pedidoId);
  }

  @Get('tracking/:tracking')
  async findByTracking(@Param('tracking') tracking: string) {
    return this.enviosService.findByTracking(decodeURIComponent(tracking));
  }

  @Get(':id')
  async findOne(@Param('id', ParseCuidPipe) id: string) {
    return this.enviosService.findOne(id);
  }

  @Patch(':id/estado')
  async updateEstado(
    @Param('id', ParseCuidPipe) id: string,
    @Body('estadoEnvio') estado: string,
  ) {
    return this.enviosService.updateEstado(id, estado);
  }
}
