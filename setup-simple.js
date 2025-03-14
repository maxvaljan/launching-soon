// setup-simple.js
// A simple approach to set up Stripe Connect in Supabase

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function setupSimple() {
  console.log('Setting up Stripe Connect in Supabase (simple approach)');
  
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env file');
    process.exit(1);
  }
  
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  try {
    // 1. Check if api_keys table exists and create it if not
    console.log('Setting up api_keys table...');
    const { error: apiKeysError } = await supabase
      .from('api_keys')
      .select('*')
      .limit(1);
      
    if (apiKeysError && apiKeysError.code === '42P01') {
      console.log('Creating api_keys table...');
      // Create the table using REST API
      const response = await fetch(`${process.env.SUPABASE_URL}/rest/sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
        },
        body: JSON.stringify({
          query: `
            CREATE TABLE IF NOT EXISTS api_keys (
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              key_name VARCHAR(255) NOT NULL UNIQUE,
              key_value TEXT NOT NULL,
              description TEXT,
              is_active BOOLEAN DEFAULT TRUE,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
          `
        })
      });
      
      if (!response.ok) {
        console.error('Error creating api_keys table:', await response.text());
      } else {
        console.log('✅ api_keys table created');
      }
    } else {
      console.log('✅ api_keys table already exists');
    }
    
    // 2. Add Stripe settings to api_keys table
    console.log('Adding Stripe settings to api_keys table...');
    const { error: insertError } = await supabase
      .from('api_keys')
      .upsert([
        {
          key_name: 'stripe_premium_driver_product_name',
          key_value: 'MaxMove Premium Driver Subscription',
          description: 'Product name for premium driver subscription'
        },
        {
          key_name: 'stripe_premium_driver_product_description',
          key_value: 'Reduced platform fee (5% instead of 15%) and priority matching',
          description: 'Product description for premium driver subscription'
        },
        {
          key_name: 'stripe_premium_driver_price_amount',
          key_value: '9900',
          description: 'Price in cents for premium driver subscription (€99)'
        },
        {
          key_name: 'stripe_premium_driver_price_interval',
          key_value: 'month',
          description: 'Billing interval for premium driver subscription'
        }
      ], { onConflict: 'key_name' });
      
    if (insertError) {
      console.error('Error adding Stripe settings to api_keys:', insertError);
    } else {
      console.log('✅ Stripe settings added to api_keys table');
    }
    
    console.log('Running setup-stripe-subscription.js to create the subscription product in Stripe...');
    require('./setup-stripe-subscription');
    
    console.log('All done!');
  } catch (error) {
    console.error('Error in setup:', error);
  }
}

setupSimple();