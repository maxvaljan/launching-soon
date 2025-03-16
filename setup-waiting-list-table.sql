-- SQL script to create waiting_list_emails table
-- This should be executed in the Supabase SQL editor

-- Create the function to create waiting list table
CREATE OR REPLACE FUNCTION create_waiting_list_table()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  -- Create waiting_list_emails table if it doesn't exist
  CREATE TABLE IF NOT EXISTS waiting_list_emails (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    source TEXT NOT NULL,
    utm_source TEXT,
    referral_code UUID DEFAULT uuid_generate_v4(),
    referrer_id UUID REFERENCES waiting_list_emails(id),
    referral_count INTEGER DEFAULT 0
  );

  -- Create index on email for faster lookups
  CREATE INDEX IF NOT EXISTS idx_waiting_list_emails_email ON waiting_list_emails(email);

  -- Create index on referral_code for faster lookups
  CREATE INDEX IF NOT EXISTS idx_waiting_list_emails_referral_code ON waiting_list_emails(referral_code);
END;
$$;

-- Create the increment_counter RPC function
CREATE OR REPLACE FUNCTION increment_counter(row_id UUID)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  current_count INTEGER;
BEGIN
  -- Get the current count
  SELECT referral_count INTO current_count
  FROM waiting_list_emails
  WHERE id = row_id;
  
  -- Return incremented count
  RETURN COALESCE(current_count, 0) + 1;
END;
$$;