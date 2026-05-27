import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';
import { CloudinaryProvider } from './cloudinary.provider';
import { CloudinaryController } from './cloudinary.controller';

@Module({
    imports: [
        MulterModule.register({
            limits: { fileSize: 10 * 1024 * 1024 },
        }),
    ],
    providers: [CloudinaryService, CloudinaryProvider],
    controllers: [CloudinaryController],
    exports: [CloudinaryService],
})
export class CloudinaryModule { }