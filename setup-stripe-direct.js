// setup-stripe-direct.js
// This script sets up Stripe Connect directly without Supabase dependencies

require('dotenv').config();
const Stripe = require('stripe');

async function setupStripeDirect() {
  console.log('Setting up Stripe Connect directly...');
  
  if (!process.env.STRIPE_SECRET_KEY) {
    console.error('Error: STRIPE_SECRET_KEY must be set in .env file');
    process.exit(1);
  }
  
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  
  try {
    // 1. Create or get subscription product
    const productName = 'MaxMove Premium Driver Subscription';
    const productDescription = 'Reduced platform fee (5% instead of 15%) and priority matching';
    
    console.log('Looking for existing subscription product...');
    const products = await stripe.products.list({
      active: true,
      limit: 100
    });
    
    let product = products.data.find(p => p.name === productName);
    
    if (!product) {
      console.log('Creating new subscription product...');
      product = await stripe.products.create({
        name: productName,
        description: productDescription,
        metadata: {
          type: 'driver_subscription'
        }
      });
      console.log(`✅ Created new product: ${product.id}`);
    } else {
      console.log(`✅ Using existing product: ${product.id}`);
    }
    
    // 2. Create or get subscription price
    const priceAmount = 9900; // €99.00
    const priceInterval = 'month';
    
    console.log('Looking for existing subscription price...');
    const prices = await stripe.prices.list({
      product: product.id,
      active: true,
      limit: 100
    });
    
    let price = prices.data.find(p => 
      p.recurring && 
      p.recurring.interval === priceInterval && 
      p.unit_amount === priceAmount
    );
    
    if (!price) {
      console.log('Creating new subscription price...');
      price = await stripe.prices.create({
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
      console.log(`✅ Created new price: ${price.id}`);
    } else {
      console.log(`✅ Using existing price: ${price.id}`);
    }
    
    // 3. Set up webhook endpoint
    let webhookEndpoint;
    const baseUrl = process.env.BASE_URL || 'http://localhost:3000';
    const webhookUrl = `${baseUrl}/api/payment/webhooks`;
    
    console.log('Checking for existing webhook endpoint...');
    const webhooks = await stripe.webhookEndpoints.list();
    webhookEndpoint = webhooks.data.find(w => w.url === webhookUrl);
    
    if (!webhookEndpoint) {
      console.log('Creating new webhook endpoint...');
      webhookEndpoint = await stripe.webhookEndpoints.create({
        url: webhookUrl,
        enabled_events: [
          'account.updated',
          'payment_intent.succeeded',
          'payment_intent.payment_failed',
          'checkout.session.completed',
          'invoice.paid',
          'invoice.payment_failed'
        ],
        description: 'MaxMove webhook endpoint'
      });
      console.log(`✅ Created new webhook endpoint: ${webhookEndpoint.id}`);
      console.log(`🔑 Webhook signing secret: ${webhookEndpoint.secret}`);
      console.log('⚠️ Important: Add this webhook secret to your .env file as STRIPE_WEBHOOK_SECRET');
    } else {
      console.log(`✅ Using existing webhook endpoint: ${webhookEndpoint.id}`);
      console.log('⚠️ Note: Webhook signing secret is only shown when creating a new endpoint');
    }
    
    console.log('\nSetup completed successfully! 🎉');
    console.log('\nAdd these values to your .env file:');
    console.log(`STRIPE_DRIVER_SUBSCRIPTION_PRICE_ID=${price.id}`);
    if (webhookEndpoint.secret) {
      console.log(`STRIPE_WEBHOOK_SECRET=${webhookEndpoint.secret}`);
    } else {
      console.log('STRIPE_WEBHOOK_SECRET=[existing webhook secret or create a new webhook]');
    }
  } catch (error) {
    console.error('Error setting up Stripe:', error);
  }
}

setupStripeDirect();