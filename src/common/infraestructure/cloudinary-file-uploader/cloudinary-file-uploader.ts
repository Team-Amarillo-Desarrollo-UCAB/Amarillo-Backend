import { v2 as cloudinary, UploadApiErrorResponse, UploadApiResponse } from 'cloudinary';
import { IFileUploader } from "src/common/application/file-uploader/file-uploader.interface";
import { Readable } from 'stream';

export class CloudinaryFileUploader implements IFileUploader {

    // Bandera para asegurarse de que Cloudinary solo se configure una vez
    private static configurado = false;

    constructor() {
        if (!CloudinaryFileUploader.configurado) {
            cloudinary.config({
                cloud_name: "dxttqmyxu",
                api_key: process.env.CLOUDINARY_API_KEY,
                api_secret: process.env.CLOUDINARY_API_SECRET
            });
            CloudinaryFileUploader.configurado = true;
        }
    }

    // Método para limpiar el string base64 de la imagen
    private cleanBase64(base64String: string): string {
        const base64DataIndex = base64String.indexOf("base64,");
        return base64DataIndex !== -1 ? base64String.substring(base64DataIndex + 7) : base64String;
    }

    // Convierte el string base64 a Buffer
    private base64ToBuffer(base64: string): Buffer {
        return Buffer.from(base64, 'base64');
    }

    // Implementación del método de subida de archivo usando buffer
    async UploadFile(base64: string): Promise<string> {
        try {
            const base64Cleaned = this.cleanBase64(base64);
            const buffer = this.base64ToBuffer(base64Cleaned);

            // Cloudinary espera un stream, por lo que convertimos el buffer en un stream
            const stream = Readable.from(buffer);

            // Promesa para manejar el stream y la subida a Cloudinary
            const uploadResult = await new Promise<UploadApiResponse>((resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    (error, result) => {
                        if (error) return reject(error);
                        resolve(result as UploadApiResponse);
                    }
                );
                stream.pipe(uploadStream);
            });

            return uploadResult.secure_url;
        } catch (error) {
            const uploadError = error as UploadApiErrorResponse;
            console.error(`Error uploading image to Cloudinary: ${uploadError.message}`);
            throw new Error(error.message);
        }
    }
}