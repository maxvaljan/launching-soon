const supabaseService = require('../services/database/supabase.service');
const { ApiError } = require('../middleware/errorHandler');

/**
 * Configuration Controller
 * Handles configuration-related operations like API keys
 */
const configController = {
  /**
   * Get Mapbox API key
   */
  getMapboxKey: async (req, res, next) => {
    try {
      const keyValue = await supabaseService.getApiKey('mapbox_public_token');
      
      if (!keyValue) {
        throw new ApiError(404, 'Mapbox API key not found');
      }
      
      res.status(200).json({
        success: true,
        data: {
          key_name: 'mapbox_public_token',
          key_value: keyValue
        }
      });
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Get Google Maps API key
   */
  getGoogleMapsKey: async (req, res, next) => {
    try {
      const keyValue = await supabaseService.getApiKey('google_maps_api_key');
      
      if (!keyValue) {
        throw new ApiError(404, 'Google Maps API key not found');
      }
      
      res.status(200).json({
        success: true,
        data: {
          key_name: 'google_maps_api_key',
          key_value: keyValue
        }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = configController;