import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';
import { extname, join } from 'path';
import { existsSync, mkdirSync } from 'fs';

export const multerConfig: MulterOptions = {
    storage: diskStorage({
        destination: (req, file, cb) => {
            const uploadPath = join(process.cwd(), 'uploads', 'innovations');

            // Papka yo'q bo'lsa yaratish
            if (!existsSync(uploadPath)) {
                mkdirSync(uploadPath, { recursive: true });
            }

            cb(null, uploadPath);
        },
        filename: (req, file, cb) => {
            // Unique filename yaratish
            const name = file.originalname.split('.')[0];
            const fileExtName = extname(file.originalname);
            const randomName = Array(4)
                .fill(null)
                .map(() => Math.round(Math.random() * 16).toString(16))
                .join('');

            cb(null, `${name}-${Date.now()}-${randomName}${fileExtName}`);
        },
    }),
    limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
    },
    fileFilter: (req, file, cb) => {
        // Faqat rasm fayllari
        const allowedMimes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];

        if (allowedMimes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only image files are allowed!'), false);
        }
    },
};