const Stripe = require('stripe');
const config = require('../../config');
const { ApiError, logger } = require('../../middleware/errorHandler');

/**
 * Stripe Payment Service
 * Handles payment processing and Stripe integration
 */
class StripeService {
  constructor() {
    if (StripeService.instance) {
      return StripeService.instance;
    }
    
    if (!config.stripe.secretKey) {
      logger.warn('Stripe API key not configured');
      this.stripe = null;
    } else {
      this.stripe = new Stripe(config.stripe.secretKey, {
        apiVersion: '2023-10-16'
      });
    }
    
    StripeService.instance = this;
  }
  
  /**
   * Create a payment intent for a delivery order
   * @param {Object} options - Payment options
   * @param {number} options.amount - Amount in cents/smallest currency unit
   * @param {string} options.currency - Currency code (e.g., 'eur')
   * @param {string} options.customerId - Customer ID (if stored in Stripe)
   * @param {string} options.orderId - Order ID for metadata
   * @param {Object} options.paymentMethod - Payment method details
   * @returns {Promise<Object>} - Payment intent details
   */
  async createPaymentIntent(options) {
    try {
      if (!this.stripe) {
        throw new ApiError(500, 'Payment service not configured');
      }
      
      const { amount, currency = 'eur', customerId, orderId, paymentMethod } = options;
      
      if (!amount || amount <= 0) {
        throw new ApiError(400, 'Invalid payment amount');
      }
      
      const paymentIntentOptions = {
        amount,
        currency,
        metadata: {
          orderId,
          integration: 'maxmove'
        }
      };
      
      // If customer exists in Stripe, attach to payment
      if (customerId) {
        paymentIntentOptions.customer = customerId;
      }
      
      // If specific payment method provided
      if (paymentMethod) {
        paymentIntentOptions.payment_method = paymentMethod;
        paymentIntentOptions.confirm = true;
        paymentIntentOptions.return_url = options.returnUrl;
      }
      
      const paymentIntent = await this.stripe.paymentIntents.create(paymentIntentOptions);
      
      return {
        paymentIntentId: paymentIntent.id,
        clientSecret: paymentIntent.client_secret,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency
      };
    } catch (error) {
      logger.error({
        message: 'Payment intent creation error',
        options,
        error: error.message,
        stack: error.stack
      });
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError(500, 'Error creating payment: ' + error.message);
    }
  }
  
  /**
   * Create or retrieve a Stripe customer
   * @param {Object} customerData - Customer details
   * @param {string} customerData.email - Customer email
   * @param {string} customerData.name - Customer name
   * @param {string} customerData.phone - Customer phone
   * @returns {Promise<Object>} - Stripe customer object
   */
  async createCustomer(customerData) {
    try {
      if (!this.stripe) {
        throw new ApiError(500, 'Payment service not configured');
      }
      
      const { email, name, phone } = customerData;
      
      if (!email) {
        throw new ApiError(400, 'Email is required to create customer');
      }
      
      // Check if customer already exists
      const existingCustomers = await this.stripe.customers.list({
        email,
        limit: 1
      });
      
      if (existingCustomers.data.length > 0) {
        // Update existing customer
        const customer = await this.stripe.customers.update(
          existingCustomers.data[0].id,
          {
            name: name || existingCustomers.data[0].name,
            phone: phone || existingCustomers.data[0].phone
          }
        );
        return {
          id: customer.id,
          email: customer.email,
          name: customer.name,
          isNew: false
        };
      }
      
      // Create new customer
      const customer = await this.stripe.customers.create({
        email,
        name,
        phone
      });
      
      return {
        id: customer.id,
        email: customer.email,
        name: customer.name,
        isNew: true
      };
    } catch (error) {
      logger.error({
        message: 'Customer creation error',
        customerData,
        error: error.message,
        stack: error.stack
      });
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError(500, 'Error creating customer: ' + error.message);
    }
  }
  
  /**
   * Save a payment method for future use
   * @param {string} customerId - Stripe customer ID
   * @param {string} paymentMethodId - Payment method ID
   * @returns {Promise<Object>} - Payment method details
   */
  async savePaymentMethod(customerId, paymentMethodId) {
    try {
      if (!this.stripe) {
        throw new ApiError(500, 'Payment service not configured');
      }
      
      // Attach payment method to customer
      await this.stripe.paymentMethods.attach(paymentMethodId, {
        customer: customerId
      });
      
      // Set as default payment method
      await this.stripe.customers.update(customerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId
        }
      });
      
      // Get payment method details
      const paymentMethod = await this.stripe.paymentMethods.retrieve(paymentMethodId);
      
      return {
        id: paymentMethod.id,
        type: paymentMethod.type,
        card: paymentMethod.card ? {
          brand: paymentMethod.card.brand,
          last4: paymentMethod.card.last4,
          expMonth: paymentMethod.card.exp_month,
          expYear: paymentMethod.card.exp_year
        } : null
      };
    } catch (error) {
      logger.error({
        message: 'Payment method save error',
        customerId,
        paymentMethodId,
        error: error.message,
        stack: error.stack
      });
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError(500, 'Error saving payment method: ' + error.message);
    }
  }
  
  /**
   * Process a webhook event from Stripe
   * @param {string} body - Raw request body
   * @param {string} signature - Webhook signature
   * @returns {Promise<Object>} - Processed event
   */
  async handleWebhookEvent(body, signature) {
    try {
      if (!this.stripe) {
        throw new ApiError(500, 'Payment service not configured');
      }
      
      if (!config.stripe.webhookSecret) {
        throw new ApiError(500, 'Webhook secret not configured');
      }
      
      const event = this.stripe.webhooks.constructEvent(
        body,
        signature,
        config.stripe.webhookSecret
      );
      
      return {
        type: event.type,
        data: event.data.object,
        id: event.id
      };
    } catch (error) {
      logger.error({
        message: 'Webhook processing error',
        error: error.message
      });
      
      if (error instanceof ApiError) {
        throw error;
      }
      
      throw new ApiError(400, 'Webhook error: ' + error.message);
    }
  }
}

module.exports = new StripeService();