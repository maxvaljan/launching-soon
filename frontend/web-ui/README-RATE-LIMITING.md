# Rate Limiting for Contact Forms

This system implements rate limiting for contact form and business inquiry submissions using Upstash Redis.

## Configuration Steps

1. **Create an Upstash Redis Database**

   - Go to [Upstash](https://upstash.com/) and sign up/login
   - Create a new Redis database
   - Choose the region closest to your application servers
   - Copy the REST API details (URL and Token)

2. **Update Environment Variables**

   Add the following environment variables to your `.env.local` file:

   ```
   UPSTASH_REDIS_REST_URL=https://your-upstash-redis-url.upstash.io
   UPSTASH_REDIS_REST_TOKEN=your-upstash-redis-token
   ```

3. **Deploy Changes**

   - Commit and deploy these changes to your environment
   - The system will automatically start rate limiting form submissions

## How It Works

- Rate limiting is set to **15 submissions per hour** per IP address
- If a user exceeds this limit, they will receive a "Too many requests" error
- The counter resets after 1 hour from the first request
- If the Redis service is unavailable, requests will still be processed (fail open)

## Monitoring

You can monitor rate limiting in the Upstash dashboard:

1. Go to your Redis database in Upstash
2. Navigate to the "Data Browser" section
3. Look for keys starting with "ratelimit:"

## Adjusting Limits

To change the rate limits, modify the `src/lib/rate-limit.ts` file:

```typescript
limiter = new Ratelimit({
  redis,
  limiter: Ratelimit.slidingWindow(15, '1 h'), // Change 15 to desired limit
  analytics: true,
});
```

Possible time windows include: 's' (seconds), 'm' (minutes), 'h' (hours), 'd' (days)

## Troubleshooting

- If rate limiting doesn't seem to work, check that your env variables are correctly set
- Verify that the IP detection is working correctly in production environments
- Check Upstash logs for any connection errors 