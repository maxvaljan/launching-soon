const supabaseService = require('../services/database/supabase.service');
const { ApiError } = require('../middleware/errorHandler');

/**
 * Auth Controller
 * Handles all authentication-related operations
 */
const authController = {
  /**
   * Login with email and password
   * Works with web and mobile clients
   */
  login: async (req, res, next) => {
    try {
      const { email, password, phone } = req.body;
      
      if (!email && !phone) {
        throw new ApiError(400, "Email or phone is required");
      }
      
      if (!password) {
        throw new ApiError(400, "Password is required");
      }
      
      const credentials = email 
        ? { email, password } 
        : { phone, password };
      
      // Platform-specific handling
      const platform = req.headers['x-platform'] || 'web';
      
      // Sign in using our enhanced service
      const { data, error } = await supabaseService.signIn(credentials);
      
      if (error) {
        throw new ApiError(401, error.message);
      }
      
      if (!data || !data.user) {
        throw new ApiError(401, "Invalid login credentials");
      }
      
      // Get user profile
      const profile = await supabaseService.getUserProfile(data.user.id);
      
      // Set auth cookies for web platform to support SSR
      if (platform === 'web' && data.session) {
        // Set cookies with the right flags
        res.cookie('supabase-auth-token', data.session.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
          maxAge: 24 * 60 * 60 * 1000 // 1 day expiry
        });
        
        res.cookie('supabase-refresh-token', data.session.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
          path: '/',
          maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days expiry
        });
      }
      
      // Return unified response
      res.status(200).json({
        success: true,
        data: {
          user: {
            id: data.user.id,
            email: data.user.email,
            role: profile?.role || 'customer',
            name: profile?.name,
            phone: profile?.phone_number
          },
          // Include platform in response
          platform,
          // Include full session data
          session: data.session,
          token: data.session.access_token,
          refreshToken: data.session.refresh_token,
          // Add expiry timestamps for clients to use
          expires: {
            at: data.session.expires_at,
            in: Math.floor((data.session.expires_at * 1000 - Date.now()) / 1000)
          }
        }
      });
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Register new user with unified handling for web and mobile
   */
  register: async (req, res, next) => {
    try {
      const { email, password, name, phone_number, role = 'customer' } = req.body;
      
      if (!email) {
        throw new ApiError(400, "Email is required");
      }
      
      if (!password) {
        throw new ApiError(400, "Password is required");
      }
      
      // Platform-specific handling
      const platform = req.headers['x-platform'] || 'web';
      
      // Register with Supabase Auth with enhanced profile data
      const { data, error } = await supabaseService.signUp({
        email,
        password,
        options: {
          data: {
            name,
            phone_number,
            role
          }
        }
      });
      
      if (error) {
        throw new ApiError(400, error.message);
      }
      
      if (!data || !data.user) {
        throw new ApiError(400, "Registration failed");
      }
      
      // If email confirmation is required, no session will be returned
      const needsEmailConfirmation = !data.session;
      
      // Set auth cookies for web users when we have a session
      if (platform === 'web' && data.session) {
        res.cookie('supabase-auth-token', data.session.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
          maxAge: 24 * 60 * 60 * 1000 // 1 day expiry
        });
        
        res.cookie('supabase-refresh-token', data.session.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
          path: '/',
          maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days expiry
        });
      }
      
      // Return a consistent response
      res.status(201).json({
        success: true,
        data: {
          user: {
            id: data.user.id,
            email: data.user.email,
            role,
            name,
            phone: phone_number
          },
          platform,
          emailConfirmationRequired: needsEmailConfirmation,
          message: needsEmailConfirmation 
            ? "Verification email sent. Please confirm your email to complete registration." 
            : "Registration successful",
          session: data.session,
          token: data.session?.access_token,
          refreshToken: data.session?.refresh_token,
          // Add expiry info if we have a session
          expires: data.session ? {
            at: data.session.expires_at,
            in: Math.floor((data.session.expires_at * 1000 - Date.now()) / 1000)
          } : null
        }
      });
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Logout user with unified handling for web and mobile
   */
  logout: async (req, res, next) => {
    try {
      // Platform-specific handling
      const platform = req.headers['x-platform'] || 'web';
      
      // Retrieve the refresh token from header, body, or cookies
      const refreshToken = 
        req.body.refreshToken || 
        (req.headers.authorization && req.headers.authorization.split(' ')[1]) ||
        req.cookies['supabase-refresh-token'];
      
      // Sign out with options
      const { error } = await supabaseService.signOut({
        scope: 'global' // Sign out from all devices
      });
      
      if (error) {
        throw new ApiError(500, error.message);
      }
      
      // For web, also clear the auth cookies
      if (platform === 'web') {
        res.clearCookie('supabase-auth-token');
        res.clearCookie('supabase-refresh-token');
        
        // Add cache control headers to ensure browsers don't cache the logout
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
      }
      
      // Add a custom header to instruct clients to clear local storage
      res.setHeader('X-Auth-Logout', 'true');
      
      // Return a consistent response
      res.status(200).json({
        success: true,
        message: "Logout successful",
        platform
      });
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Get authenticated user profile
   */
  getProfile: async (req, res, next) => {
    try {
      res.status(200).json({
        success: true,
        data: req.user
      });
    } catch (error) {
      next(error);
    }
  },
  
  /**
   * Refresh authentication token
   * Used by all platforms to get a new access token using a refresh token
   */
  refreshToken: async (req, res, next) => {
    try {
      // Platform-specific handling
      const platform = req.headers['x-platform'] || 'web';
      
      // Get refresh token from request based on platform
      let refreshToken;
      
      if (platform === 'web') {
        refreshToken = req.cookies['supabase-refresh-token'] || req.body.refreshToken;
      } else {
        refreshToken = req.body.refreshToken;
      }
      
      if (!refreshToken) {
        throw new ApiError(400, 'Refresh token is required');
      }
      
      // Attempt to refresh the token
      const { data, error } = await supabaseService.refreshSession(refreshToken);
      
      if (error || !data.session) {
        // Clear cookies for web clients
        if (platform === 'web') {
          res.clearCookie('supabase-auth-token');
          res.clearCookie('supabase-refresh-token');
        }
        
        throw new ApiError(401, error?.message || 'Failed to refresh token');
      }
      
      // For web, set the new tokens as cookies
      if (platform === 'web') {
        res.cookie('supabase-auth-token', data.session.access_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
          maxAge: 24 * 60 * 60 * 1000 // 1 day expiry
        });
        
        res.cookie('supabase-refresh-token', data.session.refresh_token, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
          path: '/',
          maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days expiry
        });
      }
      
      // Return the new tokens
      res.status(200).json({
        success: true,
        data: {
          token: data.session.access_token,
          refreshToken: data.session.refresh_token,
          expires: {
            at: data.session.expires_at,
            in: Math.floor((data.session.expires_at * 1000 - Date.now()) / 1000)
          }
        }
      });
    } catch (error) {
      next(error);
    }
  }
};

module.exports = authController;