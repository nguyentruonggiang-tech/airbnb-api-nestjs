import { BadRequestException, Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import {
    CLOUDINARY_FOLDER,
    CLOUDINARY_URL,
} from 'src/common/constant/cloudinary.constant';

export type UploadImageResult = {
    url: string;
    publicId: string;
};

@Injectable()
export class CloudinaryService {
    getImageUrl(publicId: string | null): string | null {
        if (!publicId) {
            return null;
        }

        if (publicId.startsWith('http')) {
            return publicId;
        }

        if (!CLOUDINARY_URL) {
            return null;
        }

        cloudinary.config({
            cloudinary_url: CLOUDINARY_URL,
            secure: true,
        });

        return cloudinary.url(publicId, { secure: true });
    }

    uploadImage(file: Express.Multer.File, folder?: string): Promise<UploadImageResult> {
        if (!CLOUDINARY_URL) {
            throw new BadRequestException(
                'Thiếu cấu hình Cloudinary',
            );
        }

        cloudinary.config({
            cloudinary_url: CLOUDINARY_URL,
            secure: true,
        });

        const uploadFolder = folder
            ? `${CLOUDINARY_FOLDER}/${folder}`
            : CLOUDINARY_FOLDER;

        return new Promise((resolve, reject) => {
            const stream = cloudinary.uploader.upload_stream(
                {
                    folder: uploadFolder,
                    resource_type: 'image',
                },
                (error, result) => {
                    if (error || !result) {
                        reject(
                            new BadRequestException(
                                'Upload ảnh lên cloud thất bại',
                            ),
                        );
                        return;
                    }

                    resolve({
                        url: result.secure_url,
                        publicId: result.public_id,
                    });
                },
            );

            stream.end(file.buffer);
        });
    }
}
