const express = require('express');
const upload = require('../middleware/upload');
const { uploadImages } = require('../controllers/uploadController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/', protect, upload.array('images', 10), uploadImages);

module.exports = router;
