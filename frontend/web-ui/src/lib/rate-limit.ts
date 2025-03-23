import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';
import { headers } from 'next/headers';

// Initialize Redis
let redis: Redis;
let limiter: Ratelimit;

// Create Redis instance and rate limiter
export function getRateLimiter() {
  // Only initialize once
  if (!redis) {
    redis = new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL || '',
      token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
    });
  }
  
  // Only initialize once
  if (!limiter) {
    // Create a new rate limiter that allows 15 requests per hour
    limiter = new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(15, '1 h'),
      analytics: true,
    });
  }
  
  return limiter;
}

// Get the client's IP address from headers
export function getClientIP(): string {
  const headersList = headers();
  
  // Get the forwarded IP if behind a proxy
  const forwardedFor = headersList.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  // Fall back to direct connection IP
  const ip = headersList.get('x-real-ip');
  if (ip) {
    return ip;
  }
  
  // Default fallback
  return 'unknown-ip';
}

// Check rate limit by IP
export async function checkRateLimit(identifier?: string): Promise<{
  success: boolean;
  limit: number;
  remaining: number;
  reset: number;
  message?: string;
}> {
  try {
    // Get rate limiter
    const limiter = getRateLimiter();
    
    // Use provided identifier or fallback to IP
    const id = identifier || getClientIP();
    
    // Check rate limit
    const { success, limit, remaining, reset } = await limiter.limit(id);
    
    return {
      success,
      limit,
      remaining,
      reset,
      message: success ? undefined : `Rate limit exceeded. Try again in ${Math.ceil((reset - Date.now()) / 1000 / 60)} minutes.`,
    };
  } catch (error) {
    console.error('Rate limiting error:', error);
    
    // If rate limiting fails, allow the request (fail open)
    return {
      success: true,
      limit: 15,
      remaining: 1,
      reset: Date.now() + 3600000,
      message: 'Rate limiter error, proceeding anyway',
    };
  }
} 