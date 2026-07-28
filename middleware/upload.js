const multer = require('multer');

// Files are kept in memory only long enough to stream straight to
// Cloudinary — nothing is written to local disk, and nothing binary
// ever touches MongoDB (it only ever stores the resulting URL string).
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) cb(null, true);
  else cb(new Error('Only image files are allowed'));
};

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

module.exports = upload;
