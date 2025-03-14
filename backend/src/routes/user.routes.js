const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authMiddleware } = require('../middleware/auth');

/**
 * @route   GET /api/users/me
 * @desc    Get current user profile
 * @access  Private
 */
router.get('/me', authMiddleware, userController.getProfile);

/**
 * @route   PUT /api/users/me
 * @desc    Update current user profile
 * @access  Private
 */
router.put('/me', authMiddleware, userController.updateProfile);

/**
 * @route   GET /api/users/wallet
 * @desc    Get user wallet information
 * @access  Private
 */
router.get('/wallet', authMiddleware, userController.getWallet);

/**
 * @route   GET /api/users/payment-methods
 * @desc    Get user payment methods
 * @access  Private
 */
router.get('/payment-methods', authMiddleware, userController.getPaymentMethods);

module.exports = router;