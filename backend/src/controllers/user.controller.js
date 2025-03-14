const supabaseService = require('../services/database/supabase.service');
const { ApiError } = require('../middleware/errorHandler');

/**
 * User Controller
 * Handles all user-related operations
 */
const userController = {
  /**
   * Get user profile
   */
  getProfile: async (req, res, next) => {
    try {
      const profile = await supabaseService.getUserProfile(req.user.id);
      
      res.status(200).json({
        success: true,
        data: {
          id: req.user.id,
          email: req.user.email,
          name: profile?.name,
          phone_number: profile?.phone_number,
          role: profile?.role,
          avatar_url: profile?.avatar_url,
          created_at: profile?.created_at
        }
      });
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Update user profile
   */
  updateProfile: async (req, res, next) => {
    try {
      const { name, phone_number, avatar_url } = req.body;
      
      const { data, error } = await supabaseService.getClient()
        .from('profiles')
        .update({
          name,
          phone_number,
          avatar_url
        })
        .eq('id', req.user.id)
        .select()
        .single();
      
      if (error) throw error;
      
      res.status(200).json({
        success: true,
        data: {
          id: req.user.id,
          email: req.user.email,
          name: data.name,
          phone_number: data.phone_number,
          role: data.role,
          avatar_url: data.avatar_url,
          created_at: data.created_at
        }
      });
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Get user wallet information
   */
  getWallet: async (req, res, next) => {
    try {
      // Get wallet info
      const wallet = await supabaseService.getWallet(req.user.id);
      
      // Get recent transactions
      const transactions = await supabaseService.getTransactions(req.user.id, 10);
      
      // If wallet doesn't exist, create one
      if (!wallet) {
        const { data, error } = await supabaseService.getClient()
          .from('wallet')
          .insert([{
            user_id: req.user.id,
            balance: 0,
            currency: 'EUR',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }])
          .select()
          .single();
        
        if (error) throw error;
        
        res.status(200).json({
          success: true,
          data: {
            wallet: data,
            transactions: []
          }
        });
        return;
      }
      
      res.status(200).json({
        success: true,
        data: {
          wallet,
          transactions
        }
      });
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Get user's payment methods
   */
  getPaymentMethods: async (req, res, next) => {
    try {
      const { data, error } = await supabaseService.getClient()
        .from('payment_methods')
        .select('*')
        .eq('user_id', req.user.id);
      
      if (error) throw error;
      
      res.status(200).json({
        success: true,
        data
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = userController;