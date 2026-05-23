import { Controller, Get, Param } from '@nestjs/common';
import { RegionesService } from './regiones.service';

@Controller('regiones')
export class RegionesController {
    constructor(private readonly regionesService: RegionesService) { }

    @Get()
    async findAll() {
        return this.regionesService.findAll();
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.regionesService.findOne(id);
    }

    @Get(':id/comunas')
    async getComunas(@Param('id') id: string) {
        return this.regionesService.findComunasByRegion(id);
    }
}