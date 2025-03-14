const express = require('express');
const router = express.Router();
const driverController = require('../controllers/driver.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

/**
 * @route   GET /api/drivers/available
 * @desc    Get all available drivers
 * @access  Private
 */
router.get(
  '/available',
  authMiddleware,
  driverController.getAvailableDrivers
);

/**
 * @route   GET /api/drivers/:id
 * @desc    Get driver profile
 * @access  Private
 */
router.get(
  '/:id',
  authMiddleware,
  driverController.getDriverProfile
);

/**
 * @route   POST /api/drivers/location
 * @desc    Update driver location
 * @access  Private/Driver
 */
router.post(
  '/location',
  authMiddleware,
  roleMiddleware(['driver']),
  driverController.updateLocation
);

/**
 * @route   POST /api/drivers/status
 * @desc    Update driver status
 * @access  Private/Driver
 */
router.post(
  '/status',
  authMiddleware,
  roleMiddleware(['driver']),
  driverController.updateStatus
);

/**
 * @route   GET /api/drivers/nearby
 * @desc    Get nearby drivers
 * @access  Private
 */
router.get(
  '/nearby',
  authMiddleware,
  driverController.getNearbyDrivers
);

/**
 * @route   GET /api/drivers/earnings
 * @desc    Get driver earnings
 * @access  Private/Driver
 */
router.get(
  '/earnings',
  authMiddleware,
  roleMiddleware(['driver']),
  driverController.getEarnings
);

module.exports = router;