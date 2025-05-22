/*import multer from 'multer';
import path from 'path';
import fs from 'fs';

const uploadPath = 'uploads/';
if (!fs.existsSync(uploadPath)) {
    fs.mkdirSync(uploadPath);
}
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, uploadPath);
    },
    filename: function(req, file, cb) {
        const ext = path.extname(file.originalname);
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, uniqueName);
    }
});

const fileFilter = function(req, file, cb) {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Only image files are allowed!'));
    }
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 30 * 1024 * 1024,
    },
});

export const uploadMultipleImages = upload.array('images', 10);

export const uploadSingleImage = upload.single('image');

*/

// File: FileUploader.js
import multer from 'multer';
import path from 'path';
import fs from 'fs';

class FileUploader {
    constructor(uploadDir = 'uploads/') {
        this.uploadDir = uploadDir;

        // Create upload directory if not exists
        if (!fs.existsSync(this.uploadDir)) {
            fs.mkdirSync(this.uploadDir);
        }

        this.storage = multer.diskStorage({
            destination: (req, file, cb) => {
                cb(null, this.uploadDir);
            },
            filename: (req, file, cb) => {
                const ext = path.extname(file.originalname);
                const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
                cb(null, uniqueName);
            }
        });

        this.fileFilter = (req, file, cb) => {
            const allowedTypes = /jpeg|jpg|png|webp/;
            const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
            const mimetype = allowedTypes.test(file.mimetype);

            if (extname && mimetype) {
                cb(null, true);
            } else {
                cb(new Error('Only image files are allowed!'));
            }
        };

        this.upload = multer({
            storage: this.storage,
            fileFilter: this.fileFilter,
            limits: {
                fileSize: 30 * 1024 * 1024, // 30MB
            },
        });
    }

    uploadSingle(fieldName = 'image') {
        return this.upload.single(fieldName);
    }

    uploadMultiple(fieldName = 'images', maxCount = 10) {
        return this.upload.array(fieldName, maxCount);
    }
}

export default FileUploader;