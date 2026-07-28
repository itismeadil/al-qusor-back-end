const express = require('express');
const { loginAdmin, getMe, logoutAdmin } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/login', loginAdmin);
router.post('/logout', protect, logoutAdmin);
router.get('/me', protect, getMe);

module.exports = router;
