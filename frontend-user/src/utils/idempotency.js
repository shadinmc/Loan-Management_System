const KEY = 'loan_idempotency_key';

function getKeyName(scope) {
  return scope ? `${KEY}:${scope}` : KEY;
}

export function getOrCreateIdempotencyKey(scope, ttlMs = 24 * 60 * 60 * 1000) {
  const keyName = getKeyName(scope);
  const raw = localStorage.getItem(keyName);
  if (raw) {
    try {
      const parsed = JSON.parse(raw);
      if (parsed?.key && parsed?.createdAt && Date.now() - parsed.createdAt < ttlMs) {
        return parsed.key;
      }
    } catch {
      // ignore malformed data
    }
  }
  const key = crypto.randomUUID();
  localStorage.setItem(keyName, JSON.stringify({ key, createdAt: Date.now() }));
  return key;
}

export function clearIdempotencyKey(scope) {
  localStorage.removeItem(getKeyName(scope));
}
