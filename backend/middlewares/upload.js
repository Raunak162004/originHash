import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get __dirname in ES Module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define upload path
const uploadPath = path.join(__dirname, '..', 'uploads', 'videos');

// Ensure the directory exists
if (!fs.existsSync(uploadPath)) {
  fs.mkdirSync(uploadPath, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const sanitizedFilename = file.originalname.replace(/\s+/g, '_');
    cb(null, `${timestamp}-${sanitizedFilename}`);
  },
});

// File filter to allow only videos
const fileFilter = (req, file, cb) => {
  const allowedExt = ['.mp4', '.mov', '.mkv'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (!allowedExt.includes(ext)) {
    return cb(new Error('Only video files are allowed (.mp4, .mov, .mkv)'));
  }

  cb(null, true);
};

// Final upload middleware
const upload = multer({
  storage,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB limit
  fileFilter,
});

export default upload;
