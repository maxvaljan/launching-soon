-- setup-api-keys-table.sql
-- SQL script to create the api_keys table in Supabase with sample data

-- Create the api_keys table
CREATE TABLE IF NOT EXISTS api_keys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    key_name VARCHAR(255) NOT NULL UNIQUE,
    key_value TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create an index on key_name for faster lookups
CREATE INDEX IF NOT EXISTS idx_api_keys_key_name ON api_keys(key_name);

-- Add RLS (Row Level Security) policies
ALTER TABLE api_keys ENABLE ROW LEVEL SECURITY;

-- Policy to allow only authenticated users to read API keys
CREATE POLICY "Allow authenticated users to read API keys" 
ON api_keys
FOR SELECT 
USING (auth.role() = 'authenticated');

-- Policy to allow only admins to modify API keys
CREATE POLICY "Allow admins to modify API keys" 
ON api_keys
USING (auth.role() = 'service_role');

-- Insert sample API keys for testing
INSERT INTO api_keys (key_name, key_value, description) 
VALUES 
('mapbox_public_token', 'pk.sample_mapbox_test_key_12345', 'Public token for Mapbox maps integration')
ON CONFLICT (key_name) DO NOTHING;

INSERT INTO api_keys (key_name, key_value, description) 
VALUES 
('google_maps_api_key', 'AIzaSample_google_maps_test_key_12345', 'API key for Google Maps services')
ON CONFLICT (key_name) DO NOTHING;

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_api_keys_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger to automatically update the updated_at timestamp
CREATE TRIGGER update_api_keys_modified_timestamp
BEFORE UPDATE ON api_keys
FOR EACH ROW
EXECUTE FUNCTION update_api_keys_modified_column();

-- Add a comment to the table for documentation
COMMENT ON TABLE api_keys IS 'Stores external API keys used by the application';