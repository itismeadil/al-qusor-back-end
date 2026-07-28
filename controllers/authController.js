const bcrypt = require('bcryptjs');
const Admin = require('../models/Admin');
const generateToken = require('../utils/generateToken');

// @desc    Manual login (no sign-up flow exists)
// @route   POST /api/auth/login
// @access  Public
const loginAdmin = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400);
      throw new Error('Username and password are required');
    }

    const admin = await Admin.findOne({ username });
    if (!admin) {
      res.status(401);
      throw new Error('Invalid username or password');
    }

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid username or password');
    }

    const token = generateToken(admin._id);

    // httpOnly cookie so the frontend never has to touch the token directly
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000
    });

    res.json({
      _id: admin._id,
      username: admin.username,
      shopName: admin.shopName,
      token // also returned for clients that prefer Authorization headers
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get logged-in admin's own profile (used to keep the session on refresh)
// @route   GET /api/auth/me
// @access  Private
const getMe = async (req, res) => {
  res.json(req.admin);
};

// @desc    Log out (clears the auth cookie)
// @route   POST /api/auth/logout
// @access  Private
const logoutAdmin = async (req, res) => {
  res.cookie('token', '', { httpOnly: true, expires: new Date(0) });
  res.json({ message: 'Logged out' });
};

module.exports = { loginAdmin, getMe, logoutAdmin };
