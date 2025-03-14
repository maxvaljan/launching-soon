import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

/**
 * Health check endpoint for monitoring and deployment
 * Returns:
 * - status: Overall status of the application
 * - database: Database connection status
 * - uptime: Server uptime in seconds
 * - timestamp: Current server time
 * - version: Application version
 * - environment: Current deployment environment
 */
export async function GET(request: NextRequest) {
  // Track start time to measure response time
  const startTime = Date.now();
  
  // Server information
  const serverStartTime = process.uptime();
  const environment = process.env.NEXT_PUBLIC_DEPLOYMENT_ENVIRONMENT || 'development';
  
  // Initialize response object
  const healthStatus = {
    status: 'healthy',
    database: false,
    uptime: Math.floor(serverStartTime),
    timestamp: new Date().toISOString(),
    version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
    environment,
    nodeVersion: process.version,
    responseTime: 0,
  };
  
  try {
    // Check database connection
    const { data, error } = await supabase.from('health_checks').select('*').limit(1);
    
    if (error) {
      healthStatus.database = false;
      healthStatus.status = 'degraded';
      console.error('Health check database error:', error.message);
    } else {
      healthStatus.database = true;
    }
  } catch (error) {
    healthStatus.database = false;
    healthStatus.status = 'degraded';
    console.error('Health check exception:', error);
  }
  
  // Calculate response time
  healthStatus.responseTime = Date.now() - startTime;
  
  // Return health information with appropriate status code
  return NextResponse.json(
    healthStatus,
    { 
      status: healthStatus.status === 'healthy' ? 200 : 503,
      headers: {
        'Cache-Control': 'no-store, max-age=0',
      }
    }
  );
}

/**
 * Basic health check endpoint for simple monitoring services
 * Returns plain text OK for simple checks
 */
export async function HEAD(request: NextRequest) {
  return new NextResponse('OK', {
    status: 200,
    headers: {
      'Content-Type': 'text/plain',
      'Cache-Control': 'no-store, max-age=0',
    },
  });
}