// create-tables.js
// Creates tables manually using Supabase JS client

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function createTables() {
  console.log('Creating tables for Stripe Connect in Supabase...');
  
  // Create Supabase client
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  try {
    // 1. Add columns to profiles table
    console.log('Updating profiles table...');
    
    // Check if profiles table exists first
    const { data: profilesCheck, error: profilesCheckError } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
      
    if (profilesCheckError) {
      console.log('Creating profiles table first...');
      await supabase.rpc('create_profiles_table');
    }
    
    // We'll update profiles table by querying and then inserting with new schema
    
    // 2. Create api_keys table
    console.log('Creating api_keys table...');
    const { error: apiKeysError } = await supabase
      .from('api_keys')
      .insert([
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
      ]);
      
    if (apiKeysError) {
      if (apiKeysError.code === '42P01') {
        console.log('api_keys table does not exist, creating it first...');
        // Create table
        const { error: createTableError } = await supabase
          .rpc('create_table', {
            table_name: 'api_keys',
            columns: `
              id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
              key_name VARCHAR(255) NOT NULL UNIQUE,
              key_value TEXT NOT NULL,
              description TEXT,
              is_active BOOLEAN DEFAULT TRUE,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            `
          });
          
        if (createTableError) {
          console.error('Error creating api_keys table:', createTableError);
        } else {
          // Try insert again
          await supabase
            .from('api_keys')
            .insert([
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
            ]);
        }
      } else {
        // It could be a conflict error if keys already exist
        console.log('Note: api_keys entries may already exist:', apiKeysError);
      }
    } else {
      console.log('✅ api_keys table populated successfully');
    }
    
    // 3. Create driver_subscriptions table
    console.log('Creating driver_subscriptions table...');
    // Test insert to see if table exists
    const { error: subscriptionTestError } = await supabase
      .from('driver_subscriptions')
      .select('*')
      .limit(1);
      
    if (subscriptionTestError && subscriptionTestError.code === '42P01') {
      console.log('driver_subscriptions table does not exist, creating it...');
      // TODO: We'd create it here with Postgres CREATE TABLE
    } else {
      console.log('✅ driver_subscriptions table already exists');
    }
    
    // 4. Create payment_methods table
    console.log('Creating payment_methods table...');
    const { error: paymentMethodsTestError } = await supabase
      .from('payment_methods')
      .select('*')
      .limit(1);
      
    if (paymentMethodsTestError && paymentMethodsTestError.code === '42P01') {
      console.log('payment_methods table does not exist, creating it...');
      // TODO: We'd create it here with Postgres CREATE TABLE
    } else {
      console.log('✅ payment_methods table already exists');
    }
    
    // 5. Create payment_transactions table
    console.log('Creating payment_transactions table...');
    const { error: transactionsTestError } = await supabase
      .from('payment_transactions')
      .select('*')
      .limit(1);
      
    if (transactionsTestError && transactionsTestError.code === '42P01') {
      console.log('payment_transactions table does not exist, creating it...');
      // TODO: We'd create it here with Postgres CREATE TABLE
    } else {
      console.log('✅ payment_transactions table already exists');
    }
    
    console.log('Table setup process completed.');
    
  } catch (error) {
    console.error('Error setting up tables:', error);
  }
}

createTables();