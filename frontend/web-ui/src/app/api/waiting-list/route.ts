import { NextRequest, NextResponse } from 'next/server';

// Get API URL from environment variable, default to localhost
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    const response = await fetch(`${API_BASE_URL}/api/waiting-list`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error('Error forwarding waiting list request:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: 'Failed to process request' },
      { status: 500 }
    );
  }
}