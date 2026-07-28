const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

// Protects dashboard/product routes. Reads the token from the
// Authorization header ("Bearer <token>") or from an httpOnly cookie.
const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    res.status(401);
    return next(new Error('Not authorized, no token'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.admin = await Admin.findById(decoded.id).select('-password');
    next();
  } catch (err) {
    res.status(401);
    next(new Error('Not authorized, token failed'));
  }
};

module.exports = { protect };
