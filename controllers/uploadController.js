const cloudinary = require('../config/cloudinary');

const streamUpload = (buffer) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder: 'qr-catalog/products' },
      (error, result) => (error ? reject(error) : resolve(result))
    );
    stream.end(buffer);
  });
};

// Receives image files, uploads each to Cloudinary, and hands back the
// public URLs. The frontend calls this once per color swatch before
// creating/updating the product, then sends the URLs along.
const uploadImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      res.status(400);
      throw new Error('No files uploaded');
    }

    const results = await Promise.all(req.files.map((file) => streamUpload(file.buffer)));
    const urls = results.map((r) => r.secure_url);

    res.json({ urls });
  } catch (err) {
    next(err);
  }
};

module.exports = { uploadImages };
