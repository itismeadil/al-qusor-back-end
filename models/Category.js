const mongoose = require('mongoose');

// Categories are added manually by the admin (e.g. "Sofas", "Dining Tables",
// "Bedroom", "Outdoor") — there's no fixed list, it grows over time.

const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true }
  },
  { timestamps: true }
);

// Basic default categories to seed into the DB if you want an initial list
const DEFAULT_CATEGORIES = [
  'Sofas',
  'Dining Tables',
  'Bedroom',
  'Outdoor',
  'Chairs',
  'Coffee Tables',
  'Tea Tables',
  'Storage',
  'Office'
];

categorySchema.statics.seedDefaults = async function () {
  const Category = this;
  for (const name of DEFAULT_CATEGORIES) {
    try {
      await Category.updateOne({ name }, { name }, { upsert: true });
    } catch (err) {
      // ignore duplicate or other write errors during seeding
    }
  }
};

const Category = mongoose.model('Category', categorySchema);
Category.DEFAULT_CATEGORIES = DEFAULT_CATEGORIES;

// Auto-seed defaults on model load
Category.seedDefaults().catch(err => console.error('Category seeding error:', err));

module.exports = Category;
