const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create uploads directory if not exists
const uploadDir = path.join(__dirname, '../../uploads'); ;
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Storage settings for multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});

// Allowed file types: images (jpeg, png, webp), video (mp4)
const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'video/mp4'];

const fileFilter = (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Only JPEG, PNG, WEBP images and MP4 videos are allowed'));
  }
};

// Limit: max 4 files (3 images + 1 video max, will validate in controller)
const upload = multer({
  storage,
  fileFilter,
  limits: { files: 4 }
});

module.exports = upload;
