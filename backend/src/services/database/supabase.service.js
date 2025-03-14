const { createClient } = require('@supabase/supabase-js');
const config = require('../../config');
const { logger } = require('../../middleware/errorHandler');

// Get Supabase URL and key from config
const SUPABASE_URL = config.supabase.url;
const SUPABASE_PUBLISHABLE_KEY = config.supabase.key;

/**
 * Singleton Supabase client service
 * This is the central point for all Supabase database interactions
 */
class SupabaseService {
  constructor() {
    if (SupabaseService.instance) {
      return SupabaseService.instance;
    }
    
    // Use the same credentials as frontend for consistency
    this.client = createClient(
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY,
      {
        auth: {
          autoRefreshToken: true,
          persistSession: true
        }
      }
    );
    
    // Use service role client when available (for admin operations)
    // This client has elevated privileges and should be used carefully
    if (config.supabase.serviceRoleKey) {
      this.adminClient = createClient(
        SUPABASE_URL,
        config.supabase.serviceRoleKey,
        {
          auth: {
            autoRefreshToken: false
          }
        }
      );
    }
    
    SupabaseService.instance = this;
    
    // Set up auth state change listener
    this.setupAuthStateChangeListener();
  }
  
  /**
   * Set up listener for auth state changes
   * This will log auth events for debugging purposes
   * Can be extended later to perform actions on auth events
   */
  setupAuthStateChangeListener() {
    try {
      const { data: { subscription } } = this.client.auth.onAuthStateChange(
        (event, session) => {
          logger.info({
            message: 'Auth state changed',
            event,
            userId: session?.user?.id || 'none'
          });
        }
      );
      
      // Store subscription to unsubscribe later if needed
      this.authSubscription = subscription;
    } catch (error) {
      logger.error({
        message: 'Failed to set up auth state change listener',
        error: error.message
      });
    }
  }
  
  /**
   * Get the standard Supabase client (with anon key)
   */
  getClient() {
    return this.client;
  }
  
  /**
   * Get the admin Supabase client (with service role key)
   * Will throw error if not available
   */
  getAdminClient() {
    if (!this.adminClient) {
      throw new Error('Admin client not available - service role key not configured');
    }
    return this.adminClient;
  }
  
  /**
   * Helper method to handle Supabase errors consistently
   */
  handleError(error, operation) {
    logger.error({
      message: `Supabase ${operation} operation failed`,
      error: error.message,
      details: error.details,
      code: error.code
    });
    throw error;
  }

  // Authentication services
  /**
   * Sign in a user with email/password or phone/password
   * @param {Object} credentials - {email, password} or {phone, password}
   * @returns {Promise<{data, error}>} - Supabase sign in response
   */
  async signIn(credentials) {
    try {
      // Validate credentials
      if (!credentials) {
        throw new Error('Credentials are required for sign in');
      }
      
      if (!credentials.password) {
        throw new Error('Password is required for sign in');
      }
      
      if (!credentials.email && !credentials.phone) {
        throw new Error('Email or phone is required for sign in');
      }
      
      logger.info({
        message: 'Attempting sign in',
        identifierType: credentials.email ? 'email' : 'phone'
      });
      
      // Attempt sign in
      const result = await this.client.auth.signInWithPassword(credentials);
      
      // Log result (success or failure)
      if (result.error) {
        logger.error({
          message: 'Sign in failed',
          error: result.error.message,
          code: result.error.status
        });
      } else {
        logger.info({
          message: 'Sign in successful',
          userId: result.data?.user?.id
        });
      }
      
      return result;
    } catch (error) {
      this.handleError(error, 'signIn');
    }
  }

