const supabaseService = require('../services/database/supabase.service');
const { ApiError } = require('../middleware/errorHandler');
const { v4: uuidv4 } = require('uuid');

/**
 * Order Controller
 * Handles all order-related operations
 */
const orderController = {
  /**
   * Get all orders with optional filtering
   */
  getAllOrders: async (req, res, next) => {
    try {
      const { 
        limit = 10, 
        offset = 0, 
        status,
        sort = 'created_at',
        order = 'desc'
      } = req.query;
      
      const filter = {};
      if (status) filter.status = status;
      
      const options = {
        limit: parseInt(limit),
        offset: parseInt(offset),
        orderBy: {
          column: sort,
          ascending: order.toLowerCase() === 'asc'
        }
      };
      
      const orders = await supabaseService.getOrders(filter, options);
      
      res.status(200).json({
        success: true,
        count: orders.length,
        data: orders
      });
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Get a single order by ID
   */
  getOrderById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const order = await supabaseService.getOrderById(id);
      
      if (!order) {
        throw new ApiError(404, `Order with ID ${id} not found`);
      }
      
      res.status(200).json({
        success: true,
        data: order
      });
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Get all orders for a customer
   */
  getCustomerOrders: async (req, res, next) => {
    try {
      const { 
        limit = 10, 
        offset = 0,
        status,
        sort = 'created_at',
        order = 'desc'
      } = req.query;
      
      const customerId = req.user.id;
      const filter = { customer_id: customerId };
      if (status) filter.status = status;
      
      const options = {
        limit: parseInt(limit),
        offset: parseInt(offset),
        orderBy: {
          column: sort,
          ascending: order.toLowerCase() === 'asc'
        }
      };
      
      const orders = await supabaseService.getOrders(filter, options);
      
      res.status(200).json({
        success: true,
        count: orders.length,
        data: orders
      });
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Get all orders for a driver
   */
  getDriverOrders: async (req, res, next) => {
    try {
      const { 
        limit = 10, 
        offset = 0,
        status,
        sort = 'created_at',
        order = 'desc'
      } = req.query;
      
      const driverId = req.user.id;
      const filter = { driver_id: driverId };
      if (status) filter.status = status;
      
      const options = {
        limit: parseInt(limit),
        offset: parseInt(offset),
        orderBy: {
          column: sort,
          ascending: order.toLowerCase() === 'asc'
        }
      };
      
      const orders = await supabaseService.getOrders(filter, options);
      
      res.status(200).json({
        success: true,
        count: orders.length,
        data: orders
      });
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Create a new order
   */
  createOrder: async (req, res, next) => {
    try {
      const {
        pickup_address,
        dropoff_address,
        contact_name,
        contact_phone,
        scheduled_pickup,
        vehicle_type_id,
        items,
        special_instructions,
        payment_method
      } = req.body;
      
      // For geocoding, we'll use the same approach as frontend for now
      // Since this depends on the external API key that's stored in Supabase
      // We'll fetch it and use it directly
      const mapboxToken = await supabaseService.getApiKey('mapbox_public_token');
      if (!mapboxToken) {
        throw new ApiError(500, 'Map configuration not found');
      }
      
      // Get coordinates for pickup address
      const pickupGeoResponse = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          pickup_address
        )}.json?access_token=${mapboxToken}&country=de`
      );
      const pickupGeoData = await pickupGeoResponse.json();
      if (!pickupGeoData.features || !pickupGeoData.features.length) {
        throw new ApiError(400, 'Invalid pickup address');
      }
      const pickupCoords = {
        lng: pickupGeoData.features[0].center[0],
        lat: pickupGeoData.features[0].center[1]
      };
      
      // Get coordinates for dropoff address
      const dropoffGeoResponse = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
          dropoff_address
        )}.json?access_token=${mapboxToken}&country=de`
      );
      const dropoffGeoData = await dropoffGeoResponse.json();
      if (!dropoffGeoData.features || !dropoffGeoData.features.length) {
        throw new ApiError(400, 'Invalid dropoff address');
      }
      const dropoffCoords = {
        lng: dropoffGeoData.features[0].center[0],
        lat: dropoffGeoData.features[0].center[1]
      };
      
      // Calculate route details - using Mapbox Directions API
      const directionsResponse = await fetch(
        `https://api.mapbox.com/directions/v5/mapbox/driving/${pickupCoords.lng},${pickupCoords.lat};${dropoffCoords.lng},${dropoffCoords.lat}?access_token=${mapboxToken}&geometries=geojson`
      );
      const directionsData = await directionsResponse.json();
      
      if (!directionsData.routes || !directionsData.routes.length) {
        throw new ApiError(400, 'Could not calculate route');
      }
      
      const routeInfo = directionsData.routes[0];
      const distanceInKm = routeInfo.distance / 1000;
      const durationInSeconds = routeInfo.duration;
      
      // Get vehicle type details for pricing
      const { data: vehicleTypes } = await supabaseService.getClient()
        .from('vehicle_types')
        .select('*')
        .eq('id', vehicle_type_id)
        .single();
      
      // Calculate price based on distance and vehicle type
      let price = 500; // Default base price in cents (5 EUR)
      if (vehicleTypes) {
        price = vehicleTypes.base_price + Math.round(distanceInKm * vehicleTypes.price_per_km);
      } else {
        // If vehicle not found, use a default calculation
        price = 500 + Math.round(distanceInKm * 100); // 5 EUR base + 1 EUR per km
      }
      
      // Create order object
      const orderData = {
        id: uuidv4(),
        customer_id: req.user.id,
        pickup_address,
        pickup_latitude: pickupCoords.lat,
        pickup_longitude: pickupCoords.lng,
        dropoff_address,
        dropoff_latitude: dropoffCoords.lat,
        dropoff_longitude: dropoffCoords.lng,
        contact_name,
        contact_phone,
        scheduled_pickup: scheduled_pickup || null,
        vehicle_type_id,
        items: items || [],
        special_instructions: special_instructions || null,
        distance: distanceInKm,
        estimated_duration: durationInSeconds,
        price,
        payment_method: payment_method || 'card',
        status: 'pending',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      // Create the order in the database
      const order = await supabaseService.createOrder(orderData);
      
      // For card payments, in a real implementation we would:
      // 1. Get/create Stripe customer ID for the user
      // 2. Create a payment intent
      // For now, we'll just return a mock payment intent
      let paymentIntent = null;
      if (payment_method === 'card') {
        paymentIntent = {
          paymentIntentId: `pi_mock_${uuidv4()}`,
          clientSecret: `pi_mock_secret_${uuidv4()}`,
          status: 'requires_payment_method',
          amount: price,
          currency: 'eur'
        };
      }
      
      res.status(201).json({
        success: true,
        data: order,
        payment: paymentIntent
      });
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Update an order's status
   */
  updateOrderStatus: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      // Validate the status
      const validStatuses = ['pending', 'accepted', 'in_transit', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        throw new ApiError(400, `Invalid status: ${status}`);
      }
      
      // Check if order exists
      const order = await supabaseService.getOrderById(id);
      if (!order) {
        throw new ApiError(404, `Order with ID ${id} not found`);
      }
      
      // Update the order status
      const updatedOrder = await supabaseService.updateOrder(id, { 
        status, 
        updated_at: new Date().toISOString() 
      });
      
      res.status(200).json({
        success: true,
        data: updatedOrder
      });
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Assign a driver to an order
   */
  assignDriver: async (req, res, next) => {
    try {
      const { orderId } = req.params;
      const { driverId } = req.body;
      
      // Check if order exists
      const order = await supabaseService.getOrderById(orderId);
      if (!order) {
        throw new ApiError(404, `Order with ID ${orderId} not found`);
      }
      
      // Update the order with driver and change status
      const updatedOrder = await supabaseService.updateOrder(orderId, {
        driver_id: driverId,
        status: 'accepted',
        updated_at: new Date().toISOString()
      });
      
      res.status(200).json({
        success: true,
        data: updatedOrder
      });
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Cancel an order
   */
  cancelOrder: async (req, res, next) => {
    try {
      const { id } = req.params;
      
      // Check if order exists
      const order = await supabaseService.getOrderById(id);
      if (!order) {
        throw new ApiError(404, `Order with ID ${id} not found`);
      }
      
      // Check if the order is cancellable
      if (['completed', 'cancelled'].includes(order.status)) {
        throw new ApiError(400, `Cannot cancel an order with status: ${order.status}`);
      }
      
      // Cancel the order
      const updatedOrder = await supabaseService.updateOrder(id, {
        status: 'cancelled',
        updated_at: new Date().toISOString()
      });
      
      res.status(200).json({
        success: true,
        data: updatedOrder
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = orderController;