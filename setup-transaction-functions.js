const { createClient } = require('@supabase/supabase-js');
const fetch = require('node-fetch');
require('dotenv').config();

// Validate environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Error: Missing Supabase credentials. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in your .env file.');
  process.exit(1);
}

// Create Supabase client with service role key
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// SQL to create transaction support functions
const createTransactionFunctions = `
-- Function to begin a transaction and return a transaction ID
CREATE OR REPLACE FUNCTION begin_transaction()
RETURNS json AS $$
DECLARE
  tx_id UUID;
BEGIN
  tx_id := gen_random_uuid();
  -- Store transaction ID in a temporary table
  CREATE TEMP TABLE IF NOT EXISTS active_transactions (
    id UUID PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now()
  );
  
  INSERT INTO active_transactions (id) VALUES (tx_id);
  RETURN json_build_object('transaction_id', tx_id);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to commit a transaction
CREATE OR REPLACE FUNCTION commit_transaction(tx_id UUID)
RETURNS void AS $$
BEGIN
  -- Check if transaction exists
  IF NOT EXISTS (SELECT 1 FROM active_transactions WHERE id = tx_id) THEN
    RAISE EXCEPTION 'Transaction % not found', tx_id;
  END IF;
  
  -- Remove transaction from active transactions
  DELETE FROM active_transactions WHERE id = tx_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to rollback a transaction
CREATE OR REPLACE FUNCTION rollback_transaction(tx_id UUID)
RETURNS void AS $$
BEGIN
  -- Check if transaction exists
  IF NOT EXISTS (SELECT 1 FROM active_transactions WHERE id = tx_id) THEN
    RAISE EXCEPTION 'Transaction % not found', tx_id;
  END IF;
  
  -- Remove transaction from active transactions
  DELETE FROM active_transactions WHERE id = tx_id;
  -- Explicit rollback
  RAISE EXCEPTION 'Transaction % rolled back', tx_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to execute an INSERT within a transaction
CREATE OR REPLACE FUNCTION tx_insert(tx_id UUID, p_table TEXT, p_records JSONB)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
  query TEXT;
BEGIN
  -- Check if transaction exists
  IF NOT EXISTS (SELECT 1 FROM active_transactions WHERE id = tx_id) THEN
    RAISE EXCEPTION 'Transaction % not found', tx_id;
  END IF;
  
  -- Build and execute dynamic query
  query := format('INSERT INTO %I SELECT * FROM jsonb_populate_recordset(null::%I, $1) RETURNING to_jsonb(%I.*)', 
                  p_table, p_table, p_table);
  EXECUTE query INTO result USING p_records;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to execute an UPDATE within a transaction
CREATE OR REPLACE FUNCTION tx_update(tx_id UUID, p_table TEXT, p_updates JSONB, p_conditions JSONB)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
  query TEXT;
  set_clause TEXT := '';
  where_clause TEXT := '';
  col_name TEXT;
  col_value JSONB;
  first_set BOOLEAN := TRUE;
  first_where BOOLEAN := TRUE;
BEGIN
  -- Check if transaction exists
  IF NOT EXISTS (SELECT 1 FROM active_transactions WHERE id = tx_id) THEN
    RAISE EXCEPTION 'Transaction % not found', tx_id;
  END IF;
  
  -- Build SET clause
  FOR col_name, col_value IN SELECT * FROM jsonb_each(p_updates) LOOP
    IF NOT first_set THEN
      set_clause := set_clause || ', ';
    END IF;
    set_clause := set_clause || format('%I = $1->%L', col_name, col_name);
    first_set := FALSE;
  END LOOP;
  
  -- Build WHERE clause
  FOR col_name, col_value IN SELECT * FROM jsonb_each(p_conditions) LOOP
    IF NOT first_where THEN
      where_clause := where_clause || ' AND ';
    END IF;
    where_clause := where_clause || format('%I = $2->%L', col_name, col_name);
    first_where := FALSE;
  END LOOP;
  
  -- Build and execute dynamic query
  query := format('UPDATE %I SET %s WHERE %s RETURNING to_jsonb(%I.*)', 
                  p_table, set_clause, where_clause, p_table);
  EXECUTE query INTO result USING p_updates, p_conditions;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to execute a DELETE within a transaction
CREATE OR REPLACE FUNCTION tx_delete(tx_id UUID, p_table TEXT, p_conditions JSONB)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
  query TEXT;
  where_clause TEXT := '';
  col_name TEXT;
  col_value JSONB;
  first_where BOOLEAN := TRUE;
BEGIN
  -- Check if transaction exists
  IF NOT EXISTS (SELECT 1 FROM active_transactions WHERE id = tx_id) THEN
    RAISE EXCEPTION 'Transaction % not found', tx_id;
  END IF;
  
  -- Build WHERE clause
  FOR col_name, col_value IN SELECT * FROM jsonb_each(p_conditions) LOOP
    IF NOT first_where THEN
      where_clause := where_clause || ' AND ';
    END IF;
    where_clause := where_clause || format('%I = $1->%L', col_name, col_name);
    first_where := FALSE;
  END LOOP;
  
  -- Build and execute dynamic query
  query := format('DELETE FROM %I WHERE %s RETURNING to_jsonb(%I.*)', 
                  p_table, where_clause, p_table);
  EXECUTE query INTO result USING p_conditions;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to execute a SELECT within a transaction
CREATE OR REPLACE FUNCTION tx_select(tx_id UUID, p_table TEXT, p_columns TEXT[], p_conditions JSONB)
RETURNS JSONB AS $$
DECLARE
  result JSONB;
  query TEXT;
  columns_clause TEXT;
  where_clause TEXT := '';
  col_name TEXT;
  col_value JSONB;
  first_where BOOLEAN := TRUE;
BEGIN
  -- Check if transaction exists
  IF NOT EXISTS (SELECT 1 FROM active_transactions WHERE id = tx_id) THEN
    RAISE EXCEPTION 'Transaction % not found', tx_id;
  END IF;
  
  -- Build columns clause
  IF p_columns IS NULL OR array_length(p_columns, 1) = 0 THEN
    columns_clause := '*';
  ELSE
    columns_clause := array_to_string(p_columns, ', ');
  END IF;
  
  -- Build WHERE clause if conditions provided
  IF p_conditions IS NOT NULL AND jsonb_typeof(p_conditions) = 'object' THEN
    FOR col_name, col_value IN SELECT * FROM jsonb_each(p_conditions) LOOP
      IF NOT first_where THEN
        where_clause := where_clause || ' AND ';
      END IF;
      where_clause := where_clause || format('%I = $1->%L', col_name, col_name);
      first_where := FALSE;
    END LOOP;
  END IF;
  
  -- Build and execute dynamic query
  IF where_clause <> '' THEN
    query := format('SELECT jsonb_agg(row_to_json(t)) FROM (SELECT %s FROM %I WHERE %s) t', 
                    columns_clause, p_table, where_clause);
    EXECUTE query INTO result USING p_conditions;
  ELSE
    query := format('SELECT jsonb_agg(row_to_json(t)) FROM (SELECT %s FROM %I) t', 
                    columns_clause, p_table);
    EXECUTE query INTO result;
  END IF;
  
  RETURN result;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
`;

