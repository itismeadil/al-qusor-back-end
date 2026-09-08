const mongoose = require("mongoose");

// Categories are added manually by the admin (e.g. "Sofas", "Dining Tables",
// "Bedroom", "Outdoor") — there's no fixed list, it grows over time.

const categorySchema = new mongoose.Schema(
  {
    nameAr: { type: String, required: true, unique: true, trim: true },
    nameEn: { type: String, trim: true },
  },
  { timestamps: true },
);

// Basic default categories to seed into the DB if you want an initial list
const DEFAULT_CATEGORIES = [
  { nameAr: "كنب", nameEn: "Sofas" },
  { nameAr: "طاولات طعام", nameEn: "Dining Tables" },
  { nameAr: "غرف نوم", nameEn: "Bedroom" },
  { nameAr: "أثاث خارجي", nameEn: "Outdoor" },
  { nameAr: "كراسي", nameEn: "Chairs" },
  { nameAr: "طاولات قهوة", nameEn: "Coffee Tables" },
  { nameAr: "طاولات شاي", nameEn: "Tea Tables" },
  { nameAr: "تخزين", nameEn: "Storage" },
  { nameAr: "مكتب", nameEn: "Office" },
];

categorySchema.statics.seedDefaults = async function () {
  const Category = this;
  for (const { nameAr, nameEn } of DEFAULT_CATEGORIES) {
    try {
      await Category.updateOne(
        { nameAr },
        { nameAr, nameEn },
        { upsert: true, runValidators: true },
      );
    } catch (err) {
      console.error(`Failed to seed category "${nameAr}":`, err.message);
    }
  }
};

const Category = mongoose.model("Category", categorySchema);
Category.DEFAULT_CATEGORIES = DEFAULT_CATEGORIES;

// Auto-seed defaults on model load
Category.seedDefaults().catch((err) =>
  console.error("Category seeding error:", err),
);

module.exports = Category;
