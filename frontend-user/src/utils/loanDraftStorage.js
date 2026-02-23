const STORAGE_PREFIX = 'loan-apply-draft';

const isFileValue = (value) => {
  return typeof File !== 'undefined' && value instanceof File;
};

const sanitizeForStorage = (formData) => {
  if (!formData || typeof formData !== 'object') return {};
  return Object.entries(formData).reduce((acc, [key, value]) => {
    acc[key] = isFileValue(value) ? null : value;
    return acc;
  }, {});
};

export const buildLoanDraftKey = (loanType, resubmitLoanId = null) => {
  const mode = resubmitLoanId ? `resubmit:${resubmitLoanId}` : 'new';
  return `${STORAGE_PREFIX}:${loanType}:${mode}`;
};

export const saveLoanDraft = (key, formData, currentStep) => {
  try {
    const payload = {
      formData: sanitizeForStorage(formData),
      currentStep,
      updatedAt: Date.now()
    };
    localStorage.setItem(key, JSON.stringify(payload));
  } catch {
    // Ignore storage failures (quota/private mode)
  }
};

export const loadLoanDraft = (key) => {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') return null;
    return parsed;
  } catch {
    return null;
  }
};

export const clearLoanDraft = (key) => {
  try {
    localStorage.removeItem(key);
  } catch {
    // Ignore storage failures
  }
};
