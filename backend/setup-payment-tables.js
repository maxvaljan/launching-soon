// setup-payment-tables.js
// Script to set up necessary payment tables in Supabase

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Supabase credentials not found in environment variables');
  process.exit(1);
}

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const setupTables = async () => {
  try {
    console.log('Setting up payment tables in Supabase...');

    // Run SQL from the file
    const sqlPath = path.join(__dirname, 'setup-stripe-connect.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    // Execute the SQL script
    const { error } = await supabase.rpc('pg_query', { query: sql });
    
    if (error) {
      console.error('Error executing SQL:', error);
      return;
    }

    // Insert required API keys if they don't exist
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

    console.log('Inserting API keys...');
    
    for (const key of requiredKeys) {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .eq('key_name', key.key_name)
        .single();
        
      if (error && error.code !== 'PGRST116') {
        console.error(`Error checking for key ${key.key_name}:`, error);
        continue;
      }
      
      if (!data) {
        const { error: insertError } = await supabase
          .from('api_keys')
          .insert([key]);
          
        if (insertError) {
          console.error(`Error inserting key ${key.key_name}:`, insertError);
        } else {
          console.log(`Created key: ${key.key_name}`);
        }
      } else {
        console.log(`Key already exists: ${key.key_name}`);
      }
    }

    console.log('Payment tables setup completed');
  } catch (err) {
    console.error('Setup failed:', err);
  }
};

setupTables();