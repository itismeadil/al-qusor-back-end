const mongoose = require('mongoose');

// Categories are added manually by the admin (e.g. "Sofas", "Dining Tables",
// "Bedroom", "Outdoor") — there's no fixed list, it grows over time.
const categorySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true, trim: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
