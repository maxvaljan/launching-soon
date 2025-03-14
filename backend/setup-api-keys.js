// setup-api-keys.js
// Script to set up necessary API keys in Supabase

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Supabase credentials not found in environment variables');
  process.exit(1);
}

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const setupApiKeys = async () => {
  try {
    console.log('Setting up API keys in Supabase...');

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

    // Check if api_keys table exists first
    const { error: tableError } = await supabase
      .from('api_keys')
      .select('id')
      .limit(1);
      
    if (tableError) {
      console.log('Creating api_keys table...');
      
      // Create the table if it doesn't exist
      const { error: createTableError } = await supabase.rpc('create_api_keys_table');
      
      if (createTableError) {
        console.error('Error creating api_keys table:', createTableError);
        
        // Alternative approach: use SQL query
        const { error: sqlError } = await supabase.rpc('execute_sql', { 
          sql: `
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
        });
        
        if (sqlError) {
          console.error('Error creating table with SQL:', sqlError);
          console.log('Please manually create the api_keys table in Supabase');
          return;
        }
      }
    }
    
    console.log('Inserting API keys...');
    
    // Insert all required keys at once with upsert
    const { error: upsertError } = await supabase
      .from('api_keys')
      .upsert(requiredKeys, { onConflict: 'key_name' });
      
    if (upsertError) {
      console.error('Error upserting API keys:', upsertError);
    } else {
      console.log('API keys inserted successfully');
    }

    console.log('API keys setup completed');
  } catch (err) {
    console.error('Setup failed:', err);
  }
};

setupApiKeys();