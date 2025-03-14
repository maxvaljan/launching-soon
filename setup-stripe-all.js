// setup-stripe-all.js
// This script sets up everything needed for Stripe Connect integration

require('dotenv').config();
const { spawn } = require('child_process');

console.log('MaxMove Stripe Connect - Complete Setup');
console.log('=====================================');
console.log('This script will set up all components needed for Stripe Connect:');
console.log('1. Create database tables and policies in Supabase');
console.log('2. Create subscription product and price in Stripe');
console.log('3. Set up webhook endpoint in Stripe');
console.log('\n');

// Function to run a script and return a promise
function runScript(scriptPath) {
  return new Promise((resolve, reject) => {
    const childProcess = spawn('node', [scriptPath], { stdio: 'inherit' });
    
    childProcess.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Script ${scriptPath} exited with code ${code}`));
      }
    });
    
    childProcess.on('error', (err) => {
      reject(err);
    });
  });
}

// Run all scripts in sequence
async function runAllScripts() {
  try {
    console.log('\n1. Setting up database tables...');
    await runScript('./setup-stripe-connect.js');
    
    console.log('\n2. Setting up subscription product...');
    await runScript('./setup-stripe-subscription.js');
    
    console.log('\n3. Setting up webhook endpoint...');
    await runScript('./setup-stripe-webhook.js');
    
    console.log('\n✅ All done! Your Stripe Connect integration is ready to use.');
    console.log('Make sure to update your .env file with any values displayed above.');
  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Check environment variables
if (!process.env.STRIPE_SECRET_KEY || !process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Error: Required environment variables are missing.');
  console.error('Please make sure the following variables are set in your .env file:');
  console.error('- STRIPE_SECRET_KEY');
  console.error('- SUPABASE_URL');
  console.error('- SUPABASE_SERVICE_ROLE_KEY');
  console.error('- BASE_URL (for webhook setup)');
  process.exit(1);
}

// Start the setup process
runAllScripts();