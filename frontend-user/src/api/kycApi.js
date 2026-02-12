// src/api/kycApi.js
import axiosInstance from './axiosInstance';

export async function submitKyc(payload, idempotencyKey) {
  const response = await axiosInstance.post('/kyc', payload, {
    headers: {
      'X-Idempotency-Key': idempotencyKey,
    },
  });
  return response.data;
}

export async function getMyKyc() {
  const response = await axiosInstance.get('/kyc/me');
  return response.data;
}
