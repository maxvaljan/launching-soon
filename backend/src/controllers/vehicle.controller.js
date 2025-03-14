const supabaseService = require('../services/database/supabase.service');
const { ApiError } = require('../middleware/errorHandler');
const { v4: uuidv4 } = require('uuid');

/**
 * Vehicle Controller
 * Handles all vehicle-related operations
 */
const vehicleController = {
  /**
   * Get all vehicle types
   */
  getAllVehicleTypes: async (req, res, next) => {
    try {
      const vehicleTypes = await supabaseService.getVehicleTypes();
      
      res.status(200).json({
        success: true,
        count: vehicleTypes.length,
        data: vehicleTypes
      });
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Get vehicle type by ID
   */
  getVehicleTypeById: async (req, res, next) => {
    try {
      const { id } = req.params;
      
      const { data, error } = await supabaseService.getClient()
        .from('vehicle_types')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      
      if (!data) {
        throw new ApiError(404, `Vehicle type with ID ${id} not found`);
      }
      
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Create a new vehicle type
   */
  createVehicleType: async (req, res, next) => {
    try {
      const {
        name,
        description,
        category,
        dimensions,
        max_weight,
        base_price,
        price_per_km,
        minimum_distance,
        icon_path
      } = req.body;
      
      // Validate required fields
      if (!name || !description || !category || !dimensions || !max_weight) {
        throw new ApiError(400, 'Missing required fields');
      }
      
      const newVehicleType = {
        id: uuidv4(),
        name,
        description,
        category,
        dimensions,
        max_weight,
        base_price: base_price || 500, // Default 5 EUR
        price_per_km: price_per_km || 100, // Default 1 EUR per km
        minimum_distance: minimum_distance || 1, // Default 1 km
        icon_path: icon_path || null,
        created_at: new Date().toISOString()
      };
      
      const { data, error } = await supabaseService.getClient()
        .from('vehicle_types')
        .insert([newVehicleType])
        .select()
        .single();
      
      if (error) throw error;
      
      res.status(201).json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Update a vehicle type
   */
  updateVehicleType: async (req, res, next) => {
    try {
      const { id } = req.params;
      const {
        name,
        description,
        category,
        dimensions,
        max_weight,
        base_price,
        price_per_km,
        minimum_distance,
        icon_path
      } = req.body;
      
      // Check if vehicle type exists
      const { data: existingVehicle, error: checkError } = await supabaseService.getClient()
        .from('vehicle_types')
        .select('id')
        .eq('id', id)
        .single();
      
      if (checkError || !existingVehicle) {
        throw new ApiError(404, `Vehicle type with ID ${id} not found`);
      }
      
      // Build update data
      const updateData = {};
      if (name) updateData.name = name;
      if (description) updateData.description = description;
      if (category) updateData.category = category;
      if (dimensions) updateData.dimensions = dimensions;
      if (max_weight) updateData.max_weight = max_weight;
      if (base_price !== undefined) updateData.base_price = base_price;
      if (price_per_km !== undefined) updateData.price_per_km = price_per_km;
      if (minimum_distance !== undefined) updateData.minimum_distance = minimum_distance;
      if (icon_path !== undefined) updateData.icon_path = icon_path;
      
      const { data, error } = await supabaseService.getClient()
        .from('vehicle_types')
        .update(updateData)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Delete a vehicle type
   */
  deleteVehicleType: async (req, res, next) => {
    try {
      const { id } = req.params;
      
      // Check if vehicle type exists
      const { data: existingVehicle, error: checkError } = await supabaseService.getClient()
        .from('vehicle_types')
        .select('id')
        .eq('id', id)
        .single();
      
      if (checkError || !existingVehicle) {
        throw new ApiError(404, `Vehicle type with ID ${id} not found`);
      }
      
      // Check if vehicle type is used in any orders
      const { data: orders, error: orderError } = await supabaseService.getClient()
        .from('Order')
        .select('id')
        .eq('vehicle_type_id', id)
        .limit(1);
      
      if (orderError) throw orderError;
      
      if (orders && orders.length > 0) {
        throw new ApiError(400, `Cannot delete vehicle type that is used in orders`);
      }
      
      const { error } = await supabaseService.getClient()
        .from('vehicle_types')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      res.status(200).json({
        success: true,
        message: `Vehicle type with ID ${id} deleted successfully`
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = vehicleController;