const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { register, login, getMe, updateProfile, changePassword, logout } = require('../controllers/authController');
const { protect } = require('../middleware/auth');

router.post('/register', [
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Please provide valid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters')
], register);

router.post('/login', login);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateProfile);
router.put('/password', protect, changePassword);
router.post('/logout', protect, logout);

module.exports = router;