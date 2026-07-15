import { Injectable, BadRequestException } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import toStream from 'buffer-to-stream';

@Injectable()
export class CloudinaryService {
    async uploadImage(file: any): Promise<string> {   // Cambiado a any
        if (!file) {
            throw new BadRequestException('No se ha proporcionado ningún archivo.');
        }
        if (!file.mimetype.startsWith('image/')) {
            throw new BadRequestException('El archivo debe ser una imagen válida.');
        }

        return new Promise((resolve, reject) => {
            const upload = cloudinary.uploader.upload_stream(
                {
                    folder: process.env.CLOUDINARY_FOLDER || 'pasteleria-mil-sabores/productos',
                    transformation: [{ width: 800, height: 800, crop: 'limit' }],
                },
                (error, result) => {
                    if (error || !result) {
                        return reject(new BadRequestException('Error al subir la imagen a Cloudinary.'));
                    }
                    resolve(result.secure_url);
                },
            );
            toStream(file.buffer).pipe(upload);
        });
    }
}