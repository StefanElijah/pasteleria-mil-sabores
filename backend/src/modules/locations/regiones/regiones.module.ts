import { Module } from '@nestjs/common';
import { RegionesService } from './regiones.service';
import { RegionesController } from './regiones.controller';

@Module({
    controllers: [RegionesController],
    providers: [RegionesService],
})
export class RegionesModule { }