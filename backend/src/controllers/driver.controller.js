const supabaseService = require('../services/database/supabase.service');
const { ApiError } = require('../middleware/errorHandler');
const { v4: uuidv4 } = require('uuid');

/**
 * Driver Controller
 * Handles all driver-related operations
 */
const driverController = {
  /**
   * Get all available drivers
   */
  getAvailableDrivers: async (req, res, next) => {
    try {
      const { data, error } = await supabaseService.getClient()
        .from('Driver')
        .select('*')
        .eq('status', 'available');
      
      if (error) throw error;
      
      res.status(200).json({
        success: true,
        count: data.length,
        data
      });
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Get driver profile
   */
  getDriverProfile: async (req, res, next) => {
    try {
      const { id } = req.params;
      
      // Get basic user profile
      const profile = await supabaseService.getUserProfile(id);
      
      if (!profile) {
        throw new ApiError(404, `Driver with ID ${id} not found`);
      }
      
      // Get driver-specific details
      const { data: driverData, error } = await supabaseService.getClient()
        .from('Driver')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error && error.code !== 'PGRST116') { // Not found error
        throw error;
      }
      
      // Get driver profile details
      const { data: driverProfile, error: profileError } = await supabaseService.getClient()
        .from('driver_profiles')
        .select('*')
        .eq('id', id)
        .single();
      
      if (profileError && profileError.code !== 'PGRST116') { // Not found error
        throw profileError;
      }
      
      res.status(200).json({
        success: true,
        data: {
          id,
          email: profile.email,
          name: profile.name,
          phone_number: profile.phone_number,
          role: profile.role,
          avatar_url: profile.avatar_url,
          status: driverData?.status || 'offline',
          latitude: driverData?.latitude,
          longitude: driverData?.longitude,
          vehicle_type: driverData?.vehicle_type,
          vehicle_number: driverData?.vehicle_number,
          rating: driverData?.rating,
          city: driverData?.city,
          documents_submitted: driverProfile?.documents_submitted,
          verification_status: driverProfile?.verification_status,
          license_number: driverProfile?.license_number
        }
      });
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Update driver location
   */
  updateLocation: async (req, res, next) => {
    try {
      const { latitude, longitude, status } = req.body;
      
      if (!latitude || !longitude) {
        throw new ApiError(400, 'Latitude and longitude are required');
      }
      
      // Check if driver record exists
      const { data: existingDriver, error: checkError } = await supabaseService.getClient()
        .from('Driver')
        .select('id')
        .eq('id', req.user.id)
        .single();
      
      // If driver record doesn't exist, create it
      if (!existingDriver) {
        const { error: insertError } = await supabaseService.getClient()
          .from('Driver')
          .insert([{
            id: req.user.id,
            latitude,
            longitude,
            status: status || 'offline',
            created_at: new Date().toISOString(),
            rating: 5.0, // Default rating
            vehicle_type: 'car', // Default vehicle type
            vehicle_number: 'PENDING' // Placeholder
          }]);
        
        if (insertError) throw insertError;
      } else {
        // Update existing driver record
        const updateData = {
          latitude,
          longitude
        };
        
        // Only update status if provided
        if (status) {
          updateData.status = status;
        }
        
        // Call Supabase function to update driver location
        // This function can trigger real-time updates
        const { error: rpcError } = await supabaseService.getClient()
          .rpc('update_driver_location', { 
            p_driver_id: req.user.id,
            p_latitude: latitude,
            p_longitude: longitude,
            p_status: updateData.status || 'offline'
          });
        
        if (rpcError) {
          // Fall back to regular update if RPC fails
          const { error: updateError } = await supabaseService.getClient()
            .from('Driver')
            .update(updateData)
            .eq('id', req.user.id);
          
          if (updateError) throw updateError;
        }
      }
      
      res.status(200).json({
        success: true,
        message: 'Location updated successfully',
        data: {
          latitude,
          longitude,
          status: status || 'offline'
        }
      });
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Update driver status
   */
  updateStatus: async (req, res, next) => {
    try {
      const { status } = req.body;
      
      if (!status) {
        throw new ApiError(400, 'Status is required');
      }
      
      // Validate status
      const validStatuses = ['available', 'busy', 'offline'];
      if (!validStatuses.includes(status)) {
        throw new ApiError(400, `Status must be one of: ${validStatuses.join(', ')}`);
      }
      
      // Get current driver data to keep location
      const { data: currentData, error: getError } = await supabaseService.getClient()
        .from('Driver')
        .select('latitude, longitude')
        .eq('id', req.user.id)
        .single();
      
      if (getError && getError.code !== 'PGRST116') throw getError;
      
      // If driver record doesn't exist, create it with default location
      if (!currentData) {
        const { error: insertError } = await supabaseService.getClient()
          .from('Driver')
          .insert([{
            id: req.user.id,
            latitude: 0, // Default location
            longitude: 0, // Default location
            status,
            created_at: new Date().toISOString(),
            rating: 5.0, // Default rating
            vehicle_type: 'car', // Default vehicle type
            vehicle_number: 'PENDING' // Placeholder
          }]);
        
        if (insertError) throw insertError;
      } else {
        // Call Supabase function to update driver status
        // This function can trigger real-time updates
        const { error: rpcError } = await supabaseService.getClient()
          .rpc('update_driver_location', { 
            p_driver_id: req.user.id,
            p_latitude: currentData.latitude || 0,
            p_longitude: currentData.longitude || 0,
            p_status: status
          });
        
        if (rpcError) {
          // Fall back to regular update if RPC fails
          const { error: updateError } = await supabaseService.getClient()
            .from('Driver')
            .update({ status })
            .eq('id', req.user.id);
          
          if (updateError) throw updateError;
        }
      }
      
      res.status(200).json({
        success: true,
        message: 'Status updated successfully',
        data: { status }
      });
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Get nearby drivers
   */
  getNearbyDrivers: async (req, res, next) => {
    try {
      const { latitude, longitude, radius = 5, status = 'available' } = req.query;
      
      if (!latitude || !longitude) {
        throw new ApiError(400, 'Latitude and longitude are required');
      }
      
      // Convert to numbers
      const lat = parseFloat(latitude);
      const lng = parseFloat(longitude);
      const rad = parseFloat(radius);
      
      if (isNaN(lat) || isNaN(lng) || isNaN(rad)) {
        throw new ApiError(400, 'Invalid coordinate values');
      }
      
      // SQL query to find drivers within radius using PostGIS
      // Note: This requires PostGIS to be enabled in your Supabase project
      // If PostGIS is not available, we'll fall back to a simpler distance calculation
      
      try {
        // Try PostGIS query first (this assumes you have PostGIS enabled)
        const { data, error } = await supabaseService.getClient()
          .rpc('nearby_drivers', { 
            p_latitude: lat,
            p_longitude: lng,
            p_radius: rad,
            p_status: status
          });
        
        if (error) throw error;
        
        res.status(200).json({
          success: true,
          count: data.length,
          data
        });
      } catch (postgisError) {
        // Fall back to a simpler calculation using JavaScript
        // Get all drivers with requested status
        const { data: allDrivers, error } = await supabaseService.getClient()
          .from('Driver')
          .select('*, profiles(*)')
          .eq('status', status);
        
        if (error) throw error;
        
        // Calculate distances and filter
        const nearbyDrivers = allDrivers
          .map(driver => {
            // Calculate distance using Haversine formula
            const R = 6371; // Earth's radius in km
            const dLat = (driver.latitude - lat) * Math.PI / 180;
            const dLon = (driver.longitude - lng) * Math.PI / 180;
            const a = 
              Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat * Math.PI / 180) * Math.cos(driver.latitude * Math.PI / 180) * 
              Math.sin(dLon/2) * Math.sin(dLon/2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
            const distance = R * c;
            
            return { ...driver, distance };
          })
          .filter(driver => driver.distance <= rad)
          .sort((a, b) => a.distance - b.distance);
        
        res.status(200).json({
          success: true,
          count: nearbyDrivers.length,
          data: nearbyDrivers
        });
      }
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Get earnings history
   */
  getEarnings: async (req, res, next) => {
    try {
      const { start_date, end_date, limit = 10, offset = 0 } = req.query;
      
      let query = supabaseService.getClient()
        .from('driver_payouts')
        .select('*')
        .eq('driver_id', req.user.id)
        .order('created_at', { ascending: false });
      
      // Apply date filters if provided
      if (start_date) {
        query = query.gte('created_at', start_date);
      }
      
      if (end_date) {
        query = query.lte('created_at', end_date);
      }
      
      // Apply pagination
      if (limit) {
        query = query.limit(parseInt(limit));
      }
      
      if (offset) {
        query = query.range(parseInt(offset), parseInt(offset) + parseInt(limit) - 1);
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      // Calculate totals
      let totalEarnings = 0;
      let totalFees = 0;
      
      if (data && data.length > 0) {
        data.forEach(payout => {
          totalEarnings += payout.amount;
          totalFees += payout.platform_fee;
        });
      }
      
      res.status(200).json({
        success: true,
        data: {
          payouts: data || [],
          stats: {
            totalEarnings,
            totalFees,
            netEarnings: totalEarnings - totalFees
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = driverController;