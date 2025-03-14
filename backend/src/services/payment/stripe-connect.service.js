/**
 * Stripe Connect Service
 * Handles integration with Stripe Connect for driver payments, onboarding, and platform fees
 */

const Stripe = require('stripe');
const config = require('../../config');
const supabaseService = require('../database/supabase.service');

class StripeConnectService {
  constructor() {
    this.stripe = new Stripe(config.stripe.secretKey);
    this.supabase = supabaseService.getClient();
    this.supabaseAdmin = supabaseService.getAdminClient();
    
    // Initialize subscription product and price
    this.initializeSubscriptionProduct();
  }
  
  /**
   * Initializes the driver subscription product and price in Stripe
   * This ensures the product exists before we try to use it
   */
  async initializeSubscriptionProduct() {
    try {
      // Get product info from database
      const { data: productNameData } = await this.supabase
        .from('api_keys')
        .select('key_value')
        .eq('key_name', 'stripe_premium_driver_product_name')
        .single();
        
      const { data: productDescData } = await this.supabase
        .from('api_keys')
        .select('key_value')
        .eq('key_name', 'stripe_premium_driver_product_description')
        .single();
        
      const { data: priceAmountData } = await this.supabase
        .from('api_keys')
        .select('key_value')
        .eq('key_name', 'stripe_premium_driver_price_amount')
        .single();
        
      const { data: priceIntervalData } = await this.supabase
        .from('api_keys')
        .select('key_value')
        .eq('key_name', 'stripe_premium_driver_price_interval')
        .single();
      
      if (!productNameData || !productDescData || !priceAmountData || !priceIntervalData) {
        console.error('Missing subscription product data in api_keys table');
        return;
      }
      
      const productName = productNameData.key_value;
      const productDescription = productDescData.key_value;
      const priceAmount = parseInt(priceAmountData.key_value);
      const priceInterval = priceIntervalData.key_value;
      
      // Check if we already have the price ID in config
      if (config.stripe.driverSubscriptionPriceId && 
          config.stripe.driverSubscriptionPriceId !== 'price_create_in_stripe_dashboard') {
        console.log('Using existing driver subscription price:', config.stripe.driverSubscriptionPriceId);
        return;
      }
      
      // Create or retrieve product
      let product;
      try {
        // Try to retrieve existing product by name
        const products = await this.stripe.products.list({ limit: 100 });
        product = products.data.find(p => p.name === productName);
        
        if (!product) {
          // Create new product if not found
          product = await this.stripe.products.create({
            name: productName,
            description: productDescription,
            metadata: {
              type: 'driver_subscription'
            }
          });
          console.log('Created new subscription product:', product.id);
        } else {
          console.log('Using existing subscription product:', product.id);
        }
      } catch (error) {
        console.error('Error creating/retrieving subscription product:', error);
        return;
      }
      
      // Create or retrieve price
      let price;
      try {
        // Try to retrieve existing price for this product
        const prices = await this.stripe.prices.list({ 
          product: product.id,
          limit: 100
        });
        
        price = prices.data.find(p => 
          p.recurring && 
          p.recurring.interval === priceInterval && 
          p.unit_amount === priceAmount
        );
        
        if (!price) {
          // Create new price if not found
          price = await this.stripe.prices.create({
            product: product.id,
            unit_amount: priceAmount,
            currency: 'eur',
            recurring: {
              interval: priceInterval
            },
            metadata: {
              type: 'driver_subscription'
            }
          });
          console.log('Created new subscription price:', price.id);
        } else {
          console.log('Using existing subscription price:', price.id);
        }
      } catch (error) {
        console.error('Error creating/retrieving subscription price:', error);
        return;
      }
      
      // Update price ID in api_keys for future use
      await this.supabaseAdmin
        .from('api_keys')
        .upsert({
          key_name: 'stripe_premium_driver_price_id',
          key_value: price.id,
          description: 'Stripe price ID for premium driver subscription'
        }, {
          onConflict: 'key_name'
        });
      
      // Store in memory for this session
      config.stripe.driverSubscriptionPriceId = price.id;
      console.log('Driver subscription price ID set:', price.id);
    } catch (error) {
      console.error('Error initializing subscription product:', error);
    }
  }

