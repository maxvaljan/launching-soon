// setup-stripe-webhook.js
// This script sets up a Stripe webhook endpoint for your application

const { Stripe } = require('stripe');
require('dotenv').config();

async function setupStripeWebhook() {
  console.log('Setting up Stripe webhook endpoint...');
  
  // Validate environment variables
  if (!process.env.STRIPE_SECRET_KEY || !process.env.BASE_URL) {
    console.error('Error: STRIPE_SECRET_KEY and BASE_URL must be set in .env file');
    process.exit(1);
  }
  
  // Initialize Stripe client
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  
  // Webhook endpoint URL
  const webhookUrl = `${process.env.BASE_URL}/api/payment/webhooks`;
  
  try {
    // List existing webhooks to check if one already exists for this URL
    const webhooks = await stripe.webhookEndpoints.list({ limit: 100 });
    const existingWebhook = webhooks.data.find(webhook => 
      webhook.url === webhookUrl
    );
    
    if (existingWebhook) {
      console.log(`✅ Webhook endpoint already exists for: ${webhookUrl}`);
      console.log(`Webhook secret: ${existingWebhook.secret} (please add this to your .env file as STRIPE_WEBHOOK_SECRET)`);
      return;
    }
    
    // Create new webhook endpoint
    const webhook = await stripe.webhookEndpoints.create({
      url: webhookUrl,
      enabled_events: [
        'account.updated',
        'payment_intent.succeeded',
        'payment_intent.payment_failed',
        'checkout.session.completed',
        'invoice.paid',
        'invoice.payment_failed'
      ],
      description: 'MaxMove automatic webhook endpoint'
    });
    
    console.log(`✅ Created new webhook endpoint for: ${webhookUrl}`);
    console.log(`Webhook secret: ${webhook.secret} (please add this to your .env file as STRIPE_WEBHOOK_SECRET)`);
  } catch (error) {
    console.error('❌ Error setting up Stripe webhook:', error);
    process.exit(1);
  }
}

// Run the setup
setupStripeWebhook();