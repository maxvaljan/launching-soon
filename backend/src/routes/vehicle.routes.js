const express = require('express');
const router = express.Router();
const vehicleController = require('../controllers/vehicle.controller');
const { authMiddleware, roleMiddleware } = require('../middleware/auth');

/**
 * @route   GET /api/vehicles/types
 * @desc    Get all vehicle types
 * @access  Public
 */
router.get('/types', vehicleController.getAllVehicleTypes);

/**
 * @route   GET /api/vehicles/types/:id
 * @desc    Get vehicle type by ID
 * @access  Public
 */
router.get('/types/:id', vehicleController.getVehicleTypeById);

/**
 * @route   POST /api/vehicles/types
 * @desc    Create a new vehicle type
 * @access  Private/Admin
 */
router.post(
  '/types',
  authMiddleware,
  roleMiddleware(['admin']),
  vehicleController.createVehicleType
);

/**
 * @route   PUT /api/vehicles/types/:id
 * @desc    Update a vehicle type
 * @access  Private/Admin
 */
router.put(
  '/types/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  vehicleController.updateVehicleType
);

/**
 * @route   DELETE /api/vehicles/types/:id
 * @desc    Delete a vehicle type
 * @access  Private/Admin
 */
router.delete(
  '/types/:id',
  authMiddleware,
  roleMiddleware(['admin']),
  vehicleController.deleteVehicleType
);

module.exports = router;