  /**
   * Create a Stripe customer for a user
   * @param {Object} user - User object with id and email
   * @returns {Promise<Object>} Stripe customer object
   */
  async createCustomer(user) {
    try {
      // Create Stripe customer
      const customer = await this.stripe.customers.create({
        email: user.email,
        name: user.name,
        metadata: {
          user_id: user.id
        }
      });

      // Update user profile with Stripe customer ID
      const { error } = await this.supabaseAdmin
        .from('profiles')
        .update({ stripe_customer_id: customer.id })
        .eq('id', user.id);

      if (error) {
        console.error('Error updating Stripe customer ID:', error);
        throw error;
      }

      return customer;
    } catch (error) {
      console.error('Error creating customer:', error);
      throw error;
    }
  }

  /**
   * Get or create a Stripe customer for a user
   * @param {string} userId - User ID
   * @returns {Promise<Object>} Stripe customer object
   */
  async getOrCreateCustomer(userId) {
    try {
      // Get user profile
      const { data: user, error } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;

      // If customer exists, retrieve it
      if (user.stripe_customer_id) {
        return await this.stripe.customers.retrieve(user.stripe_customer_id);
      }

      // Create new customer
      return await this.createCustomer(user);
    } catch (error) {
      console.error('Error in getOrCreateCustomer:', error);
      throw error;
    }
  }

  /**
   * Create a Stripe Connect account for a driver
   * @param {string} driverId - Driver user ID
   * @returns {Promise<Object>} Stripe account object
   */
  async createConnectAccount(driverId) {
    try {
      // Get driver profile
      const { data: driver, error } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', driverId)
        .single();

      if (error) throw error;

      // Create Express account
      const account = await this.stripe.accounts.create({
        type: 'express',
        email: driver.email,
        capabilities: {
          card_payments: { requested: true },
          transfers: { requested: true }
        },
        business_type: 'individual',
        metadata: {
          driver_id: driver.id
        }
      });

      // Update driver profile with Stripe account ID
      const { error: updateError } = await this.supabaseAdmin
        .from('profiles')
        .update({
          stripe_account_id: account.id,
          stripe_account_status: account.capabilities,
          stripe_onboarding_completed: false
        })
        .eq('id', driverId);

      if (updateError) {
        console.error('Error updating driver with Stripe account:', updateError);
        throw updateError;
      }

      return account;
    } catch (error) {
      console.error('Error creating Connect account:', error);
      throw error;
    }
  }

  /**
   * Generate an onboarding link for a driver
   * @param {string} driverId - Driver user ID
   * @param {string} returnUrl - URL to redirect after onboarding
   * @returns {Promise<Object>} Account link object
   */
  async generateOnboardingLink(driverId, returnUrl) {
    try {
      // Get driver profile
      const { data: driver, error } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', driverId)
        .single();

      if (error) throw error;
      if (!driver.stripe_account_id) {
        throw new Error('Driver does not have a Stripe Connect account');
      }

      // Create account link
      const accountLink = await this.stripe.accountLinks.create({
        account: driver.stripe_account_id,
        refresh_url: `${config.baseUrl}/api/payment/connect/refresh-onboarding?driver_id=${driverId}`,
        return_url: returnUrl || `${config.baseUrl}/api/payment/connect/onboarding-complete?driver_id=${driverId}`,
        type: 'account_onboarding',
        collect: 'eventually_due'
      });

      return accountLink;
    } catch (error) {
      console.error('Error generating onboarding link:', error);
      throw error;
    }
  }

