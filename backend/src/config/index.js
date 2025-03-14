require('dotenv').config();

const config = {
  environment: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 3000,
  
  // Supabase configuration
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY,
    serviceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
  },
  
  // Google Maps configuration
  maps: {
    apiKey: process.env.GOOGLE_MAPS_API_KEY,
  },
  
  // Stripe configuration
  stripe: {
    secretKey: process.env.STRIPE_SECRET_KEY,
    publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET,
    driverSubscriptionPriceId: process.env.STRIPE_DRIVER_SUBSCRIPTION_PRICE_ID,
  },
  
  // Base URL for the application (used for webhooks and redirects)
  baseUrl: process.env.BASE_URL || 'http://localhost:3000',
  
  // JWT configuration
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  },
  
  // Logging
  logging: {
    level: process.env.LOG_LEVEL || 'info',
  },
  
  // Resend email service
  resend: {
    apiKey: process.env.RESEND_API_KEY,
  },
};

module.exports = config;