import { Controller, Post, UploadedFile, UseInterceptors, BadRequestException } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from './cloudinary.service';

@Controller('upload')
export class CloudinaryController {
    constructor(private readonly cloudinaryService: CloudinaryService) { }

    @Post()
    @UseInterceptors(FileInterceptor('file'))
    async uploadImage(@UploadedFile() file: any) {
        if (!file) {
            throw new BadRequestException('El archivo es obligatorio.');
        }
        const imageUrl = await this.cloudinaryService.uploadImage(file);
        return { url: imageUrl };
    }
}