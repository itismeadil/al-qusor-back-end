const QRCode = require('qrcode');
const cloudinary = require('../config/cloudinary');
const Product = require('../models/Product');

// @desc    Get all products (dashboard list view)
// @route   GET /api/products
// @access  Private
const getProducts = async (req, res, next) => {
  try {
    const products = await Product.find().populate('category', 'name').sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    next(err);
  }
};

// @desc    Get a single product's full details (admin click-through view)
// @route   GET /api/products/:id
// @access  Private
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    res.json(product);
  } catch (err) {
    next(err);
  }
};

// @desc    List all products for the public storefront home page
// @route   GET /api/products/public
// @access  Public
const getPublicProducts = async (req, res, next) => {
  try {
    const products = await Product.find()
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .select('name category price colors');
    res.json(products);
  } catch (err) {
    next(err);
  }
};

// @desc    Get a product for the public, customer-facing page (QR scan lands here)
// @route   GET /api/products/public/:id
// @access  Public
const getPublicProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    // Only send what a customer should see — no createdBy, no internal fields.
    res.json({
      _id: product._id,
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price,
      colors: product.colors
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create a product, then generate its QR code
// @route   POST /api/products
// @access  Private
const createProduct = async (req, res, next) => {
  try {
    const { name, category, description, price, colors } = req.body;

    if (!name || !category || price === undefined) {
      res.status(400);
      throw new Error('Name, category, and price are required');
    }

    const product = await Product.create({
      name,
      category,
      description,
      price,
      colors: colors || [],
      createdBy: req.admin._id
    });

    // The QR points to the public product page. CLIENT_URL is the
    // frontend's own address, so this needs to be set correctly in .env
    // for the printed QR codes to work once they're out in the store.
    const publicUrl = `${process.env.CLIENT_URL}/p/${product._id}`;
    const qrBuffer = await QRCode.toBuffer(publicUrl, { width: 500 });

    const qrResult = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: 'qr-catalog/qrcodes', public_id: String(product._id) },
        (error, result) => (error ? reject(error) : resolve(result))
      );
      stream.end(qrBuffer);
    });

    product.qrCodeUrl = qrResult.secure_url;
    await product.save();

    res.status(201).json(await product.populate('category', 'name'));
  } catch (err) {
    next(err);
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private
const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }

    const { name, description, price, category, colors } = req.body;

    product.name = name ?? product.name;
    product.description = description ?? product.description;
    product.price = price ?? product.price;
    product.category = category ?? product.category;
    product.colors = colors ?? product.colors;

    const updated = await product.save();
    res.json(await updated.populate('category', 'name'));
  } catch (err) {
    next(err);
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private
const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      res.status(404);
      throw new Error('Product not found');
    }
    await product.deleteOne();
    res.json({ message: 'Product removed' });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getProducts,
  getProductById,
  getPublicProducts,
  getPublicProduct,
  createProduct,
  updateProduct,
  deleteProduct
};
