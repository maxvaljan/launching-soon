const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

/**
 * @route   GET /api/orders
 * @desc    Get all orders (admin only)
 * @access  Private/Admin
 */
router.get(
  '/',
  authMiddleware,
  roleMiddleware(['admin']),
  orderController.getAllOrders
);

/**
 * @route   GET /api/orders/customer/me
 * @desc    Get current customer's orders
 * @access  Private/Customer
 */
router.get(
  '/customer/me',
  authMiddleware,
  roleMiddleware(['customer', 'business']),
  orderController.getCustomerOrders
);

/**
 * @route   GET /api/orders/driver/me
 * @desc    Get current driver's orders
 * @access  Private/Driver
 */
router.get(
  '/driver/me',
  authMiddleware,
  roleMiddleware(['driver']),
  orderController.getDriverOrders
);

/**
 * @route   GET /api/orders/:id
 * @desc    Get order by ID
 * @access  Private
 */
router.get(
  '/:id',
  authMiddleware,
  orderController.getOrderById
);

/**
 * @route   POST /api/orders
 * @desc    Create a new order
 * @access  Private/Customer
 */
router.post(
  '/',
  authMiddleware,
  roleMiddleware(['customer', 'business']),
  orderController.createOrder
);

/**
 * @route   PATCH /api/orders/:id/status
 * @desc    Update order status
 * @access  Private
 */
router.patch(
  '/:id/status',
  authMiddleware,
  orderController.updateOrderStatus
);

/**
 * @route   POST /api/orders/:orderId/assign
 * @desc    Assign driver to order
 * @access  Private/Admin
 */
router.post(
  '/:orderId/assign',
  authMiddleware,
  roleMiddleware(['admin']),
  orderController.assignDriver
);

/**
 * @route   DELETE /api/orders/:id
 * @desc    Cancel an order
 * @access  Private
 */
router.delete(
  '/:id',
  authMiddleware,
  orderController.cancelOrder
);

module.exports = router;