// test-api-keys.mjs
import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:3000'; // Default port from config

async function testApiKeys() {
  console.log('Testing API key endpoints...\n');
  
  // First test a known working endpoint to verify server connectivity
  try {
    console.log('GET /health (Testing server connectivity)');
    const healthResponse = await fetch(`${BASE_URL}/health`);
    const healthData = await healthResponse.json();
    
    if (healthResponse.ok) {
      console.log('✅ Server is reachable!');
      console.log('Response:', JSON.stringify(healthData, null, 2));
    } else {
      console.log('❌ Server error!');
      console.log('Status:', healthResponse.status);
      console.log('Response:', JSON.stringify(healthData, null, 2));
    }
  } catch (error) {
    console.log('❌ Cannot connect to server!');
    console.log('Error:', error.message);
    console.log('Make sure the server is running on http://localhost:3000');
    return;
  }
  
  console.log('\n' + '-'.repeat(50) + '\n');
  
  // Test Mapbox API key endpoint
  try {
    console.log('GET /api/api-keys/mapbox');
    const mapboxResponse = await fetch(`${BASE_URL}/api/api-keys/mapbox`);
    console.log('Status:', mapboxResponse.status);
    
    const mapboxData = await mapboxResponse.json();
    
    if (mapboxResponse.ok) {
      console.log('✅ Success!');
      console.log('Response:', JSON.stringify(mapboxData, null, 2));
    } else {
      console.log('❌ Error!');
      console.log('Response:', JSON.stringify(mapboxData, null, 2));
    }
  } catch (error) {
    console.log('❌ Request failed!');
    console.log('Error:', error.message);
  }
  
  console.log('\n' + '-'.repeat(50) + '\n');
  
  // Test Google Maps API key endpoint
  try {
    console.log('GET /api/api-keys/google-maps');
    const googleMapsResponse = await fetch(`${BASE_URL}/api/api-keys/google-maps`);
    console.log('Status:', googleMapsResponse.status);
    
    const googleMapsData = await googleMapsResponse.json();
    
    if (googleMapsResponse.ok) {
      console.log('✅ Success!');
      console.log('Response:', JSON.stringify(googleMapsData, null, 2));
    } else {
      console.log('❌ Error!');
      console.log('Response:', JSON.stringify(googleMapsData, null, 2));
    }
  } catch (error) {
    console.log('❌ Request failed!');
    console.log('Error:', error.message);
  }
}

// Run the tests
testApiKeys().catch(error => {
  console.error('Test failed with error:', error);
  process.exit(1);
});