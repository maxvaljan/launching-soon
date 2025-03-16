const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Initialize the Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be provided.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createWaitingListTable() {
  console.log('Creating waiting_list_emails table...');

  // SQL query to create the table
  const { error } = await supabase.rpc('create_waiting_list_table', {});

  if (error) {
    console.error('Error creating table:', error.message);
    return;
  }

  console.log('Successfully created waiting_list_emails table');
}

// Execute stored procedure to create the table
createWaitingListTable();