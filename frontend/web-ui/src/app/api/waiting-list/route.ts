import { NextRequest, NextResponse } from 'next/server';

// Get API URL from environment variable, default to localhost
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    console.log(`[API] Forwarding waiting list request to ${API_BASE_URL}/api/waiting-list`);
    console.log(`[API] Request body:`, JSON.stringify(body));
    
    const response = await fetch(`${API_BASE_URL}/api/waiting-list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    // Log response status
    console.log(`[API] Backend response status: ${response.status}`);
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error(`[API] Non-JSON response received: ${contentType}`);
      return NextResponse.json(
        { 
          message: 'Backend returned non-JSON response', 
          error: `Expected JSON but got ${contentType}`,
          status: response.status
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