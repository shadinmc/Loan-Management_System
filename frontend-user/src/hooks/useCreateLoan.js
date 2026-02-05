import { useState } from 'react';
import { getOrCreateIdempotencyKey, clearIdempotencyKey } from '../utils/idempotency';

export const useCreateLoan = (url) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const createLoan = async (data) => {
    setLoading(true);
    setError(null);

    const idempotencyKey = getOrCreateIdempotencyKey();

    try {
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Idempotency-Key': idempotencyKey
        },
        body: JSON.stringify(data)
      });

      const responseData = await res.json();

      if (!res.ok) {
        throw new Error(responseData.message || `Request failed with status ${res.status}`);
      }

      clearIdempotencyKey();
      setLoading(false);
      return responseData;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  return { createLoan, loading, error };
};
