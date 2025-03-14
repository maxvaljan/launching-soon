// setup-stripe-connect.js
// This script will set up the Stripe Connect tables in Supabase

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

async function setupStripeConnect() {
  console.log('Setting up Stripe Connect tables in Supabase...');
  
  // Validate environment variables
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env file');
    process.exit(1);
  }
  
  // Create Supabase client with service role key for admin privileges
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  
  try {
    // Add Stripe Connect fields to profiles table
    console.log('Adding Stripe Connect fields to profiles table...');
    const { error: profilesError } = await supabase.rpc('alter_table_add_column_if_not_exists', {
      table_name: 'profiles',
      column_name: 'stripe_customer_id',
      column_type: 'VARCHAR(255)'
    });
    if (profilesError) throw profilesError;
    
    const { error: profilesError2 } = await supabase.rpc('alter_table_add_column_if_not_exists', {
      table_name: 'profiles',
      column_name: 'stripe_account_id',
      column_type: 'VARCHAR(255)'
    });
    if (profilesError2) throw profilesError2;
    
    const { error: profilesError3 } = await supabase.rpc('alter_table_add_column_if_not_exists', {
      table_name: 'profiles',
      column_name: 'stripe_account_status',
      column_type: 'VARCHAR(50)'
    });
    if (profilesError3) throw profilesError3;
    
    const { error: profilesError4 } = await supabase.rpc('alter_table_add_column_if_not_exists', {
      table_name: 'profiles',
      column_name: 'stripe_onboarding_completed',
      column_type: 'BOOLEAN DEFAULT FALSE'
    });
    if (profilesError4) throw profilesError4;
    
    // Create tables using raw SQL (executed via function)
    console.log('Creating api_keys table if it doesn\'t exist...');
    const { error: createApiKeysError } = await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS api_keys (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          key_name VARCHAR(255) NOT NULL UNIQUE,
          key_value TEXT NOT NULL,
          description TEXT,
          is_active BOOLEAN DEFAULT TRUE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
        
        -- Store product and price information for the subscription
        INSERT INTO api_keys (key_name, key_value, description) 
        VALUES 
        ('stripe_premium_driver_product_name', 'MaxMove Premium Driver Subscription', 'Product name for premium driver subscription'),
        ('stripe_premium_driver_product_description', 'Reduced platform fee (5% instead of 15%) and priority matching', 'Product description for premium driver subscription'),
        ('stripe_premium_driver_price_amount', '9900', 'Price in cents for premium driver subscription (€99)'),
        ('stripe_premium_driver_price_interval', 'month', 'Billing interval for premium driver subscription')
        ON CONFLICT (key_name) DO NOTHING;
      `
    });
    if (createApiKeysError) throw createApiKeysError;
    
    console.log('Creating driver_subscriptions table if it doesn\'t exist...');
    const { error: createSubsError } = await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS driver_subscriptions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          driver_id UUID REFERENCES profiles(id) NOT NULL,
          is_premium BOOLEAN DEFAULT FALSE,
          subscription_id VARCHAR(255),
          status VARCHAR(50) NOT NULL,
          current_period_start TIMESTAMP WITH TIME ZONE,
          current_period_end TIMESTAMP WITH TIME ZONE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    if (createSubsError) throw createSubsError;
    
    console.log('Creating payment_methods table if it doesn\'t exist...');
    const { error: createPaymentMethodsError } = await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS payment_methods (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          user_id UUID REFERENCES profiles(id) NOT NULL,
          stripe_payment_method_id VARCHAR(255) NOT NULL,
          type VARCHAR(50) NOT NULL,
          last_four VARCHAR(4),
          is_default BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    if (createPaymentMethodsError) throw createPaymentMethodsError;
    
    console.log('Creating payment_transactions table if it doesn\'t exist...');
    const { error: createTransactionsError } = await supabase.rpc('execute_sql', {
      sql_query: `
        CREATE TABLE IF NOT EXISTS payment_transactions (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          order_id UUID REFERENCES orders(id) NOT NULL,
          customer_id UUID REFERENCES profiles(id) NOT NULL,
          driver_id UUID REFERENCES profiles(id),
          amount INTEGER NOT NULL,
          platform_fee INTEGER NOT NULL,
          driver_fee INTEGER NOT NULL,
          tip_amount INTEGER DEFAULT 0,
          payment_method VARCHAR(50) NOT NULL,
          payment_status VARCHAR(50) NOT NULL,
          stripe_payment_intent_id VARCHAR(255),
          is_cash BOOLEAN DEFAULT FALSE,
          cash_fee_paid BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
          updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
        );
      `
    });
    if (createTransactionsError) throw createTransactionsError;
    
    // Setup RLS policies
    console.log('Setting up Row Level Security (RLS) policies...');
    const { error: rlsError } = await supabase.rpc('execute_sql', {
      sql_query: `
        -- Driver Subscriptions policies
        ALTER TABLE driver_subscriptions ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY IF NOT EXISTS "Drivers can view their own subscriptions"
        ON driver_subscriptions
        FOR SELECT
        USING (auth.uid() = driver_id);
        
        CREATE POLICY IF NOT EXISTS "Admins can view all subscriptions"
        ON driver_subscriptions
        FOR ALL
        USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
        
        -- Payment Methods policies
        ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY IF NOT EXISTS "Users can view and manage their payment methods"
        ON payment_methods
        FOR ALL
        USING (auth.uid() = user_id);
        
        CREATE POLICY IF NOT EXISTS "Admins can view all payment methods"
        ON payment_methods
        FOR SELECT
        USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
        
        -- Payment Transactions policies
        ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;
        
        CREATE POLICY IF NOT EXISTS "Customers can view their transactions"
        ON payment_transactions
        FOR SELECT
        USING (auth.uid() = customer_id);
        
        CREATE POLICY IF NOT EXISTS "Drivers can view their transactions"
        ON payment_transactions
        FOR SELECT
        USING (auth.uid() = driver_id);
        
        CREATE POLICY IF NOT EXISTS "Admins can view and manage all transactions"
        ON payment_transactions
        FOR ALL
        USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));
      `
    });
    if (rlsError) throw rlsError;
    
    // Setup timestamp triggers
    console.log('Setting up timestamp update triggers...');
    const { error: triggersError } = await supabase.rpc('execute_sql', {
      sql_query: `
        -- Create functions to update timestamps
        CREATE OR REPLACE FUNCTION update_driver_subscriptions_modified_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
        
        DROP TRIGGER IF EXISTS update_driver_subscriptions_modified_timestamp ON driver_subscriptions;
        CREATE TRIGGER update_driver_subscriptions_modified_timestamp
        BEFORE UPDATE ON driver_subscriptions
        FOR EACH ROW
        EXECUTE FUNCTION update_driver_subscriptions_modified_column();
        
        CREATE OR REPLACE FUNCTION update_payment_transactions_modified_column()
        RETURNS TRIGGER AS $$
        BEGIN
            NEW.updated_at = NOW();
            RETURN NEW;
        END;
        $$ LANGUAGE plpgsql;
        
        DROP TRIGGER IF EXISTS update_payment_transactions_modified_timestamp ON payment_transactions;
        CREATE TRIGGER update_payment_transactions_modified_timestamp
        BEFORE UPDATE ON payment_transactions
        FOR EACH ROW
        EXECUTE FUNCTION update_payment_transactions_modified_column();
      `
    });
    if (triggersError) throw triggersError;
    
    // Add table comments
    console.log('Adding table comments...');
    const { error: commentsError } = await supabase.rpc('execute_sql', {
      sql_query: `
        COMMENT ON TABLE driver_subscriptions IS 'Stores information about premium driver subscriptions';
        COMMENT ON TABLE payment_methods IS 'Stores user payment methods from Stripe';
        COMMENT ON TABLE payment_transactions IS 'Stores all payment transactions including fees and tips';
      `
    });
    if (commentsError) throw commentsError;
    
    console.log('✅ Stripe Connect tables setup complete!');
  } catch (error) {
    console.error('❌ Error setting up Stripe Connect tables:', error);
    process.exit(1);
  }
}

// Run the setup
setupStripeConnect();