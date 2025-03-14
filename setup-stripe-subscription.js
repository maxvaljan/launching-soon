// setup-stripe-subscription.js
// This script creates the subscription product and price in Stripe

const { Stripe } = require('stripe');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function setupSubscriptionProduct() {
  console.log('Setting up driver subscription product in Stripe...');
  
  // Validate environment variables
  if (!process.env.STRIPE_SECRET_KEY || !process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Error: STRIPE_SECRET_KEY, SUPABASE_URL, and SUPABASE_SERVICE_ROLE_KEY must be set in .env file');
    process.exit(1);
  }
  
  // Initialize Stripe client
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  
  // Initialize Supabase client
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  try {
    // Get product info from Supabase
    const { data: productNameData, error: productNameError } = await supabase
      .from('api_keys')
      .select('key_value')
      .eq('key_name', 'stripe_premium_driver_product_name')
      .single();
      
    if (productNameError) {
      console.error('Error fetching product name:', productNameError);
      process.exit(1);
    }
    
    const { data: productDescData, error: productDescError } = await supabase
      .from('api_keys')
      .select('key_value')
      .eq('key_name', 'stripe_premium_driver_product_description')
      .single();
      
    if (productDescError) {
      console.error('Error fetching product description:', productDescError);
      process.exit(1);
    }
    
    const { data: priceAmountData, error: priceAmountError } = await supabase
      .from('api_keys')
      .select('key_value')
      .eq('key_name', 'stripe_premium_driver_price_amount')
      .single();
      
    if (priceAmountError) {
      console.error('Error fetching price amount:', priceAmountError);
      process.exit(1);
    }
    
    const { data: priceIntervalData, error: priceIntervalError } = await supabase
      .from('api_keys')
      .select('key_value')
      .eq('key_name', 'stripe_premium_driver_price_interval')
      .single();
      
    if (priceIntervalError) {
      console.error('Error fetching price interval:', priceIntervalError);
      process.exit(1);
    }
    
    const productName = productNameData.key_value;
    const productDescription = productDescData.key_value;
    const priceAmount = parseInt(priceAmountData.key_value);
    const priceInterval = priceIntervalData.key_value;
    
    // Create or retrieve product
    let product;
    try {
      // Try to retrieve existing product by name
      const products = await stripe.products.list({ 
        limit: 100,
        active: true
      });
      product = products.data.find(p => p.name === productName);
      
      if (!product) {
        // Create new product if not found
        product = await stripe.products.create({
          name: productName,
          description: productDescription,
          metadata: {
            type: 'driver_subscription'
          }
        });
        console.log('✅ Created new subscription product:', product.id);
      } else {
        console.log('✅ Using existing subscription product:', product.id);
      }
    } catch (error) {
      console.error('❌ Error creating/retrieving subscription product:', error);
      process.exit(1);
    }
    
    // Create or retrieve price
    let price;
    try {
      // Try to retrieve existing price for this product
      const prices = await stripe.prices.list({ 
        product: product.id,
        limit: 100,
        active: true
      });
      
      price = prices.data.find(p => 
        p.recurring && 
        p.recurring.interval === priceInterval && 
        p.unit_amount === priceAmount
      );
      
      if (!price) {
        // Create new price if not found
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
        console.log('✅ Created new subscription price:', price.id);
      } else {
        console.log('✅ Using existing subscription price:', price.id);
      }
    } catch (error) {
      console.error('❌ Error creating/retrieving subscription price:', error);
      process.exit(1);
    }
    
    // Update price ID in Supabase
    const { error: updateError } = await supabase
      .from('api_keys')
      .upsert({
        key_name: 'stripe_premium_driver_price_id',
        key_value: price.id,
        description: 'Stripe price ID for premium driver subscription'
      }, {
        onConflict: 'key_name'
      });
      
    if (updateError) {
      console.error('❌ Error storing price ID in Supabase:', updateError);
      process.exit(1);
    }
    
    console.log(`✅ Subscription setup complete. Please add this to your .env file:

STRIPE_DRIVER_SUBSCRIPTION_PRICE_ID=${price.id}
`);
  } catch (error) {
    console.error('❌ Error setting up subscription product:', error);
    process.exit(1);
  }
}

// Run the setup
setupSubscriptionProduct();