// Create exec_sql function if it doesn't exist
const createExecSqlFunction = `
CREATE OR REPLACE FUNCTION exec_sql(sql_query TEXT)
RETURNS void AS $$
BEGIN
  EXECUTE sql_query;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
`;

// Main function to create transaction functions
async function createDatabaseFunctions() {
  console.log('Setting up transaction support functions in Supabase...');
  
  try {
    // First, try to execute a simple query to see if exec_sql exists
    const testResponse = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({ sql_query: 'SELECT 1;' })
    });
    
    // If exec_sql doesn't exist, create it
    if (!testResponse.ok) {
      console.log('Creating exec_sql function...');
      
      // Use REST API to create the function
      const createFunctionResponse = await fetch(`${process.env.SUPABASE_URL}/rest/v1/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
          'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          'Prefer': 'resolution=merge-duplicates'
        },
        body: JSON.stringify({
          query: createExecSqlFunction
        })
      });
      
      if (!createFunctionResponse.ok) {
        const errorText = await createFunctionResponse.text();
        console.error('Error creating exec_sql function:', errorText);
        console.error('You may need to create this function manually via the Supabase dashboard SQL editor.');
        return;
      }
      
      console.log('✅ exec_sql function created successfully');
    }
    
    // Now use exec_sql to create transaction functions
    console.log('Creating transaction functions...');
    const response = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({ sql_query: createTransactionFunctions })
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error creating transaction functions:', errorText);
      return;
    }
    
    console.log('✅ Transaction support functions created successfully!');
    
    // Add an index to payment_transactions table for faster lookups
    console.log('Adding index to payment_transactions table...');
    const indexResponse = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY,
        'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`
      },
      body: JSON.stringify({ 
        sql_query: `
          -- Create index on payment_transactions.stripe_payment_intent_id
          DROP INDEX IF EXISTS idx_payment_transactions_payment_intent;
          CREATE INDEX idx_payment_transactions_payment_intent ON payment_transactions(stripe_payment_intent_id);
          
          -- Create index on payment_transactions.order_id
          DROP INDEX IF EXISTS idx_payment_transactions_order_id;
          CREATE INDEX idx_payment_transactions_order_id ON payment_transactions(order_id);
          
          -- Create index on orders for customer and driver
          DROP INDEX IF EXISTS idx_orders_customer_id;
          CREATE INDEX idx_orders_customer_id ON orders(customer_id);
          
          DROP INDEX IF EXISTS idx_orders_driver_id;
          CREATE INDEX idx_orders_driver_id ON orders(driver_id);
        `
      })
    });
    
    if (!indexResponse.ok) {
      const errorText = await indexResponse.text();
      console.error('Note: Could not create indexes. This is okay if tables don\'t exist yet:', errorText);
    } else {
      console.log('✅ Indexes created successfully');
    }
  } catch (error) {
    console.error('Error setting up database functions:', error);
  }
}

// Run the script
createDatabaseFunctions().then(() => {
  console.log('Database setup completed');
});