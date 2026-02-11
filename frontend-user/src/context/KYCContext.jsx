// src/context/KYCContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';

const KYCContext = createContext(null);

export function KYCProvider({ children }) {
  const [kycData, setKYCData] = useState(null);
  const [kycStatus, setKYCStatus] = useState('not_submitted'); // not_submitted, pending, approved, rejected
  const [rejectionReason, setRejectionReason] = useState(null);

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

  const submitKYC = (data) => {
    try {
      // Add submission timestamp
      const submissionData = {
        ...data,
        submittedAt: new Date().toISOString(),
        submissionId: `KYC${Date.now()}`
      };

      setKYCData(submissionData);
      setKYCStatus('pending');
      setRejectionReason(null);

      // Save to localStorage
      localStorage.setItem('kycData', JSON.stringify(submissionData));
      localStorage.setItem('kycStatus', 'pending');
      localStorage.removeItem('kycRejectionReason');

      return { success: true, submissionId: submissionData.submissionId };
    } catch (error) {
      console.error('Error submitting KYC:', error);
      return { success: false, error: error.message };
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
        getDaysSinceSubmission
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