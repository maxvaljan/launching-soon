/**
 * Payment Controller
 * Handles payment-related API endpoints
 */

const stripeConnectService = require('../services/payment/stripe-connect.service');
const config = require('../config');

/**
 * Create a Stripe Connect account for a driver
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createConnectAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Verify user is a driver
    if (req.user.role !== 'driver') {
      return res.status(403).json({
        error: 'Only drivers can create Connect accounts'
      });
    }
    
    const account = await stripeConnectService.createConnectAccount(userId);
    
    res.status(201).json({
      id: account.id,
      details_submitted: account.details_submitted,
      charges_enabled: account.charges_enabled,
      payouts_enabled: account.payouts_enabled,
      capabilities: account.capabilities
    });
  } catch (error) {
    console.error('Error creating Connect account:', error);
    res.status(500).json({
      error: 'Failed to create Connect account',
      message: error.message
    });
  }
};

/**
 * Get a driver's Stripe Connect account
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getConnectAccount = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Check if "me" parameter was used
    const accountId = req.params.id === 'me' ? userId : req.params.id;
    
    // Verify authorization
    if (accountId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Not authorized to access this account'
      });
    }
    
    const account = await stripeConnectService.getOrCreateConnectAccount(accountId);
    const isOnboardingComplete = await stripeConnectService.checkOnboardingStatus(accountId);
    const isPremium = await stripeConnectService.isDriverPremium(accountId);
    
    res.status(200).json({
      id: account.id,
      details_submitted: account.details_submitted,
      charges_enabled: account.charges_enabled,
      payouts_enabled: account.payouts_enabled,
      capabilities: account.capabilities,
      onboarding_complete: isOnboardingComplete,
      is_premium: isPremium
    });
  } catch (error) {
    console.error('Error getting Connect account:', error);
    res.status(500).json({
      error: 'Failed to get Connect account',
      message: error.message
    });
  }
};

/**
 * Generate onboarding link for a driver
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const generateOnboardingLink = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Verify user is a driver
    if (req.user.role !== 'driver' && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Only drivers or admins can access onboarding'
      });
    }
    
    // Allow admins to generate links for other drivers
    const driverId = req.body.driverId || userId;
    
    // Verify authorization
    if (driverId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Not authorized to generate onboarding link for this driver'
      });
    }
    
    const { returnUrl } = req.body;
    const accountLink = await stripeConnectService.generateOnboardingLink(driverId, returnUrl);
    
    res.status(200).json({
      url: accountLink.url,
      expires_at: accountLink.expires_at
    });
  } catch (error) {
    console.error('Error generating onboarding link:', error);
    res.status(500).json({
      error: 'Failed to generate onboarding link',
      message: error.message
    });
  }
};

/**
 * Refresh onboarding for a driver
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const refreshOnboarding = async (req, res) => {
  try {
    const driverId = req.query.driver_id;
    
    if (!driverId) {
      return res.status(400).json({
        error: 'Driver ID is required'
      });
    }
    
    const returnUrl = `${config.baseUrl}/api/payment/connect/onboarding-complete?driver_id=${driverId}`;
    const accountLink = await stripeConnectService.generateOnboardingLink(driverId, returnUrl);
    
    // Redirect to the new onboarding URL
    res.redirect(accountLink.url);
  } catch (error) {
    console.error('Error refreshing onboarding:', error);
    res.status(500).json({
      error: 'Failed to refresh onboarding',
      message: error.message
    });
  }
};

/**
 * Handle onboarding completion
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const onboardingComplete = async (req, res) => {
  try {
    const driverId = req.query.driver_id;
    
    if (!driverId) {
      return res.status(400).json({
        error: 'Driver ID is required'
      });
    }
    
    // Update onboarding status
    await stripeConnectService.checkOnboardingStatus(driverId);
    
    // Redirect to the driver dashboard
    res.redirect(`${config.baseUrl}/driver-dashboard?onboarding=complete`);
  } catch (error) {
    console.error('Error handling onboarding completion:', error);
    res.status(500).json({
      error: 'Failed to complete onboarding',
      message: error.message
    });
  }
};

/**
 * Get Connect dashboard link for a driver
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getDashboardLink = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Verify user is a driver
    if (req.user.role !== 'driver' && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Only drivers or admins can access dashboard links'
      });
    }
    
    // Allow admins to get dashboard links for drivers
    const driverId = req.query.driver_id || userId;
    
    // Verify authorization
    if (driverId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Not authorized to get dashboard link for this driver'
      });
    }
    
    const dashboardLink = await stripeConnectService.getConnectDashboardLink(driverId);
    
    res.status(200).json({
      url: dashboardLink.url
    });
  } catch (error) {
    console.error('Error getting dashboard link:', error);
    res.status(500).json({
      error: 'Failed to get dashboard link',
      message: error.message
    });
  }
};

/**
 * Create a payment intent
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createPaymentIntent = async (req, res) => {
  try {
    const { orderId, paymentMethodId, tipAmount } = req.body;
    const userId = req.user.id;
    
    if (!orderId) {
      return res.status(400).json({
        error: 'Order ID is required'
      });
    }
    
    const paymentIntent = await stripeConnectService.createPaymentIntent({
      orderId,
      paymentMethodId,
      tipAmount
    }, userId);
    
    res.status(201).json({
      id: paymentIntent.id,
      client_secret: paymentIntent.client_secret,
      amount: paymentIntent.amount,
      currency: paymentIntent.currency,
      status: paymentIntent.status
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({
      error: 'Failed to create payment intent',
      message: error.message
    });
  }
};

/**
 * Add a payment method
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const addPaymentMethod = async (req, res) => {
  try {
    const { paymentMethodId } = req.body;
    const userId = req.user.id;
    
    if (!paymentMethodId) {
      return res.status(400).json({
        error: 'Payment method ID is required'
      });
    }
    
    const paymentMethod = await stripeConnectService.addPaymentMethod(userId, paymentMethodId);
    
    res.status(201).json(paymentMethod);
  } catch (error) {
    console.error('Error adding payment method:', error);
    res.status(500).json({
      error: 'Failed to add payment method',
      message: error.message
    });
  }
};

/**
 * Get payment methods for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getPaymentMethods = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const paymentMethods = await stripeConnectService.getPaymentMethods(userId);
    
    res.status(200).json(paymentMethods);
  } catch (error) {
    console.error('Error getting payment methods:', error);
    res.status(500).json({
      error: 'Failed to get payment methods',
      message: error.message
    });
  }
};

/**
 * Remove a payment method
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const removePaymentMethod = async (req, res) => {
  try {
    const paymentMethodId = req.params.id;
    const userId = req.user.id;
    
    if (!paymentMethodId) {
      return res.status(400).json({
        error: 'Payment method ID is required'
      });
    }
    
    const result = await stripeConnectService.removePaymentMethod(userId, paymentMethodId);
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Error removing payment method:', error);
    res.status(500).json({
      error: 'Failed to remove payment method',
      message: error.message
    });
  }
};

/**
 * Record a cash payment
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const recordCashPayment = async (req, res) => {
  try {
    const { orderId, tipAmount } = req.body;
    const userId = req.user.id;
    
    if (!orderId) {
      return res.status(400).json({
        error: 'Order ID is required'
      });
    }
    
    const transaction = await stripeConnectService.recordCashPayment(orderId, userId, tipAmount);
    
    res.status(201).json(transaction);
  } catch (error) {
    console.error('Error recording cash payment:', error);
    res.status(500).json({
      error: 'Failed to record cash payment',
      message: error.message
    });
  }
};

/**
 * Generate payment link for driver to pay platform fees
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getCashFeePaymentLink = async (req, res) => {
  try {
    const { transactionId } = req.body;
    const userId = req.user.id;
    
    if (!transactionId) {
      return res.status(400).json({
        error: 'Transaction ID is required'
      });
    }
    
    // Verify user is a driver
    if (req.user.role !== 'driver') {
      return res.status(403).json({
        error: 'Only drivers can pay cash fees'
      });
    }
    
    const paymentLink = await stripeConnectService.createCashFeePaymentLink(userId, transactionId);
    
    res.status(200).json({
      url: paymentLink.url
    });
  } catch (error) {
    console.error('Error generating cash fee payment link:', error);
    res.status(500).json({
      error: 'Failed to generate payment link',
      message: error.message
    });
  }
};

/**
 * Create a subscription for a driver
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const createSubscription = async (req, res) => {
  try {
    const { paymentMethodId } = req.body;
    const userId = req.user.id;
    
    if (!paymentMethodId) {
      return res.status(400).json({
        error: 'Payment method ID is required'
      });
    }
    
    // Verify user is a driver
    if (req.user.role !== 'driver') {
      return res.status(403).json({
        error: 'Only drivers can create subscriptions'
      });
    }
    
    const subscription = await stripeConnectService.createDriverSubscription(userId, paymentMethodId);
    
    res.status(201).json({
      id: subscription.id,
      status: subscription.status,
      current_period_start: new Date(subscription.current_period_start * 1000),
      current_period_end: new Date(subscription.current_period_end * 1000)
    });
  } catch (error) {
    console.error('Error creating subscription:', error);
    res.status(500).json({
      error: 'Failed to create subscription',
      message: error.message
    });
  }
};

/**
 * Cancel a driver's subscription
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const cancelSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Verify user is a driver
    if (req.user.role !== 'driver' && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Only drivers or admins can cancel subscriptions'
      });
    }
    
    // Allow admins to cancel subscriptions for drivers
    const driverId = req.body.driverId || userId;
    
    // Verify authorization
    if (driverId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({
        error: 'Not authorized to cancel subscription for this driver'
      });
    }
    
    const result = await stripeConnectService.cancelDriverSubscription(driverId);
    
    res.status(200).json(result);
  } catch (error) {
    console.error('Error canceling subscription:', error);
    res.status(500).json({
      error: 'Failed to cancel subscription',
      message: error.message
    });
  }
};

/**
 * Get current subscription for a driver
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getCurrentSubscription = async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Query driver's subscription from database
    const { data, error } = await req.supabase
      .from('driver_subscriptions')
      .select('*')
      .eq('driver_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 is "no rows returned" error
      throw error;
    }
    
    if (!data) {
      return res.status(404).json({
        error: 'No subscription found'
      });
    }
    
    res.status(200).json(data);
  } catch (error) {
    console.error('Error getting subscription:', error);
    res.status(500).json({
      error: 'Failed to get subscription',
      message: error.message
    });
  }
};

/**
 * Handle Stripe webhook
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const handleWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;
  
  try {
    // Create Stripe instance
    const stripe = require('stripe')(config.stripe.secretKey);
    
    // Verify webhook signature using the Stripe library's recommended method
    // req.body should be the raw body buffer for signature verification
    if (!req.rawBody && typeof req.body !== 'string') {
      throw new Error('Webhook requires raw body for signature verification');
    }
    
    const rawBody = req.rawBody || req.body;
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      config.stripe.webhookSecret
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error.message);
    return res.status(400).send(`Webhook Error: ${error.message}`);
  }
  
  try {
    // Process webhook event
    const result = await stripeConnectService.handleWebhookEvent(event);
    
    // Return success
    res.status(200).json({ received: true, ...result });
  } catch (error) {
    console.error(`Error processing webhook ${event.type}:`, error);
    res.status(500).json({
      error: 'Webhook processing failed',
      message: error.message
    });
  }
};

module.exports = {
  createConnectAccount,
  getConnectAccount,
  generateOnboardingLink,
  refreshOnboarding,
  onboardingComplete,
  getDashboardLink,
  createPaymentIntent,
  addPaymentMethod,
  getPaymentMethods,
  removePaymentMethod,
  recordCashPayment,
  getCashFeePaymentLink,
  createSubscription,
  cancelSubscription,
  getCurrentSubscription,
  handleWebhook
};