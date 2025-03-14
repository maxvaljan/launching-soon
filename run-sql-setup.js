// run-sql-setup.js
// This script runs the SQL setup directly

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
require('dotenv').config();

async function runSqlSetup() {
  console.log('Running SQL setup for Stripe Connect...');
  
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
    // Read the SQL file
    console.log('Reading SQL file...');
    const sqlContent = fs.readFileSync('./backend/setup-stripe-connect.sql', 'utf8');
    
    // Split the SQL into statements
    const sqlStatements = sqlContent.split(';').filter(stmt => stmt.trim() !== '');
    
    // Execute each statement
    console.log(`Found ${sqlStatements.length} SQL statements to execute...`);
    for (let i = 0; i < sqlStatements.length; i++) {
      const stmt = sqlStatements[i].trim() + ';';
      console.log(`Executing statement ${i+1}/${sqlStatements.length}`);
      
      const { error } = await supabase.rpc('exec_sql', { sql: stmt });
      if (error) {
        console.error(`Error executing statement ${i+1}:`, error);
        console.error('Statement:', stmt);
      }
    }
    
    console.log('✅ SQL setup completed successfully!');
  } catch (error) {
    console.error('❌ Error running SQL setup:', error);
    process.exit(1);
  }
}

// Run the setup
runSqlSetup();