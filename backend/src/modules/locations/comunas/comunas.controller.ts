import { Controller, Get, Param, Query } from '@nestjs/common';
import { ComunasService } from './comunas.service';

@Controller('comunas')
export class ComunasController {
    constructor(private readonly comunasService: ComunasService) { }

    @Get()
    async findAll(@Query('regionId') regionId?: string) {
        return this.comunasService.findAll(regionId);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.comunasService.findOne(id);
    }
}