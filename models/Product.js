const mongoose = require('mongoose');

// One color option for a product. Each color has its own set of clean
// photos, since a sofa in "Charcoal" and the same sofa in "Sand" need
// different images on the customer-facing page.
const colorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true }, // e.g. "Charcoal Grey"
    images: [{ type: String }] // URLs only — the files live on disk/cloud, not in Mongo
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
    description: { type: String, default: '' },
    price: { type: Number, required: true }, // stored as a plain number, in SAR (Riyal)
    colors: [colorSchema],

    // Generated automatically right after the product is created —
    // points to the public detail page customers land on after scanning.
    qrCodeUrl: { type: String, default: '' },

    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
