// src/hooks/useCreateLoan.js
import { useState } from 'react';
import { getOrCreateIdempotencyKey, clearIdempotencyKey } from '../utils/idempotency';
import { getToken } from '../api/authApi';

export const useCreateLoan = (url) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createLoan = async (data) => {
    setLoading(true);
    setError(null);

    const idempotencyKey = getOrCreateIdempotencyKey();
    const token = getToken();

    if (!token) {
      const error = 'No authentication token found. Please log in.';
      setError(error);
      setLoading(false);
      throw new Error(error);
    }

    console.log('Sending request with idempotency key:', idempotencyKey);

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Idempotency-Key': idempotencyKey,
          'Authorization': `Bearer ${token}`
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
          throw new Error(responseData.message || 'Access denied.');
        }
        if (res.status === 401) {
          throw new Error(responseData.message || 'Authentication failed.');
        }
        throw new Error(responseData.message || `Request failed with status ${res.status}`);
      }

      // Only clear key on success (keep it for retries on failure)
      clearIdempotencyKey();
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