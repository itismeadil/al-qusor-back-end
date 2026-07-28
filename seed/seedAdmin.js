// One-time (or re-run anytime) script to create/update the single manual
// admin account, since this project has no public sign-up page.
//
// Usage:
//   1. Set ADMIN_USERNAME and ADMIN_PASSWORD in your .env
//   2. Run: npm run seed:admin
require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Admin = require('../models/Admin');

const run = async () => {
  await connectDB();

  const username = process.env.ADMIN_USERNAME;
  const plainPassword = process.env.ADMIN_PASSWORD;

  if (!username || !plainPassword) {
    console.error('ADMIN_USERNAME and ADMIN_PASSWORD must be set in .env');
    process.exit(1);
  }

  const hashedPassword = await bcrypt.hash(plainPassword, 10);

  const admin = await Admin.findOneAndUpdate(
    { username },
    { username, password: hashedPassword },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log(`Admin ready: ${admin.username} (id: ${admin._id})`);
  await mongoose.disconnect();
  process.exit(0);
};

run();
