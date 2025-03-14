// supabase-sql.js
// This script executes the necessary SQL in Supabase

require('dotenv').config();
const fs = require('fs');
const fetch = require('node-fetch');

async function executeSql() {
  console.log('Executing SQL in Supabase...');
  
  // Check environment variables
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Error: SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set in .env file');
    process.exit(1);
  }
  
  try {
    // Read the SQL file
    const sqlContent = fs.readFileSync('./backend/setup-stripe-connect.sql', 'utf8');
    
    // Execute SQL using Supabase REST API
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify({
        query: sqlContent
      })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Error executing SQL: ${response.status} ${response.statusText}`);
      console.error(errorText);
      process.exit(1);
    }
    
    const result = await response.json();
    console.log('SQL executed successfully:', result);
  } catch (error) {
    console.error('Error executing SQL:', error);
    process.exit(1);
  }
}

executeSql();