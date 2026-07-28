const express = require('express');
const {
  getProducts,
  getProductById,
  getPublicProducts,
  getPublicProduct,
  createProduct,
  updateProduct,
  deleteProduct
} = require('../controllers/productController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes must come before "/:id" so they aren't swallowed as an id
router.get('/public', getPublicProducts);
router.get('/public/:id', getPublicProduct);

router.route('/')
  .get(protect, getProducts)
  .post(protect, createProduct);

router.route('/:id')
  .get(protect, getProductById)
  .put(protect, updateProduct)
  .delete(protect, deleteProduct);

module.exports = router;
