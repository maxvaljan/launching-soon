import { api } from "../api";

/**
 * Payment methods API
 */
export const addPaymentMethod = async (paymentMethodId: string) => {
  return api.post('/payment/methods', { paymentMethodId });
};

export const getPaymentMethods = async () => {
  return api.get('/payment/methods');
};

export const removePaymentMethod = async (paymentMethodId: string) => {
  return api.delete(`/payment/methods/${paymentMethodId}`);
};

/**
 * Payment intent API
 */
export const createPaymentIntent = async (orderId: string, paymentMethodId: string, tipAmount = 0) => {
  return api.post('/payment/intents', { orderId, paymentMethodId, tipAmount });
};

export const addTip = async (orderId: string, paymentIntentId: string, tipAmount: number) => {
  return api.post(`/payment/intents/${paymentIntentId}/tip`, { 
    orderId, 
    tipAmount 
  });
};

/**
 * Cash payment API
 */
export const recordCashPayment = async (orderId: string, tipAmount = 0) => {
  return api.post('/payment/cash-payments', { orderId, tipAmount });
};

/**
 * Connect account API (for drivers)
 */
export const getConnectAccount = async () => {
  return api.get('/payment/connect/accounts/me');
};

export const createConnectAccount = async () => {
  return api.post('/payment/connect/accounts');
};

export const getOnboardingLink = async (returnUrl: string) => {
  return api.post('/payment/connect/onboarding', { returnUrl });
};

export const getDashboardLink = async () => {
  return api.get('/payment/connect/dashboard-link');
};

/**
 * Driver subscription API
 */
export const getDriverSubscription = async () => {
  return api.get('/payment/subscriptions/current');
};

export const createDriverSubscription = async (paymentMethodId: string) => {
  return api.post('/payment/subscriptions', { paymentMethodId });
};

export const cancelDriverSubscription = async () => {
  return api.delete('/payment/subscriptions/current');
};

/**
 * Fee payment API for cash transactions
 */
export const getCashFeePaymentLink = async (transactionId: string) => {
  return api.post('/payment/cash-payments/fee', { transactionId });
};