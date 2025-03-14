// setup-api-keys-direct.js
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Supabase credentials not found in environment variables');
  process.exit(1);
}

// Initialize Supabase client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Simpler approach - just insert the required keys
async function setupApiKeys() {
  try {
    console.log('Checking and setting up subscription data...');
    
    // Check if the api_keys table exists
    const { data: tableExists, error: tableCheckError } = await supabase
      .from('api_keys')
      .select('count(*)')
      .limit(1);
      
    if (tableCheckError && tableCheckError.code !== 'PGRST116') {
      console.error('Error checking api_keys table:', tableCheckError);
      
      if (tableCheckError.code === 'PGRST307') {
        console.log('api_keys table does not exist. Please run the SQL script to create it first.');
        return;
      }
    }
    
    // Insert the keys one by one directly
    const requiredKeys = [
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
    ];
    
    for (const key of requiredKeys) {
      const { data, error } = await supabase
        .from('api_keys')
        .upsert([key], { onConflict: 'key_name' });
      
      if (error) {
        console.error(`Error inserting ${key.key_name}:`, error);
      } else {
        console.log(`Successfully set up ${key.key_name}`);
      }
    }
    
    console.log('API keys setup complete');
  } catch (err) {
    console.error('Error setting up API keys:', err);
  }
}

setupApiKeys();