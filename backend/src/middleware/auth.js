const { ApiError } = require('./errorHandler');
const supabaseService = require('../services/database/supabase.service');
const config = require('../config');
const crypto = require('crypto');

/**
 * Generate a CSRF token for state-changing requests
 * @param {string} userId - The user ID to associate with the token
 * @returns {string} CSRF token
 */
const generateCsrfToken = (userId) => {
  const timestamp = Date.now().toString();
  const randomString = crypto.randomBytes(16).toString('hex');
  const data = `${userId}:${timestamp}:${randomString}`;
  
  // Use JWT secret to sign the token
  const hmac = crypto.createHmac('sha256', config.jwt.secret);
  hmac.update(data);
  const signature = hmac.digest('hex');
  
  return `${data}:${signature}`;
};

/**
 * Verify a CSRF token
 * @param {string} token - The CSRF token to verify
 * @param {string} userId - The user ID to validate against
 * @returns {boolean} Whether the token is valid
 */
const verifyCsrfToken = (token, userId) => {
  if (!token) return false;
  
  const parts = token.split(':');
  if (parts.length !== 4) return false;
  
  const [tokenUserId, timestamp, randomString, signature] = parts;
  
  // Validate user ID
  if (tokenUserId !== userId) return false;
  
  // Validate timestamp (tokens expire after 1 hour)
  const tokenTime = parseInt(timestamp, 10);
  const currentTime = Date.now();
  if (currentTime - tokenTime > 3600000) return false;
  
  // Validate signature
  const data = `${tokenUserId}:${timestamp}:${randomString}`;
  const hmac = crypto.createHmac('sha256', config.jwt.secret);
  hmac.update(data);
  const expectedSignature = hmac.digest('hex');
  
  return signature === expectedSignature;
};

/**
 * Middleware to verify authentication with multi-platform support
 * Works with tokens from:
 * - Authorization header (Bearer token)
 * - Cookies (for web SSR)
 */
const authMiddleware = async (req, res, next) => {
  try {
    // Determine the platform
    const platform = req.headers['x-platform'] || 'web';
    
    // Try to get the token from various sources based on platform
    let token;
    
    // 1. Try Authorization header (works for all platforms)
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    }
    
    // 2. If not found and on web platform, try cookies
    if (!token && platform === 'web') {
      token = req.cookies['supabase-auth-token'];
    }
    
    // If we still don't have a token, return an error
    if (!token) {
      throw new ApiError(401, 'Unauthorized - No valid authentication token found');
    }
    
    // Use our enhanced service to verify the session
    const { valid, user, error } = await supabaseService.verifySession(token);
    
    if (!valid || !user) {
      // For web platform, clear cookies on auth failure
      if (platform === 'web') {
        res.clearCookie('supabase-auth-token');
        res.clearCookie('supabase-refresh-token');
      }
      
      // Add a header to instruct client to clear storage
      res.setHeader('X-Auth-Invalid', 'true');
      
      throw new ApiError(401, error || 'Unauthorized - Invalid session');
    }
    
    // Add platform info to the request
    req.platform = platform;
    
    // Set user info in request
    req.user = user;
    
    // Token is valid, proceed
    next();
  } catch (error) {
    if (error instanceof ApiError) {
      next(error);
    } else {
      next(new ApiError(401, 'Authentication error'));
    }
  }
};

/**
 * Middleware to check user role
 * @param {Array<string>} roles - Allowed roles
 */
const roleMiddleware = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return next(new ApiError(401, 'Unauthorized - User not authenticated'));
    }
    
    if (!roles.includes(req.user.role)) {
      return next(new ApiError(403, 'Forbidden - Insufficient permissions'));
    }
    
    next();
  };
};

/**
 * Middleware to verify CSRF token for state-changing operations
 * This middleware should be used on POST, PUT, DELETE requests that modify data
 */
const csrfMiddleware = (req, res, next) => {
  try {
    // Skip CSRF checks for API clients and non-web platforms
    const platform = req.headers['x-platform'] || 'web';
    if (platform !== 'web') {
      return next();
    }
    
    // Get the CSRF token from headers
    const csrfToken = req.headers['x-csrf-token'];
    
    // Skip for Stripe webhooks that use signature verification
    if (req.path.includes('/webhook') && req.headers['stripe-signature']) {
      return next();
    }
    
    // Ensure we have a user and token
    if (!req.user || !req.user.id) {
      return next(new ApiError(401, 'User authentication required for this operation'));
    }
    
    if (!csrfToken) {
      return next(new ApiError(403, 'CSRF token is required'));
    }
    
    // Verify the token
    if (!verifyCsrfToken(csrfToken, req.user.id)) {
      return next(new ApiError(403, 'Invalid or expired CSRF token'));
    }
    
    // Token is valid, proceed
    next();
  } catch (error) {
    next(new ApiError(403, 'CSRF validation failed'));
  }
};

// Add CSRF token to response for authenticated users
const csrfTokenHandler = (req, res, next) => {
  // Attach original handler
  const originalSend = res.send;
  
  res.send = function(body) {
    try {
      // Only add CSRF token for authenticated web users
      if (req.user && req.user.id && (req.headers['x-platform'] || 'web') === 'web') {
        // Generate a new CSRF token
        const csrfToken = generateCsrfToken(req.user.id);
        
        // Add it to response headers
        res.setHeader('X-CSRF-Token', csrfToken);
      }
    } catch (error) {
      console.error('Error setting CSRF token:', error);
    }
    
    // Call the original send
    return originalSend.call(this, body);
  };
  
  next();
};

module.exports = {
  authMiddleware,
  roleMiddleware,
  csrfMiddleware,
  csrfTokenHandler,
  generateCsrfToken,
  verifyCsrfToken
};