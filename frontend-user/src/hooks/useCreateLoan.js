// src/hooks/useCreateLoan.js
import { useState } from 'react';
import { getOrCreateIdempotencyKey, clearIdempotencyKey } from '../utils/idempotency';
import { getToken, getUser } from '../api/authApi';

export const useCreateLoan = (url, options = {}) => {
  const {
    loanType: defaultLoanType,
    idempotencyTtlMs = 24 * 60 * 60 * 1000,
    clearOnSuccess = true
  } = options;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createLoan = async (data, requestOptions = {}) => {
    setLoading(true);
    setError(null);

    const user = getUser();
    const loanType = requestOptions.loanType || data?.loanType || defaultLoanType || 'UNKNOWN';
    const scope = `${user?.userId || 'anon'}:${loanType}`;
    const ttlOverride = requestOptions.idempotencyTtlMs;
    const clearOverride = requestOptions.clearOnSuccess;
    const idempotencyKey = getOrCreateIdempotencyKey(scope, ttlOverride ?? idempotencyTtlMs);
    const token = getToken();

    if (!token) {
      const error = 'No authentication token found. Please log in.';
      setError(error);
      setLoading(false);
      throw new Error(error);
    }

    console.log('Sending request with idempotency key:', idempotencyKey);

    const authHeader = token?.startsWith('Bearer ') ? token : `Bearer ${token}`;

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Idempotency-Key': idempotencyKey,
          'Authorization': authHeader
        },
        body: JSON.stringify(data)
      });

      // Check if this was a cached/replayed response
      const isReplayed = res.headers.get('X-Idempotency-Replay') === 'true';

      const text = await res.text();
      let responseData;

      if (text) {
        try {
          responseData = JSON.parse(text);

          // Add flag if this was a duplicate submission
          if (isReplayed) {
            responseData.isDuplicate = true;
            console.warn('Duplicate submission detected - returning cached loan');
          }
        } catch (parseError) {
          if (res.ok) {
            responseData = { success: true, message: text };
          } else {
            throw new Error(`Invalid JSON response: ${text}`);
          }
        }
      } else {
        responseData = res.ok
          ? { success: true, message: 'Loan application submitted successfully' }
          : { success: false, message: 'Request failed' };
      }

      if (!res.ok) {
        if (res.status === 403) {
          throw new Error(responseData.message || 'Access denied. Please sign in again.');
        }
        if (res.status === 401) {
          throw new Error(responseData.message || 'Authentication failed. Please sign in again.');
        }
        throw new Error(responseData.message || `Request failed with status ${res.status}`);
      }

      // Only clear key on success (keep it for retries on failure)
      const shouldClear = clearOverride ?? clearOnSuccess;
      if (shouldClear) {
        clearIdempotencyKey(scope);
      }
      setLoading(false);
      return responseData;
    } catch (err) {
      console.error('Request error:', err);
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return { createLoan, loading, error };
};