  /**
   * Check if driver onboarding is complete
   * @param {string} driverId - Driver user ID
   * @returns {Promise<boolean>} Whether onboarding is complete
   */
  async checkOnboardingStatus(driverId) {
    try {
      // Get driver profile
      const { data: driver, error } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', driverId)
        .single();

      if (error) throw error;
      if (!driver.stripe_account_id) {
        return false;
      }

      // Get account details
      const account = await this.stripe.accounts.retrieve(driver.stripe_account_id);
      
      const isOnboardingComplete = 
        account.details_submitted && 
        account.capabilities.card_payments === 'active' && 
        account.capabilities.transfers === 'active';

      // Update driver profile with onboarding status
      if (isOnboardingComplete !== driver.stripe_onboarding_completed) {
        await this.supabaseAdmin
          .from('profiles')
          .update({
            stripe_onboarding_completed: isOnboardingComplete,
            stripe_account_status: JSON.stringify(account.capabilities)
          })
          .eq('id', driverId);
      }

      return isOnboardingComplete;
    } catch (error) {
      console.error('Error checking onboarding status:', error);
      throw error;
    }
  }

  /**
   * Get Stripe Connect dashboard link for a driver
   * @param {string} driverId - Driver user ID
   * @returns {Promise<Object>} Dashboard link object
   */
  async getConnectDashboardLink(driverId) {
    try {
      // Get driver profile
      const { data: driver, error } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', driverId)
        .single();

      if (error) throw error;
      if (!driver.stripe_account_id) {
        throw new Error('Driver does not have a Stripe Connect account');
      }

      // Generate dashboard link
      const link = await this.stripe.accounts.createLoginLink(
        driver.stripe_account_id
      );

      return link;
    } catch (error) {
      console.error('Error generating dashboard link:', error);
      throw error;
    }
  }

  /**
   * Get or create a Connect account for a driver
   * @param {string} driverId - Driver user ID
   * @returns {Promise<Object>} Stripe account object or account creation result
   */
  async getOrCreateConnectAccount(driverId) {
    try {
      // Get driver profile
      const { data: driver, error } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', driverId)
        .single();

      if (error) throw error;

      // If driver has a Stripe account, retrieve it
      if (driver.stripe_account_id) {
        try {
          const account = await this.stripe.accounts.retrieve(driver.stripe_account_id);
          return account;
        } catch (stripeError) {
          // If the account doesn't exist anymore, create a new one
          if (stripeError.code === 'resource_missing') {
            return await this.createConnectAccount(driverId);
          }
          throw stripeError;
        }
      }

      // If no account exists, create a new one
      return await this.createConnectAccount(driverId);
    } catch (error) {
      console.error('Error in getOrCreateConnectAccount:', error);
      throw error;
    }
  }

  /**
   * Check if a driver is premium (has active subscription)
   * @param {string} driverId - Driver user ID
   * @returns {Promise<boolean>} Whether driver is premium
   */
  async isDriverPremium(driverId) {
    try {
      const { data, error } = await this.supabase
        .from('driver_subscriptions')
        .select('*')
        .eq('driver_id', driverId)
        .eq('is_premium', true)
        .eq('status', 'active')
        .maybeSingle();

      if (error) throw error;
      
      return !!data; // Return true if data exists, false otherwise
    } catch (error) {
      console.error('Error checking driver premium status:', error);
      return false; // Default to non-premium on error
    }
  }

