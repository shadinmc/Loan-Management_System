// src/api/walletApi.js
import axiosInstance from './axiosInstance';

export async function getMyWallet() {
  const response = await axiosInstance.get('/wallet/me');
  return response.data;
}

export async function getMyTransactionsPaged(page = 0, size = 10) {
  const response = await axiosInstance.get('/wallet/me/transactions/paged', {
    params: { page, size },
  });
  return response.data;
}

export async function creditWallet(loanId, amount) {
  const response = await axiosInstance.post('/wallet/credit', { loanId, amount });
  return response.data;
}

export async function withdrawWallet(loanId, amount) {
  const response = await axiosInstance.post('/wallet/withdraw', { loanId, amount });
  return response.data;
}

export async function reimburseWallet(loanId, amount) {
  const response = await axiosInstance.post('/wallet/reimburse', { loanId, amount });
  return response.data;
}
