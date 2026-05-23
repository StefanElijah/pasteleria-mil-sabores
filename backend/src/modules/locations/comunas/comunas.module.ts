import { Module } from '@nestjs/common';
import { ComunasService } from './comunas.service';
import { ComunasController } from './comunas.controller';

@Module({
    controllers: [ComunasController],
    providers: [ComunasService],
})
export class ComunasModule { }