  /**
   * Create a subscription for a driver
   * @param {string} driverId - Driver user ID
   * @param {string} paymentMethodId - Stripe payment method ID
   * @returns {Promise<Object>} Subscription object
   */
  async createDriverSubscription(driverId, paymentMethodId) {
    try {
      // Get or create customer
      const customer = await this.getOrCreateCustomer(driverId);
      
      // Attach payment method to customer
      await this.stripe.paymentMethods.attach(paymentMethodId, {
        customer: customer.id,
      });
      
      // Set as default payment method
      await this.stripe.customers.update(customer.id, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });
      
      // Get the price ID (from config or from database)
      let priceId = config.stripe.driverSubscriptionPriceId;
      
      // If not available in config, try to get from database
      if (!priceId || priceId === 'price_create_in_stripe_dashboard') {
        const { data: priceData } = await this.supabase
          .from('api_keys')
          .select('key_value')
          .eq('key_name', 'stripe_premium_driver_price_id')
          .single();
          
        if (priceData) {
          priceId = priceData.key_value;
          // Update config for future use
          config.stripe.driverSubscriptionPriceId = priceId;
        } else {
          throw new Error('Subscription price ID not found. Please run the server once to initialize it.');
        }
      }
      
      // Create subscription
      const subscription = await this.stripe.subscriptions.create({
        customer: customer.id,
        items: [
          { price: priceId },
        ],
        payment_behavior: 'default_incomplete',
        payment_settings: {
          payment_method_types: ['card'],
          save_default_payment_method: 'on_subscription',
        },
        expand: ['latest_invoice.payment_intent'],
        metadata: {
          driver_id: driverId
        }
      });
      
      // Store subscription in database
      const { error } = await this.supabase
        .from('driver_subscriptions')
        .insert({
          driver_id: driverId,
          is_premium: true,
          subscription_id: subscription.id,
          status: subscription.status,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString()
        });
      
      if (error) throw error;
      
      return subscription;
    } catch (error) {
      console.error('Error creating driver subscription:', error);
      throw error;
    }
  }

  /**
   * Cancel a driver's subscription
   * @param {string} driverId - Driver user ID
   * @returns {Promise<Object>} Cancellation result
   */
  async cancelDriverSubscription(driverId) {
    try {
      // Get subscription from database
      const { data: subscription, error } = await this.supabase
        .from('driver_subscriptions')
        .select('*')
        .eq('driver_id', driverId)
        .eq('status', 'active')
        .single();
      
      if (error) throw error;
      if (!subscription) {
        throw new Error('No active subscription found');
      }
      
      // Cancel in Stripe
      const canceledSubscription = await this.stripe.subscriptions.update(
        subscription.subscription_id,
        { cancel_at_period_end: true }
      );
      
      // Update in database
      const { error: updateError } = await this.supabase
        .from('driver_subscriptions')
        .update({
          status: canceledSubscription.status,
          is_premium: canceledSubscription.cancel_at_period_end ? false : true
        })
        .eq('subscription_id', subscription.subscription_id);
      
      if (updateError) throw updateError;
      
      return { success: true, subscription: canceledSubscription };
    } catch (error) {
      console.error('Error canceling driver subscription:', error);
      throw error;
    }
  }

  /**
   * Create a payment intent for an order
   * @param {Object} orderData - Order data
   * @param {string} customerUserId - Customer user ID
   * @returns {Promise<Object>} Payment intent
   */
  async createPaymentIntent(orderData, customerUserId) {
    try {
      // Get order details
      const { data: order, error: orderError } = await this.supabase
        .from('orders')
        .select('*')
        .eq('id', orderData.orderId)
        .single();
      
      if (orderError) throw orderError;
      
      // Get customer
      const customer = await this.getOrCreateCustomer(customerUserId);
      
      // Check if driver exists and has Stripe account
      const { data: driver, error: driverError } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', order.driver_id)
        .single();
      
      if (driverError) throw driverError;
      
      if (!driver.stripe_account_id || !driver.stripe_onboarding_completed) {
        throw new Error('Driver does not have a complete Stripe Connect account');
      }
      
      // Check if driver is premium
      const isPremium = await this.isDriverPremium(driver.id);
      
      // Calculate fees
      const platformFee = 100; // €1 in cents
      const driverFeePercent = isPremium ? 5 : 15;
      const driverFee = Math.round((order.amount * driverFeePercent) / 100);
      const totalFee = platformFee + driverFee;
      const tipAmount = orderData.tipAmount || 0;
      
      // Create payment intent
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: order.amount + platformFee + tipAmount,
        currency: 'eur',
        customer: customer.stripe_customer_id,
        payment_method: orderData.paymentMethodId,
        application_fee_amount: totalFee,
        transfer_data: {
          destination: driver.stripe_account_id,
        },
        metadata: {
          order_id: order.id,
          customer_id: customerUserId,
          driver_id: driver.id,
          platform_fee: platformFee,
          driver_fee: driverFee,
          driver_fee_percent: driverFeePercent,
          tip_amount: tipAmount,
          is_premium_driver: isPremium
        },
        confirm: false, // Don't confirm automatically
      });
      
      // Store transaction in database
      const { error: txError } = await this.supabase
        .from('payment_transactions')
        .insert({
          order_id: order.id,
          customer_id: customerUserId,
          driver_id: driver.id,
          amount: order.amount,
          platform_fee: platformFee,
          driver_fee: driverFee,
          tip_amount: tipAmount,
          payment_method: 'card',
          payment_status: 'pending',
          stripe_payment_intent_id: paymentIntent.id
        });
      
      if (txError) throw txError;
      
      return paymentIntent;
    } catch (error) {
      console.error('Error creating payment intent:', error);
      throw error;
    }
  }

  /**
   * Add a payment method for a user
   * @param {string} userId - User ID
   * @param {string} paymentMethodId - Stripe payment method ID
   * @returns {Promise<Object>} Payment method data
   */
  async addPaymentMethod(userId, paymentMethodId) {
    try {
      // Get or create customer
      const customer = await this.getOrCreateCustomer(userId);
      
      // Attach payment method to customer
      await this.stripe.paymentMethods.attach(paymentMethodId, {
        customer: customer.id,
      });
      
      // Get payment method details
      const paymentMethod = await this.stripe.paymentMethods.retrieve(paymentMethodId);
      
      // Store in database
      const { data, error } = await this.supabase
        .from('payment_methods')
        .insert({
          user_id: userId,
          stripe_payment_method_id: paymentMethodId,
          type: paymentMethod.type,
          last_four: paymentMethod.card ? paymentMethod.card.last4 : null,
          is_default: false
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error adding payment method:', error);
      throw error;
    }
  }

  /**
   * Get payment methods for a user
   * @param {string} userId - User ID
   * @returns {Promise<Array>} Payment methods
   */
  async getPaymentMethods(userId) {
    try {
      const { data, error } = await this.supabase
        .from('payment_methods')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error getting payment methods:', error);
      throw error;
    }
  }

  /**
   * Remove a payment method
   * @param {string} userId - User ID
   * @param {string} paymentMethodId - Payment method ID
   * @returns {Promise<Object>} Deletion result
   */
  async removePaymentMethod(userId, paymentMethodId) {
    try {
      // Get payment method from database
      const { data: paymentMethod, error } = await this.supabase
        .from('payment_methods')
        .select('*')
        .eq('id', paymentMethodId)
        .eq('user_id', userId)
        .single();
      
      if (error) throw error;
      
      // Detach from Stripe
      await this.stripe.paymentMethods.detach(paymentMethod.stripe_payment_method_id);
      
      // Delete from database
      const { error: deleteError } = await this.supabase
        .from('payment_methods')
        .delete()
        .eq('id', paymentMethodId)
        .eq('user_id', userId);
      
      if (deleteError) throw deleteError;
      
      return { success: true };
    } catch (error) {
      console.error('Error removing payment method:', error);
      throw error;
    }
  }

  /**
   * Record a cash payment
   * @param {string} orderId - Order ID
   * @param {string} customerUserId - Customer user ID
   * @param {number} tipAmount - Tip amount in cents
   * @returns {Promise<Object>} Transaction record
   */
  async recordCashPayment(orderId, customerUserId, tipAmount = 0) {
    try {
      // Get order details
      const { data: order, error: orderError } = await this.supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();
      
      if (orderError) throw orderError;
      
      // Get driver details
      const { data: driver, error: driverError } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('id', order.driver_id)
        .single();
      
      if (driverError) throw driverError;
      
      // Check if driver is premium
      const isPremium = await this.isDriverPremium(driver.id);
      
      // Calculate fees
      const platformFee = 100; // €1 in cents
      const driverFeePercent = isPremium ? 5 : 15;
      const driverFee = Math.round((order.amount * driverFeePercent) / 100);
      
      // Store transaction
      const { data: transaction, error } = await this.supabase
        .from('payment_transactions')
        .insert({
          order_id: orderId,
          customer_id: customerUserId,
          driver_id: order.driver_id,
          amount: order.amount,
          platform_fee: platformFee,
          driver_fee: driverFee,
          tip_amount: tipAmount,
          payment_method: 'cash',
          payment_status: 'completed',
          is_cash: true,
          cash_fee_paid: false
        })
        .select()
        .single();
      
      if (error) throw error;
      
      return transaction;
    } catch (error) {
      console.error('Error recording cash payment:', error);
      throw error;
    }
  }

  /**
   * Create a payment link for driver to pay platform fees for cash payments
   * @param {string} driverId - Driver user ID
   * @param {string} transactionId - Transaction ID
   * @returns {Promise<Object>} Payment link
   */
  async createCashFeePaymentLink(driverId, transactionId) {
    try {
      // Get transaction
      const { data: transaction, error } = await this.supabase
        .from('payment_transactions')
        .select('*')
        .eq('id', transactionId)
        .eq('driver_id', driverId)
        .eq('is_cash', true)
        .single();
      
      if (error) throw error;
      
      // Calculate total fee
      const totalFee = transaction.platform_fee + transaction.driver_fee;
      
      // Get or create customer
      const customer = await this.getOrCreateCustomer(driverId);
      
      // Create payment link
      const paymentLink = await this.stripe.paymentLinks.create({
        line_items: [
          {
            price_data: {
              currency: 'eur',
              unit_amount: totalFee,
              product_data: {
                name: 'MaxMove Platform Fee',
                description: `Platform fee for Order #${transaction.order_id}`,
              },
            },
            quantity: 1,
          },
        ],
        customer: customer.stripe_customer_id,
        after_completion: {
          type: 'redirect',
          redirect: {
            url: `${config.baseUrl}/dashboard/earnings?fee_paid=true`,
          },
        },
        metadata: {
          transaction_id: transaction.id,
          driver_id: driverId,
          order_id: transaction.order_id,
          type: 'cash_payment_fee'
        }
      });
      
      return paymentLink;
    } catch (error) {
      console.error('Error creating cash fee payment link:', error);
      throw error;
    }
  }

  /**
   * Process a webhook event from Stripe
   * @param {Object} event - Stripe event object
   * @returns {Promise<Object>} Processing result
   */
  async handleWebhookEvent(event) {
    try {
      switch (event.type) {
        case 'account.updated':
          return await this.handleAccountUpdated(event.data.object);
        
        case 'payment_intent.succeeded':
          return await this.handlePaymentIntentSucceeded(event.data.object);
        
        case 'payment_intent.payment_failed':
          return await this.handlePaymentIntentFailed(event.data.object);
        
        case 'checkout.session.completed':
          return await this.handleCheckoutSessionCompleted(event.data.object);
        
        case 'invoice.paid':
          return await this.handleInvoicePaid(event.data.object);
        
        case 'invoice.payment_failed':
          return await this.handleInvoicePaymentFailed(event.data.object);
        
        default:
          console.log(`Unhandled event type: ${event.type}`);
          return { status: 'ignored', event: event.type };
      }
    } catch (error) {
      console.error(`Error handling webhook event ${event.type}:`, error);
      throw error;
    }
  }

  /**
   * Handle account.updated webhook event
   * @param {Object} account - Stripe account object
   * @returns {Promise<Object>} Processing result
   */
  async handleAccountUpdated(account) {
    try {
      // Find driver by Stripe account ID
      const { data: driver, error } = await this.supabase
        .from('profiles')
        .select('*')
        .eq('stripe_account_id', account.id)
        .single();
      
      if (error) {
        console.error('Error finding driver for account update:', error);
        return { status: 'error', message: 'Driver not found' };
      }
      
      // Check if onboarding is complete
      const isOnboardingComplete = 
        account.details_submitted && 
        account.capabilities.card_payments === 'active' && 
        account.capabilities.transfers === 'active';
      
      // Update driver profile
      const { error: updateError } = await this.supabaseAdmin
        .from('profiles')
        .update({
          stripe_onboarding_completed: isOnboardingComplete,
          stripe_account_status: JSON.stringify(account.capabilities)
        })
        .eq('id', driver.id);
      
      if (updateError) {
        console.error('Error updating driver onboarding status:', updateError);
        return { status: 'error', message: 'Failed to update driver status' };
      }
      
      return {
        status: 'success',
        driver_id: driver.id,
        onboarding_complete: isOnboardingComplete
      };
    } catch (error) {
      console.error('Error handling account.updated webhook:', error);
      throw error;
    }
  }

  /**
   * Handle payment_intent.succeeded webhook event
   * @param {Object} paymentIntent - Stripe payment intent object
   * @returns {Promise<Object>} Processing result
   */
  async handlePaymentIntentSucceeded(paymentIntent) {
    try {
      // Get transaction by payment intent ID
      const { data: transaction, error } = await this.supabase
        .from('payment_transactions')
        .select('*')
        .eq('stripe_payment_intent_id', paymentIntent.id)
        .single();
      
      if (error) {
        console.error('Error finding transaction for payment intent:', error);
        return { status: 'error', message: 'Transaction not found' };
      }
      
      // Use a transaction to ensure both updates succeed or fail together
      const result = await supabaseService.withTransaction(async (txContext) => {
        // Update transaction status within the transaction
        await txContext.update(
          'payment_transactions', 
          { 
            payment_status: 'completed',
            updated_at: new Date().toISOString()
          },
          { id: transaction.id }
        );
        
        // Update order status within the same transaction
        await txContext.update(
          'orders',
          {
            payment_status: 'paid',
            updated_at: new Date().toISOString()
          },
          { id: transaction.order_id }
        );
        
        return {
          status: 'success',
          transaction_id: transaction.id,
          order_id: transaction.order_id
        };
      });
      
      return result || { 
        status: 'success',
        transaction_id: transaction.id,
        order_id: transaction.order_id
      };
    } catch (error) {
      console.error('Error handling payment_intent.succeeded webhook:', error);
      throw error;
    }
  }

  /**
   * Handle payment_intent.payment_failed webhook event
   * @param {Object} paymentIntent - Stripe payment intent object
   * @returns {Promise<Object>} Processing result
   */
  async handlePaymentIntentFailed(paymentIntent) {
    try {
      // Get transaction by payment intent ID
      const { data: transaction, error } = await this.supabase
        .from('payment_transactions')
        .select('*')
        .eq('stripe_payment_intent_id', paymentIntent.id)
        .single();
      
      if (error) {
        console.error('Error finding transaction for failed payment:', error);
        return { status: 'error', message: 'Transaction not found' };
      }
      
      // Use a transaction to ensure both updates succeed or fail together
      const result = await supabaseService.withTransaction(async (txContext) => {
        // Update transaction status within the transaction
        await txContext.update(
          'payment_transactions', 
          { 
            payment_status: 'failed',
            updated_at: new Date().toISOString()
          },
          { id: transaction.id }
        );
        
        // Update order status to payment_failed if needed
        await txContext.update(
          'orders',
          {
            payment_status: 'payment_failed',
            updated_at: new Date().toISOString()
          },
          { id: transaction.order_id }
        );
        
        return {
          status: 'success',
          transaction_id: transaction.id,
          order_id: transaction.order_id
        };
      });
      
      return result || {
        status: 'success',
        transaction_id: transaction.id,
        order_id: transaction.order_id
      };
    } catch (error) {
      console.error('Error handling payment_intent.payment_failed webhook:', error);
      throw error;
    }
  }

  /**
   * Handle checkout.session.completed webhook event
   * @param {Object} session - Stripe checkout session object
   * @returns {Promise<Object>} Processing result
   */
  async handleCheckoutSessionCompleted(session) {
    try {
      // Check if this is a cash fee payment
      if (session.metadata && session.metadata.type === 'cash_payment_fee') {
        const transactionId = session.metadata.transaction_id;
        
        // Update transaction to mark fee as paid
        const { error: updateError } = await this.supabaseAdmin
          .from('payment_transactions')
          .update({
            cash_fee_paid: true,
            updated_at: new Date().toISOString()
          })
          .eq('id', transactionId);
        
        if (updateError) {
          console.error('Error updating cash fee payment:', updateError);
          return { status: 'error', message: 'Failed to update transaction' };
        }
        
        return {
          status: 'success',
          type: 'cash_fee_payment',
          transaction_id: transactionId
        };
      }
      
      return { status: 'ignored', type: 'unknown_checkout_session' };
    } catch (error) {
      console.error('Error handling checkout.session.completed webhook:', error);
      throw error;
    }
  }

  /**
   * Handle invoice.paid webhook event
   * @param {Object} invoice - Stripe invoice object
   * @returns {Promise<Object>} Processing result
   */
  async handleInvoicePaid(invoice) {
    try {
      // Check if this is a subscription invoice
      if (!invoice.subscription) {
        return { status: 'ignored', type: 'non_subscription_invoice' };
      }
      
      // Get subscription
      const subscription = await this.stripe.subscriptions.retrieve(invoice.subscription);
      
      if (!subscription.metadata || !subscription.metadata.driver_id) {
        return { status: 'ignored', type: 'non_driver_subscription' };
      }
      
      const driverId = subscription.metadata.driver_id;
      
      // Update subscription in database
      const { error } = await this.supabaseAdmin
        .from('driver_subscriptions')
        .update({
          status: subscription.status,
          is_premium: true,
          current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
          current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          updated_at: new Date().toISOString()
        })
        .eq('subscription_id', subscription.id);
      
      if (error) {
        console.error('Error updating driver subscription:', error);
        return { status: 'error', message: 'Failed to update subscription' };
      }
      
      return {
        status: 'success',
        driver_id: driverId,
        subscription_id: subscription.id
      };
    } catch (error) {
      console.error('Error handling invoice.paid webhook:', error);
      throw error;
    }
  }

  /**
   * Handle invoice.payment_failed webhook event
   * @param {Object} invoice - Stripe invoice object
   * @returns {Promise<Object>} Processing result
   */
  async handleInvoicePaymentFailed(invoice) {
    try {
      // Check if this is a subscription invoice
      if (!invoice.subscription) {
        return { status: 'ignored', type: 'non_subscription_invoice' };
      }
      
      // Get subscription
      const subscription = await this.stripe.subscriptions.retrieve(invoice.subscription);
      
      if (!subscription.metadata || !subscription.metadata.driver_id) {
        return { status: 'ignored', type: 'non_driver_subscription' };
      }
      
      const driverId = subscription.metadata.driver_id;
      
      // Update subscription in database
      const { error } = await this.supabaseAdmin
        .from('driver_subscriptions')
        .update({
          status: subscription.status,
          updated_at: new Date().toISOString()
        })
        .eq('subscription_id', subscription.id);
      
      if (error) {
        console.error('Error updating failed subscription payment:', error);
        return { status: 'error', message: 'Failed to update subscription' };
      }
      
      return {
        status: 'success',
        driver_id: driverId,
        subscription_id: subscription.id
      };
    } catch (error) {
      console.error('Error handling invoice.payment_failed webhook:', error);
      throw error;
    }
  }
}

module.exports = new StripeConnectService();