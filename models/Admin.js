const mongoose = require('mongoose');

// There is no public sign-up. Admin accounts are created only via
// `npm run seed:admin` (see seed/seedAdmin.js), so this collection
// will usually hold just one shopkeeper/admin document.
const adminSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true }, // stored as a bcrypt hash
    shopName: { type: String, default: '' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Admin', adminSchema);
