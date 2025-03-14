/**
 * Payment Routes
 * Routes for payment-related endpoints
 */

const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/payment.controller');
const { authMiddleware, csrfMiddleware } = require('../middleware/auth');

// Stripe Connect account routes
router.post('/connect/accounts', authMiddleware, csrfMiddleware, paymentController.createConnectAccount);
router.get('/connect/accounts/:id', authMiddleware, paymentController.getConnectAccount);
router.post('/connect/onboarding', authMiddleware, csrfMiddleware, paymentController.generateOnboardingLink);
router.get('/connect/refresh-onboarding', paymentController.refreshOnboarding);
router.get('/connect/onboarding-complete', paymentController.onboardingComplete);
router.get('/connect/dashboard-link', authMiddleware, paymentController.getDashboardLink);

// Payment methods routes
router.post('/methods', authMiddleware, csrfMiddleware, paymentController.addPaymentMethod);
router.get('/methods', authMiddleware, paymentController.getPaymentMethods);
router.delete('/methods/:id', authMiddleware, csrfMiddleware, paymentController.removePaymentMethod);

// Payment intent routes
router.post('/intents', authMiddleware, csrfMiddleware, paymentController.createPaymentIntent);

// Cash payment routes
router.post('/cash-payments', authMiddleware, csrfMiddleware, paymentController.recordCashPayment);
router.post('/cash-payments/fee', authMiddleware, csrfMiddleware, paymentController.getCashFeePaymentLink);

// Subscription routes
router.post('/subscriptions', authMiddleware, csrfMiddleware, paymentController.createSubscription);
router.get('/subscriptions/current', authMiddleware, paymentController.getCurrentSubscription);
router.delete('/subscriptions/:id', authMiddleware, csrfMiddleware, paymentController.cancelSubscription);

// Helper function to preserve raw body for webhook verification
function rawBodySaver(req, res, buf, encoding) {
  if (buf && buf.length) {
    req.rawBody = buf.toString(encoding || 'utf8');
  }
}

// Webhook route - no auth middleware needed as it's authenticated via signature
router.post('/webhooks', 
  express.raw({ 
    type: 'application/json',
    verify: rawBodySaver
  }),
  paymentController.handleWebhook
);

module.exports = router;