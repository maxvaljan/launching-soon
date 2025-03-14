const BaseRepository = require('./base.repository');
const supabaseService = require('../supabase.service');
const { ApiError } = require('../../../middleware/errorHandler');

/**
 * Order Repository
 * Handles all database operations for orders using Supabase
 */
class OrderRepository extends BaseRepository {
  constructor() {
    super();
    this.supabase = supabaseService.getClient();
    this.tableName = 'Order';
  }

  /**
   * Find an order by ID
   * @param {string} id - The order ID
   * @returns {Promise<Object>} - The order or null
   */
  async findById(id) {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select(`
          *,
          Driver(*),
          vehicle_types(*)
        `)
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      supabaseService.handleError(error, `findById(${id})`);
    }
  }

  /**
   * Find all orders matching a filter
   * @param {Object} filter - The filter criteria
   * @param {Object} options - Additional options (pagination, sorting, etc.)
   * @returns {Promise<Array>} - Array of orders
   */
  async findAll(filter = {}, options = {}) {
    try {
      let query = this.supabase
        .from(this.tableName)
        .select(`
          *,
          Driver(*),
          vehicle_types(*)
        `);
      
      // Apply filters
      Object.entries(filter).forEach(([key, value]) => {
        query = query.eq(key, value);
      });
      
      // Apply pagination
      if (options.limit) {
        query = query.limit(options.limit);
      }
      
      if (options.offset) {
        query = query.range(options.offset, options.offset + (options.limit || 10) - 1);
      }
      
      // Apply sorting
      if (options.orderBy) {
        const { column, ascending = true } = options.orderBy;
        query = query.order(column, { ascending });
      } else {
        // Default sort by created_at
        query = query.order('created_at', { ascending: false });
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data;
    } catch (error) {
      supabaseService.handleError(error, 'findAll()');
    }
  }

  /**
   * Find orders by customer ID
   * @param {string} customerId - The customer ID
   * @param {Object} options - Additional options (pagination, sorting, etc.)
   * @returns {Promise<Array>} - Array of orders
   */
  async findByCustomerId(customerId, options = {}) {
    return this.findAll({ customer_id: customerId }, options);
  }

  /**
   * Find orders by driver ID
   * @param {string} driverId - The driver ID
   * @param {Object} options - Additional options (pagination, sorting, etc.)
   * @returns {Promise<Array>} - Array of orders
   */
  async findByDriverId(driverId, options = {}) {
    return this.findAll({ driver_id: driverId }, options);
  }

  /**
   * Create a new order
   * @param {Object} data - The order data
   * @returns {Promise<Object>} - The created order
   */
  async create(data) {
    try {
      const { data: order, error } = await this.supabase
        .from(this.tableName)
        .insert([data])
        .select()
        .single();
      
      if (error) throw error;
      return order;
    } catch (error) {
      supabaseService.handleError(error, 'create()');
    }
  }

  /**
   * Update an existing order
   * @param {string} id - The order ID
   * @param {Object} data - The updated data
   * @returns {Promise<Object>} - The updated order
   */
  async update(id, data) {
    try {
      const { data: order, error } = await this.supabase
        .from(this.tableName)
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      if (!order) {
        throw new ApiError(404, `Order with ID ${id} not found`);
      }
      return order;
    } catch (error) {
      supabaseService.handleError(error, `update(${id})`);
    }
  }

  /**
   * Delete an order by ID
   * @param {string} id - The order ID
   * @returns {Promise<boolean>} - Success status
   */
  async delete(id) {
    try {
      const { error } = await this.supabase
        .from(this.tableName)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return true;
    } catch (error) {
      supabaseService.handleError(error, `delete(${id})`);
    }
  }

  /**
   * Check if an order exists
   * @param {string} id - The order ID
   * @returns {Promise<boolean>} - True if exists
   */
  async exists(id) {
    try {
      const { data, error } = await this.supabase
        .from(this.tableName)
        .select('id')
        .eq('id', id)
        .maybeSingle();
      
      if (error) throw error;
      return !!data;
    } catch (error) {
      supabaseService.handleError(error, `exists(${id})`);
    }
  }

  /**
   * Update order status
   * @param {string} id - The order ID
   * @param {string} status - The new status
   * @returns {Promise<Object>} - The updated order
   */
  async updateStatus(id, status) {
    return this.update(id, { status, updated_at: new Date().toISOString() });
  }

  /**
   * Assign driver to order
   * @param {string} orderId - The order ID
   * @param {string} driverId - The driver ID
   * @returns {Promise<Object>} - The updated order
   */
  async assignDriver(orderId, driverId) {
    return this.update(orderId, { 
      driver_id: driverId, 
      status: 'accepted',
      updated_at: new Date().toISOString()
    });
  }
}

module.exports = new OrderRepository();