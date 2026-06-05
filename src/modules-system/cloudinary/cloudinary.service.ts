import { BadRequestException, Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import {
    CLOUDINARY_FOLDER,
    CLOUDINARY_URL,
} from 'src/common/constant/cloudinary.constant';
import {
    UPLOAD_ALLOWED_MIME_TYPES,
    UPLOAD_MAX_SIZE_BYTES,
} from 'src/common/constant/upload.constant';

export type UploadImageResult = {
    url: string;
    publicId: string;
};

@Injectable()
export class CloudinaryService {
    constructor() {
        if (CLOUDINARY_URL) {
            cloudinary.config({ cloudinary_url: CLOUDINARY_URL, secure: true });
        }
    }

    getImageUrl(publicId: string | null): string | null {
        if (!publicId) {
            return null;
        }

        if (publicId.startsWith('http')) {
            return publicId;
        }

        if (!CLOUDINARY_URL) {
            return publicId;
        }

        return cloudinary.url(publicId, { secure: true });
    }

    validateImageFile(file?: Express.Multer.File): void {
        if (!file) {
            throw new BadRequestException('Vui lòng chọn file ảnh');
        }

        if (!UPLOAD_ALLOWED_MIME_TYPES.includes(file.mimetype as typeof UPLOAD_ALLOWED_MIME_TYPES[number])) {
            throw new BadRequestException('File phải là ảnh (jpeg, png, gif, webp)');
        }

        if (file.size > UPLOAD_MAX_SIZE_BYTES) {
            throw new BadRequestException('Kích thước file không được vượt quá 5MB');
        }
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
