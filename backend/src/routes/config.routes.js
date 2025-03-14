const express = require('express');
const router = express.Router();
const configController = require('../controllers/config.controller');

/**
 * @route   GET /api/api-keys/mapbox
 * @desc    Get Mapbox API key
 * @access  Public
 */
router.get('/mapbox', configController.getMapboxKey);

/**
 * @route   GET /api/api-keys/google-maps
 * @desc    Get Google Maps API key
 * @access  Public
 */
router.get('/google-maps', configController.getGoogleMapsKey);

module.exports = router;