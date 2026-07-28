const Category = require('../models/Category');

// @desc    List all categories (for the dashboard's category dropdown)
// @route   GET /api/categories
// @access  Private
const getCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

// @desc    Add a new category manually
// @route   POST /api/categories
// @access  Private
const createCategory = async (req, res, next) => {
  try {
    const { name } = req.body;
    if (!name?.trim()) {
      res.status(400);
      throw new Error('Category name is required');
    }

    const existing = await Category.findOne({ name: name.trim() });
    if (existing) return res.status(200).json(existing); // idempotent, avoids dupes

    const category = await Category.create({ name: name.trim() });
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
};

// @desc    List categories for the public storefront filter bar
// @route   GET /api/categories/public
// @access  Public
const getPublicCategories = async (req, res, next) => {
  try {
    const categories = await Category.find().sort({ name: 1 });
    res.json(categories);
  } catch (err) {
    next(err);
  }
};

module.exports = { getCategories, createCategory, getPublicCategories };
