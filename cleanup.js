// cleanup.js
const mongoose = require("mongoose");
const Category = require("./models/Category"); // adjust path

async function run() {
  await mongoose.connect("your-mongodb-connection-string");
  const result = await Category.deleteMany({ nameAr: { $exists: false } });
  console.log(`Deleted ${result.deletedCount} broken category documents`);
  await mongoose.disconnect();
}

run();
