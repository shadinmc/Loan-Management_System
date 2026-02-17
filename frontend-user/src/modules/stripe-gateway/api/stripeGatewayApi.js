import axiosInstance from '../../../api/axiosInstance';

export async function createStripePaymentIntent(amount, method) {
  const response = await axiosInstance.post('/payments/stripe/create-intent', {
    amount,
    method,
  });
  return response.data;
}

export async function confirmStripeWalletTopup(paymentIntentId) {
  const response = await axiosInstance.post('/payments/stripe/confirm-wallet-topup', {
    paymentIntentId,
  });
  return response.data;
}
