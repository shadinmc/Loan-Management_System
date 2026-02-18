// src/context/KYCContext.jsx
import { useEffect } from 'react';
import { create } from 'zustand';
import { getMyKyc as getMyKycApi, submitKyc as submitKycApi } from '../api/kycApi';
import { getUser } from '../api/authApi';

let kycRequestInFlight = null;

const mapBackendStatus = (status) => {
  if (status === 'VERIFIED') return 'approved';
  if (status === 'REJECTED') return 'rejected';
  if (status === 'PENDING') return 'pending';
  return 'not_submitted';
};

const useKycStore = create((set, get) => ({
  kycData: null,
  kycStatus: 'not_submitted',
  rejectionReason: null,
  kycLoading: false,
  hasFetchedFromApi: false,
  hydratedFromStorage: false,

  clearKYC: () => {
    set({
      kycData: null,
      kycStatus: 'not_submitted',
      rejectionReason: null,
      hasFetchedFromApi: false
    });
    localStorage.removeItem('kycData');
    localStorage.removeItem('kycStatus');
    localStorage.removeItem('kycRejectionReason');
    localStorage.removeItem('kycStatusUpdatedAt');
    localStorage.removeItem('kycUserId');
  },

  hydrateFromStorage: () => {
    const user = getUser();
    const userId = user?.userId || null;
    const token = localStorage.getItem('token');
    if (token && userId) return;

    const savedUserId = localStorage.getItem('kycUserId');
    if (savedUserId && userId && savedUserId !== userId) {
      get().clearKYC();
      return;
    }

    const savedKYC = localStorage.getItem('kycData');
    const savedStatus = localStorage.getItem('kycStatus');
    const savedRejectionReason = localStorage.getItem('kycRejectionReason');

    let parsedKyc = null;
    if (savedKYC) {
      try {
        parsedKyc = JSON.parse(savedKYC);
      } catch (error) {
        console.error('Error parsing KYC data:', error);
        localStorage.removeItem('kycData');
      }
    }

    set({
      kycData: parsedKyc,
      kycStatus: savedStatus || 'not_submitted',
      rejectionReason: savedRejectionReason || null,
      hydratedFromStorage: true
    });
  },

  fetchKYC: async () => {
    const user = getUser();
    const userId = user?.userId || null;
    const token = localStorage.getItem('token');
    if (!token) return;
    if (get().kycLoading && kycRequestInFlight) return kycRequestInFlight;
    if (get().hasFetchedFromApi) return;

    set({ kycLoading: true });
    kycRequestInFlight = (async () => {
      try {
        const data = await getMyKycApi();
        const normalizedStatus = mapBackendStatus(data?.status);

        const submissionData = {
          aadhaarNumber: data?.aadhaarNumber,
          panNumber: data?.panNumber,
          cibilScore: data?.cibilScore,
        };

        const apiRejectionReason = data?.rejectionReason ?? null;
        set({
          kycData: submissionData,
          kycStatus: normalizedStatus,
          rejectionReason: apiRejectionReason,
          hasFetchedFromApi: true,
          kycLoading: false
        });

        localStorage.setItem('kycData', JSON.stringify(submissionData));
        localStorage.setItem('kycStatus', normalizedStatus);
        if (userId) {
          localStorage.setItem('kycUserId', userId);
        }
        if (normalizedStatus === 'rejected' && apiRejectionReason) {
          localStorage.setItem('kycRejectionReason', apiRejectionReason);
        } else {
          localStorage.removeItem('kycRejectionReason');
        }
      } catch (error) {
        const status = error?.response?.status;
        const message = error?.response?.data?.message || '';
        if (status === 404 || message.includes('KYC not submitted')) {
          get().clearKYC();
          set({ hasFetchedFromApi: true });
        }
        set({ kycLoading: false });
      } finally {
        kycRequestInFlight = null;
      }
    })();

    return kycRequestInFlight;
  },

  submitKYC: async (data) => {
    try {
      const user = getUser();
      const userId = user?.userId || null;
      const idempotencyKey =
        (globalThis.crypto && crypto.randomUUID)
          ? crypto.randomUUID()
          : `kyc-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const response = await submitKycApi(data, idempotencyKey);

      const submissionData = {
        ...data,
        ...response,
        submittedAt: new Date().toISOString(),
      };

      set({
        kycData: submissionData,
        kycStatus: 'pending',
        rejectionReason: null
      });

      localStorage.setItem('kycData', JSON.stringify(submissionData));
      localStorage.setItem('kycStatus', 'pending');
      if (userId) {
        localStorage.setItem('kycUserId', userId);
      }
      localStorage.removeItem('kycRejectionReason');

      return { success: true };
    } catch (error) {
      console.error('Error submitting KYC:', error);
      const message =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        error?.message ||
        'Submission failed';
      return { success: false, error: message };
    }
  },

  updateKYCStatus: (status, reason = null) => {
    set({
      kycStatus: status,
      rejectionReason: status === 'rejected' ? reason : null
    });
    localStorage.setItem('kycStatus', status);

    if (status === 'rejected' && reason) {
      localStorage.setItem('kycRejectionReason', reason);
    } else {
      localStorage.removeItem('kycRejectionReason');
    }

    localStorage.setItem('kycStatusUpdatedAt', new Date().toISOString());
  },

  resubmitKYC: async (data) => get().submitKYC(data),

  getSubmissionDate: () => {
    const currentData = get().kycData;
    if (!currentData?.submittedAt) return null;
    return new Date(currentData.submittedAt);
  },

  getDaysSinceSubmission: () => {
    const submissionDate = get().getSubmissionDate();
    if (!submissionDate) return 0;
    const now = new Date();
    const diffTime = Math.abs(now - submissionDate);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}));

export function KYCProvider({ children }) {
  return children;
}

export function useKYC() {
  const store = useKycStore();
  const kycLoading = useKycStore((state) => state.kycLoading);
  const hasFetchedFromApi = useKycStore((state) => state.hasFetchedFromApi);
  const hydratedFromStorage = useKycStore((state) => state.hydratedFromStorage);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      if (!hasFetchedFromApi && !kycLoading) {
        store.fetchKYC();
      }
      return;
    }

    if (!hydratedFromStorage) {
      store.hydrateFromStorage();
    }
  }, [hasFetchedFromApi, hydratedFromStorage, kycLoading]);

  return {
    ...store,
    isKYCComplete: store.kycStatus === 'approved',
    isKYCPending: store.kycStatus === 'pending',
    isKYCRejected: store.kycStatus === 'rejected',
    isKYCNotSubmitted: store.kycStatus === 'not_submitted',
    canApplyForLoans: store.kycStatus === 'approved',
  };
}