  /**
   * Sign up a new user
   * @param {Object} credentials - User credentials and profile data
   * @returns {Promise<{data, error}>} - Supabase sign up response
   */
  async signUp(credentials) {
    try {
      // Validate credentials
      if (!credentials?.email) {
        throw new Error('Email is required for sign up');
      }
      
      if (!credentials?.password) {
        throw new Error('Password is required for sign up');
      }
      
      // Log the sign up attempt (without sensitive info)
      logger.info({
        message: 'Attempting user sign up',
        email: credentials.email,
        withProfile: !!credentials.options?.data
      });
      
      // Attempt sign up
      const result = await this.client.auth.signUp(credentials);
      
      if (result.error) {
        logger.error({
          message: 'Sign up failed',
          error: result.error.message,
          code: result.error.status
        });
      } else {
        logger.info({
          message: 'Sign up successful',
          userId: result.data?.user?.id,
          emailConfirmed: !result.data?.user?.identities?.[0]?.identity_data?.email_verified
        });
        
        // Create or update profile if user was created
        if (result.data?.user?.id && credentials.options?.data) {
          // Use admin client for this to ensure it works even if email verification is pending
          if (this.adminClient) {
            try {
              await this.adminClient
                .from('profiles')
                .upsert({
                  id: result.data.user.id,
                  name: credentials.options.data.name,
                  phone_number: credentials.options.data.phone_number,
                  role: credentials.options.data.role || 'customer',
                  created_at: new Date().toISOString()
                })
                .select();
              
              logger.info({
                message: 'Created profile for new user',
                userId: result.data.user.id
              });
            } catch (profileError) {
              logger.error({
                message: 'Failed to create profile for new user',
                error: profileError.message,
                userId: result.data.user.id
              });
            }
          }
        }
      }
      
      return result;
    } catch (error) {
      this.handleError(error, 'signUp');
    }
  }

  /**
   * Sign out a user - clears the session
   * @param {Object} options - Optional sign out options
   * @returns {Promise<{error}>} - Supabase sign out response
   */
  async signOut(options = {}) {
    try {
      logger.info({
        message: 'Attempting user sign out'
      });
      
      const result = await this.client.auth.signOut(options);
      
      if (result.error) {
        logger.error({
          message: 'Sign out failed',
          error: result.error.message
        });
      } else {
        logger.info({
          message: 'Sign out successful'
        });
      }
      
      return result;
    } catch (error) {
      this.handleError(error, 'signOut');
    }
  }

  /**
   * Get user information from a JWT token
   * @param {string} jwt - JWT token
   * @returns {Promise<{data, error}>} - User data or error
   */
  async getUser(jwt) {
    try {
      if (!jwt) {
        throw new Error('JWT token is required to get user');
      }
      
      const result = await this.client.auth.getUser(jwt);
      
      if (result.error) {
        logger.error({
          message: 'Get user from JWT failed',
          error: result.error.message
        });
      }
      
      return result;
    } catch (error) {
      this.handleError(error, 'getUser');
    }
  }
  
  /**
   * Verify a user's session
   * @param {string} jwt - JWT token from the request
   * @returns {Promise<{valid: boolean, user?: Object, error?: string}>}
   */
  async verifySession(jwt) {
    try {
      if (!jwt) {
        return { valid: false, error: 'No JWT token provided' };
      }
      
      const { data, error } = await this.getUser(jwt);
      
      if (error || !data.user) {
        return { 
          valid: false, 
          error: error ? error.message : 'Invalid session' 
        };
      }
      
      // Get user profile
      const profile = await this.getUserProfile(data.user.id);
      
      return {
        valid: true,
        user: {
          id: data.user.id,
          email: data.user.email,
          role: profile?.role || 'customer',
          name: profile?.name,
          phone: profile?.phone_number
        }
      };
    } catch (error) {
      logger.error({
        message: 'Session verification failed',
        error: error.message
      });
      return { valid: false, error: 'Session verification failed' };
    }
  }
  
  /**
   * Refresh a user's session token
   * @param {string} refreshToken - The refresh token
   * @returns {Promise<{data, error}>} - New session data or error
   */
  async refreshSession(refreshToken) {
    try {
      if (!refreshToken) {
        throw new Error('Refresh token is required');
      }
      
      return await this.client.auth.refreshSession({ refresh_token: refreshToken });
    } catch (error) {
      this.handleError(error, 'refreshSession');
    }
  }

  // Database services

  /**
   * Get a user profile by ID
   */
  async getUserProfile(userId) {
    try {
      const { data, error } = await this.client
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      this.handleError(error, 'getUserProfile');
    }
  }

  /**
   * Get an order by ID
   */
  async getOrderById(id) {
    try {
      const { data, error } = await this.client
        .from('Order')
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
      this.handleError(error, `getOrderById(${id})`);
    }
  }

  /**
   * Get orders with filtering
   */
  async getOrders(filter = {}, options = {}) {
    try {
      let query = this.client
        .from('Order')
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
      this.handleError(error, 'getOrders');
    }
  }

