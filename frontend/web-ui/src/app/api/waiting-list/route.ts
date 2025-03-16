import { NextRequest, NextResponse } from 'next/server';

// Get API URL from environment variable, default to localhost
// IMPORTANT: Make sure NEXT_PUBLIC_API_URL is set in your production environment
// For local development, we'll default to localhost:3001 which is the default backend port

// Helper function to ensure URL has protocol
const ensureUrlHasProtocol = (url: string): string => {
  if (!url) return 'http://localhost:3001';
  
  // If URL already has protocol, return as is
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  
  // Add https:// protocol by default
  return `https://${url}`;
};

// Get the base URL from environment and ensure it has a protocol
const API_BASE_URL = ensureUrlHasProtocol(process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001');

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log(`[API] Forwarding waiting list request to ${API_BASE_URL}/api/waiting-list`);
    console.log(`[API] Request body:`, JSON.stringify(body));
    
    // Validate required fields to prevent backend errors
    if (!body.email) {
      console.error('[API] Missing required field: email');
      return NextResponse.json(
        { 
          message: 'Missing required field', 
          error: 'Email is required'
        },
        { status: 400 }
      );
    }
    
    // Better error handling for network issues
    let response;
    try {
      response = await fetch(`${API_BASE_URL}/api/waiting-list`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
        // Add timeout to prevent hanging requests
        signal: AbortSignal.timeout(10000), // 10 second timeout
      });
    } catch (fetchError: any) {
      console.error(`[API] Network error connecting to backend: ${fetchError.message}`);
      
      // Check if it's a connection error, which might indicate API_BASE_URL is wrong
      if (fetchError.message && (
        fetchError.message.includes('ECONNREFUSED') || 
        fetchError.message.includes('fetch failed') ||
        fetchError.message.includes('network timeout')
      )) {
        return NextResponse.json(
          { 
            message: 'Could not connect to backend API', 
            error: 'Connection error',
            details: 'Backend service may be unavailable or API URL is incorrectly configured',
            apiBaseUrl: API_BASE_URL
          },
          { status: 503 }
        );
      }
      
      throw fetchError; // Re-throw to be caught by outer try/catch
    }

    // Log response status
    console.log(`[API] Backend response status: ${response.status}`);
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error(`[API] Non-JSON response received: ${contentType}`);
      
      // Attempt to get response text for diagnostics
      let responseText = '';
      try {
        responseText = await response.text();
        // Truncate if too long
        if (responseText.length > 200) {
          responseText = responseText.substring(0, 200) + '...';
        }
      } catch (textError) {
        responseText = 'Could not read response body';
      }
      
      return NextResponse.json(
        { 
          message: 'Backend returned non-JSON response', 
          error: `Expected JSON but got ${contentType}`,
          status: response.status,
          responseText
        },
        { status: 502 }
      );
    }

    const data = await response.json();
    console.log(`[API] Response data:`, JSON.stringify(data));
    
    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error: any) {
    console.error('Error forwarding waiting list request:', error);
    
    // Provide more detailed error information
    const errorMessage = error.message || 'Unknown error';
    const errorDetails = {
      message: 'Internal server error',
      error: errorMessage,
      details: 'Error occurred when forwarding request to backend API',
      apiBaseUrl: API_BASE_URL
    };
    
    console.error('[API] Error details:', JSON.stringify(errorDetails));
    
    return NextResponse.json(errorDetails, { status: 500 });
  }
}