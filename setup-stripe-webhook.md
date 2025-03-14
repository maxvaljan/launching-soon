# Setting up Stripe Webhooks

To ensure that your application receives real-time updates from Stripe (such as subscription status changes, payment successes/failures, etc.), you need to configure a webhook endpoint. Follow these steps:

## 1. Start Your Application

First, make sure your MaxMove backend is running and publicly accessible. You can use tools like ngrok to create a temporary public URL:

```bash
# Install ngrok if you don't have it
npm install -g ngrok

# Start your backend
cd backend
npm run dev

# In a separate terminal, create a public URL for your backend
ngrok http 3000
```

## 2. Configure Stripe Webhook

1. Log into your [Stripe Dashboard](https://dashboard.stripe.com/webhooks)
2. Click "Add endpoint"
3. Enter your webhook URL: `https://your-ngrok-url.ngrok.io/api/payment/webhooks`
4. Select the following events to listen for:
   - `account.updated` - When a Connect account status changes
   - `payment_intent.succeeded` - When a payment succeeds
   - `payment_intent.payment_failed` - When a payment fails 
   - `checkout.session.completed` - When a checkout session completes
   - `invoice.paid` - When a subscription invoice is paid
   - `invoice.payment_failed` - When a subscription payment fails

5. Click "Add endpoint"
6. Copy the "Signing Secret" 
7. Add this secret to your `.env` file:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_your_signing_secret
   ```

## 3. Deploy to Production

When you deploy your application to production:

1. Create a new webhook endpoint in Stripe pointing to your production URL
2. Update your production environment with the new webhook signing secret

This ensures that all subscription renewals, payment status changes, and account updates are properly processed by your application.
