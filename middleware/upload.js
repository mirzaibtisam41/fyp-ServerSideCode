const multer = require('multer');
const path = require('path');
const crypto = require('crypto');
const fs = require('fs');
const ApiError = require('../utils/ApiError');

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
const ALLOWED = /jpeg|jpg|png|webp|gif/;

// Builds a multer instance that writes to uploads/<subdir> with a random,
// collision-free filename (the old code used the original filename, which
// allowed overwrites and path traversal) and rejects non-images.
const createUploader = (subdir) => {
  const dest = path.join('uploads', subdir);
  fs.mkdirSync(dest, {recursive: true});

  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, dest),
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname).toLowerCase();
      const name = crypto.randomBytes(16).toString('hex');
      cb(null, `${name}${ext}`);
    },
  });

  const fileFilter = (req, file, cb) => {
    const extOk = ALLOWED.test(path.extname(file.originalname).toLowerCase());
    const mimeOk = ALLOWED.test(file.mimetype);
    if (extOk && mimeOk) return cb(null, true);
    cb(new ApiError(400, 'Only image files (jpg, png, webp, gif) are allowed'));
  };

  return multer({storage, fileFilter, limits: {fileSize: MAX_FILE_SIZE}});
};

module.exports = createUploader;
