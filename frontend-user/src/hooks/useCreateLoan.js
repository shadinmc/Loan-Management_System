// src/hooks/useCreateLoan.js
import { useMemo } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { getOrCreateIdempotencyKey, clearIdempotencyKey } from '../utils/idempotency';
import { getToken, getUser } from '../api/authApi';
import axiosInstance from '../api/axiosInstance';

export const useCreateLoan = (url, options = {}) => {
  const {
    loanType: defaultLoanType,
    idempotencyTtlMs = 24 * 60 * 60 * 1000,
    clearOnSuccess = true
  } = options;
  const queryClient = useQueryClient();

  const endpoint = useMemo(() => {
    if (!url) return '/loans/apply';
    if (url.startsWith('http://') || url.startsWith('https://')) {
      try {
        const parsed = new URL(url);
        return parsed.pathname.replace(/^\/api/, '') + parsed.search;
      } catch {
        return '/loans/apply';
      }
    }
    return url.replace(/^\/api/, '');
  }, [url]);

  const mutation = useMutation({
    mutationFn: async ({ data, requestOptions }) => {
      const user = getUser();
      const loanType = requestOptions.loanType || data?.loanType || defaultLoanType || 'UNKNOWN';
      const scope = `${user?.userId || 'anon'}:${loanType}`;
      const ttlOverride = requestOptions.idempotencyTtlMs;
      const clearOverride = requestOptions.clearOnSuccess;
      const idempotencyKey = getOrCreateIdempotencyKey(scope, ttlOverride ?? idempotencyTtlMs);
      const token = getToken();

      if (!token) {
        throw new Error('No authentication token found. Please log in.');
      }

      const authHeader = token?.startsWith('Bearer ') ? token : `Bearer ${token}`;

      try {
        const response = await axiosInstance.post(endpoint, data, {
          headers: {
            'X-Idempotency-Key': idempotencyKey,
            Authorization: authHeader
          }
        });

        const isReplayed = String(response.headers?.['x-idempotency-replay']) === 'true';
        const responseData = response.data || {};
        if (isReplayed && responseData && typeof responseData === 'object') {
          responseData.isDuplicate = true;
        }

        const shouldClear = clearOverride ?? clearOnSuccess;
        if (shouldClear) {
          clearIdempotencyKey(scope);
        }

        queryClient.invalidateQueries({ queryKey: ['loans', 'my-loans'] });
        queryClient.invalidateQueries({ queryKey: ['repayment', 'loans'] });

        return responseData;
      } catch (error) {
        const status = error?.response?.status;
        const message =
          error?.response?.data?.message ||
          error?.response?.data?.error ||
          error?.message ||
          'Request failed';

        if (status === 401) {
          throw new Error(message || 'Authentication failed. Please sign in again.');
        }
        if (status === 403) {
          throw new Error(message || 'Access denied. Please sign in again.');
        }
        throw new Error(message);
      }
    }
  });

  const createLoan = async (data, requestOptions = {}) => {
    return mutation.mutateAsync({ data, requestOptions });
  };

  return {
    createLoan,
    loading: mutation.isPending,
    error: mutation.error?.message || null
  };
};
