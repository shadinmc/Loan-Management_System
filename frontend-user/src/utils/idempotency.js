const KEY = 'loan_idempotency_key';

export function getOrCreateIdempotencyKey() {
  let key = localStorage.getItem(KEY);
  if (!key) {
    key = crypto.randomUUID();
    localStorage.setItem(KEY, key);
  }
  return key;
}

export function clearIdempotencyKey() {
  localStorage.removeItem(KEY);
}