  /**
   * Create a new order
   */
  async createOrder(orderData) {
    try {
      const { data, error } = await this.client
        .from('Order')
        .insert([orderData])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    } catch (error) {
      this.handleError(error, 'createOrder');
    }
  }

  /**
   * Update an order
   */
  async updateOrder(id, data) {
    try {
      const { data: order, error } = await this.client
        .from('Order')
        .update(data)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      return order;
    } catch (error) {
      this.handleError(error, `updateOrder(${id})`);
    }
  }

  /**
   * Get all vehicle types
   */
  async getVehicleTypes() {
    try {
      const { data, error } = await this.client
        .from('vehicle_types')
        .select('*');
      
      if (error) throw error;
      return data;
    } catch (error) {
      this.handleError(error, 'getVehicleTypes');
    }
  }

  /**
   * Get wallet info for a user
   */
  async getWallet(userId) {
    try {
      const { data, error } = await this.client
        .from('wallet')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    } catch (error) {
      this.handleError(error, 'getWallet');
    }
  }

  /**
   * Get transaction history for a user
   */
  async getTransactions(userId, limit = 10) {
    try {
      const { data, error } = await this.client
        .from('wallet_transactions')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data;
    } catch (error) {
      this.handleError(error, 'getTransactions');
    }
  }

  /**
   * Get API key by name (e.g., for maps)
   */
  async getApiKey(keyName) {
    try {
      const { data, error } = await this.client
        .from('api_keys')
        .select('key_value')
        .eq('key_name', keyName)
        .single();

      if (error) throw error;
      return data?.key_value;
    } catch (error) {
      this.handleError(error, `getApiKey(${keyName})`);
    }
  }
  
  /**
   * Execute an operation within a database transaction
   * Uses Supabase's PostgreSQL transactions through RPC
   * 
   * @param {Function} callback - Function that receives the transaction context
   * @returns {Promise<any>} - Result of the transaction
   */
  async withTransaction(callback) {
    try {
      // Start transaction
      const { data: beginResult, error: beginError } = await this.adminClient.rpc('begin_transaction');
      
      if (beginError) {
        logger.error({
          message: 'Failed to begin transaction',
          error: beginError.message
        });
        throw beginError;
      }
      
      // Get transaction ID
      const txId = beginResult.transaction_id;
      
      // Create transaction context
      const txContext = {
        // Transactional functions
        insert: async (table, records) => {
          const { data, error } = await this.adminClient.rpc('tx_insert', {
            tx_id: txId,
            p_table: table,
            p_records: records
          });
          
          if (error) throw error;
          return data;
        },
        
        update: async (table, updates, conditions) => {
          const { data, error } = await this.adminClient.rpc('tx_update', {
            tx_id: txId,
            p_table: table,
            p_updates: updates,
            p_conditions: conditions
          });
          
          if (error) throw error;
          return data;
        },
        
        delete: async (table, conditions) => {
          const { data, error } = await this.adminClient.rpc('tx_delete', {
            tx_id: txId,
            p_table: table,
            p_conditions: conditions
          });
          
          if (error) throw error;
          return data;
        },
        
        select: async (table, columns, conditions) => {
          const { data, error } = await this.adminClient.rpc('tx_select', {
            tx_id: txId,
            p_table: table,
            p_columns: columns,
            p_conditions: conditions
          });
          
          if (error) throw error;
          return data;
        }
      };
      
      try {
        // Run the callback with transaction context
        const result = await callback(txContext);
        
        // Commit the transaction
        const { error: commitError } = await this.adminClient.rpc('commit_transaction', {
          tx_id: txId
        });
        
        if (commitError) {
          logger.error({
            message: 'Failed to commit transaction',
            error: commitError.message
          });
          throw commitError;
        }
        
        return result;
      } catch (error) {
        // Rollback the transaction
        try {
          await this.adminClient.rpc('rollback_transaction', {
            tx_id: txId
          });
        } catch (rollbackError) {
          logger.error({
            message: 'Failed to rollback transaction',
            error: rollbackError.message
          });
        }
        
        throw error;
      }
    } catch (error) {
      this.handleError(error, 'withTransaction');
    }
  }
}

module.exports = new SupabaseService();