const express = require('express');
const { getCategories, createCategory, getPublicCategories } = require('../controllers/categoryController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.get('/public', getPublicCategories);

router.route('/')
  .get(protect, getCategories)
  .post(protect, createCategory);

module.exports = router;
