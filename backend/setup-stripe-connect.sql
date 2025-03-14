-- setup-stripe-connect.sql
-- SQL script to set up Stripe Connect tables in Supabase

-- Add Stripe Connect fields to profiles table
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS stripe_customer_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS stripe_account_id VARCHAR(255),
ADD COLUMN IF NOT EXISTS stripe_account_status VARCHAR(50),
ADD COLUMN IF NOT EXISTS stripe_onboarding_completed BOOLEAN DEFAULT FALSE;

-- Create api_keys table if it doesn't exist
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

-- Create driver_subscription table
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

-- Create payment_methods table
CREATE TABLE IF NOT EXISTS payment_methods (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  stripe_payment_method_id VARCHAR(255) NOT NULL,
  type VARCHAR(50) NOT NULL,
  last_four VARCHAR(4),
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create payment_transactions table
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

-- Create RLS policies

-- Driver Subscriptions policies
ALTER TABLE driver_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Drivers can view their own subscriptions"
ON driver_subscriptions
FOR SELECT
USING (auth.uid() = driver_id);

CREATE POLICY "Admins can view all subscriptions"
ON driver_subscriptions
FOR ALL
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Payment Methods policies
ALTER TABLE payment_methods ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view and manage their payment methods"
ON payment_methods
FOR ALL
USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all payment methods"
ON payment_methods
FOR SELECT
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Payment Transactions policies
ALTER TABLE payment_transactions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Customers can view their transactions"
ON payment_transactions
FOR SELECT
USING (auth.uid() = customer_id);

CREATE POLICY "Drivers can view their transactions"
ON payment_transactions
FOR SELECT
USING (auth.uid() = driver_id);

CREATE POLICY "Admins can view and manage all transactions"
ON payment_transactions
FOR ALL
USING (EXISTS (SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'));

-- Create functions to update timestamps
CREATE OR REPLACE FUNCTION update_driver_subscriptions_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

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

CREATE TRIGGER update_payment_transactions_modified_timestamp
BEFORE UPDATE ON payment_transactions
FOR EACH ROW
EXECUTE FUNCTION update_payment_transactions_modified_column();

-- Add comments for documentation
COMMENT ON TABLE driver_subscriptions IS 'Stores information about premium driver subscriptions';
COMMENT ON TABLE payment_methods IS 'Stores user payment methods from Stripe';
COMMENT ON TABLE payment_transactions IS 'Stores all payment transactions including fees and tips';