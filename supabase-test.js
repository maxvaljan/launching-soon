// supabase-test.js
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Get Supabase URL and key from environment variables
// You'll need to provide these when running the script
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// Check if environment variables are available
if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Supabase credentials not found in environment variables');
  console.error('Please provide SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Initialize Supabase client with service role key for admin operations
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function listVehicleTypes() {
  try {
    console.log('🔍 Fetching vehicle types from Supabase...');
    
    // Query the vehicle_types table
    const { data, error } = await supabase
      .from('vehicle_types')
      .select('*');
    
    if (error) {
      console.error('❌ Error fetching vehicle types:', error);
      return;
    }
    
    console.log('✅ Successfully fetched vehicle types:');
    console.log(JSON.stringify(data, null, 2));
    
    // Show table structure
    console.log('\n📋 Vehicle types table structure:');
    if (data && data.length > 0) {
      const columns = Object.keys(data[0]);
      console.log(columns.join(', '));
    } else {
      console.log('No data available to determine structure');
    }
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

// Execute the function
listVehicleTypes(); 