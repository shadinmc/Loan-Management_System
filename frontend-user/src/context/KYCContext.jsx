// src/context/KYCContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getMyKyc as getMyKycApi, submitKyc as submitKycApi } from '../api/kycApi';

const KYCContext = createContext(null);

export function KYCProvider({ children }) {
  const [kycData, setKYCData] = useState(null);
  const [kycStatus, setKYCStatus] = useState('not_submitted'); // not_submitted, pending, approved, rejected
  const [rejectionReason, setRejectionReason] = useState(null);

  const mapBackendStatus = (status) => {
    if (status === 'VERIFIED') return 'approved';
    if (status === 'REJECTED') return 'rejected';
    if (status === 'PENDING') return 'pending';
    return 'not_submitted';
  };

  const kycQuery = useQuery({
    queryKey: ['kyc', 'me'],
    queryFn: getMyKycApi,
    enabled: !!localStorage.getItem('token'),
    retry: false,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (!kycQuery.data) return;

    const data = kycQuery.data;
    const normalizedStatus = mapBackendStatus(data?.status);

    const submissionData = {
      aadhaarNumber: data?.aadhaarNumber,
      panNumber: data?.panNumber,
      cibilScore: data?.cibilScore,
    };

    setKYCData(submissionData);
    setKYCStatus(normalizedStatus);
    setRejectionReason(null);

    localStorage.setItem('kycData', JSON.stringify(submissionData));
    localStorage.setItem('kycStatus', normalizedStatus);
    localStorage.removeItem('kycRejectionReason');
  }, [kycQuery.data]);

  useEffect(() => {
    if (!kycQuery.error) return;
    const status = kycQuery.error?.response?.status;
    const message = kycQuery.error?.response?.data?.message || '';
    if (status === 404 || message.includes('KYC not submitted')) {
      clearKYC();
    }
  }, [kycQuery.error]);

  const submitMutation = useMutation({
    mutationFn: ({ payload, idempotencyKey }) =>
      submitKycApi(payload, idempotencyKey),
  });

  useEffect(() => {
    // Load KYC data from localStorage on mount
    const savedKYC = localStorage.getItem('kycData');
    const savedStatus = localStorage.getItem('kycStatus');
    const savedRejectionReason = localStorage.getItem('kycRejectionReason');

    if (savedKYC) {
      try {
        setKYCData(JSON.parse(savedKYC));
      } catch (error) {
        console.error('Error parsing KYC data:', error);
        localStorage.removeItem('kycData');
      }
    }

    if (savedStatus) {
      setKYCStatus(savedStatus);
    }

    if (savedRejectionReason) {
      setRejectionReason(savedRejectionReason);
    }
  }, []);

  const submitKYC = async (data) => {
    try {
      const idempotencyKey =
        (globalThis.crypto && crypto.randomUUID)
          ? crypto.randomUUID()
          : `kyc-${Date.now()}-${Math.random().toString(16).slice(2)}`;
      const response = await submitMutation.mutateAsync({
        payload: data,
        idempotencyKey,
      });

      const submissionData = {
        ...data,
        ...response,
        submittedAt: new Date().toISOString(),
      };

      setKYCData(submissionData);
      setKYCStatus('pending');
      setRejectionReason(null);

      localStorage.setItem('kycData', JSON.stringify(submissionData));
      localStorage.setItem('kycStatus', 'pending');
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
  };

  const updateKYCStatus = (status, reason = null) => {
    setKYCStatus(status);
    localStorage.setItem('kycStatus', status);

    if (status === 'rejected' && reason) {
      setRejectionReason(reason);
      localStorage.setItem('kycRejectionReason', reason);
    } else {
      setRejectionReason(null);
      localStorage.removeItem('kycRejectionReason');
    }

    // Add timestamp for status update
    const timestamp = new Date().toISOString();
    localStorage.setItem('kycStatusUpdatedAt', timestamp);
  };

  const clearKYC = () => {
    setKYCData(null);
    setKYCStatus('not_submitted');
    setRejectionReason(null);
    localStorage.removeItem('kycData');
    localStorage.removeItem('kycStatus');
    localStorage.removeItem('kycRejectionReason');
    localStorage.removeItem('kycStatusUpdatedAt');
  };

  const resubmitKYC = (data) => {
    return submitKYC(data);
  };

  // Helper computed values
  const isKYCComplete = kycStatus === 'approved';
  const isKYCPending = kycStatus === 'pending';
  const isKYCRejected = kycStatus === 'rejected';
  const isKYCNotSubmitted = kycStatus === 'not_submitted';
  const canApplyForLoans = isKYCComplete;

  // Get submission date
  const getSubmissionDate = () => {
    if (!kycData?.submittedAt) return null;
    return new Date(kycData.submittedAt);
  };

  // Calculate days since submission
  const getDaysSinceSubmission = () => {
    const submissionDate = getSubmissionDate();
    if (!submissionDate) return 0;

    const now = new Date();
    const diffTime = Math.abs(now - submissionDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <KYCContext.Provider
      value={{
        // State
        kycData,
        kycStatus,
        rejectionReason,

        // Actions
        submitKYC,
        updateKYCStatus,
        clearKYC,
        resubmitKYC,

        // Computed values
        isKYCComplete,
        isKYCPending,
        isKYCRejected,
        isKYCNotSubmitted,
        canApplyForLoans,

        // Helpers
        getSubmissionDate,
        getDaysSinceSubmission,
        kycLoading: kycQuery.isLoading
      }}
    >
      {children}
    </KYCContext.Provider>
  );
}

export function useKYC() {
  const context = useContext(KYCContext);
  if (!context) {
    throw new Error('useKYC must be used within a KYCProvider');
  }
  return context;
}
