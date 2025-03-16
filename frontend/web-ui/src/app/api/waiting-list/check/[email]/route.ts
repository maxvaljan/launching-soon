import { NextRequest, NextResponse } from 'next/server';

// Get API URL from environment variable, default to localhost
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

export async function GET(
  request: NextRequest,
  { params }: { params: { email: string } }
) {
  try {
    const email = params.email;
    
    if (!email) {
      return NextResponse.json(
        { message: 'Email parameter is required' },
        { status: 400 }
      );
    }

    const response = await fetch(
      `${API_BASE_URL}/api/waiting-list/check/${encodeURIComponent(email)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );

    const data = await response.json();
    
    return NextResponse.json(data, {
      status: response.status,
    });
  } catch (error) {
    console.error('Error checking email in waiting list:', error);
    return NextResponse.json(
      { message: 'Internal server error', error: 'Failed to process request' },
      { status: 500 }
    );
  }
}