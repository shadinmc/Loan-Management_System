/**
 * Loan API
 * Handles loan-related API operations
 */

import axiosInstance from './axiosInstance';
import { LOAN_CONFIG } from '../utils/constants';

/**
 * Create a new business loan application
 * @param {Object} payload - The loan application payload
 * @returns {Promise} - API response
 */
export const createBusinessLoan = async (payload) => {
  try {
    const response = await axiosInstance.post('/loans/apply', payload);
    return response.data;
  } catch (error) {
    console.error('Error creating business loan:', error);
    throw error;
  }
};

/**
 * Get loan application status by ID
 * @param {string} loanId - The loan ID
 * @returns {Promise} - API response with loan status
 */
export const getLoanStatus = async (loanId) => {
  try {
    const response = await axiosInstance.get(`/loans/${loanId}/status`);
    return response.data;
  } catch (error) {
    console.error('Error fetching loan status:', error);
    throw error;
  }
};

/**
 * Get all loan applications for the current user
 * @param {string} userId - User ID (optional, can be inferred from token)
 * @returns {Promise} - API response with list of loans
 */
export const getAllLoans = async (userId) => {
  try {
    const url = userId ? `/loans?userId=${userId}` : '/loans';
    const response = await axiosInstance.get(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching loans:', error);
    throw error;
  }
};

/**
 * Get all loan applications for the current user
 * @returns {Promise} - API response with list of loans
 */
export const getMyLoans = async () => {
  try {
    const response = await axiosInstance.get('/loans/my-loans');
    const data = response.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.content)) return data.content;
    return [];
  } catch (error) {
    console.error('Error fetching user loans:', error);
    throw error;
  }
};

/**
 * Get a specific loan application by ID
 * @param {string} loanId - The loan ID
 * @returns {Promise} - API response with loan details
 */
export const getLoanById = async (loanId) => {
  try {
    const response = await axiosInstance.get(`/loans/${loanId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching loan details:', error);
    throw error;
  }
};

export const resubmitLoan = async (loanId, payload) => {
  try {
    const response = await axiosInstance.patch(`/loans/${loanId}/resubmit`, payload);
    return response.data;
  } catch (error) {
    console.error('Error resubmitting loan:', error);
    throw error;
  }
};

/**
 * Update an existing loan application
 * @param {string} loanId - The loan ID
 * @param {Object} payload - Updated loan data
 * @returns {Promise} - API response
 */
export const updateLoan = async (loanId, payload) => {
  try {
    const response = await axiosInstance.put(`/loans/${loanId}`, payload);
    return response.data;
  } catch (error) {
    console.error('Error updating loan:', error);
    throw error;
  }
};

/**
 * Delete/Cancel a loan application
 * @param {string} loanId - The loan ID
 * @returns {Promise} - API response
 */
export const cancelLoan = async (loanId) => {
  try {
    const response = await axiosInstance.delete(`/loans/${loanId}`);
    return response.data;
  } catch (error) {
    console.error('Error canceling loan:', error);
    throw error;
  }
};

/**
 * Fetch available loan types from backend
 * @returns {Promise} - API response with loan types
 */
export const fetchLoanTypes = async () => {
  try {
    const response = await axiosInstance.get('/loans/types');
    return response.data;
  } catch (error) {
    console.error('Error fetching loan types:', error);
    // Return default loan types if API fails
    return ['PERSONAL', 'BUSINESS', 'EDUCATIONAL', 'VEHICLE'];
  }
};

/**
 * Calculate EMI for given parameters
 * @param {number} principal - Loan amount
 * @param {number} rate - Annual interest rate
 * @param {number} tenure - Tenure in months
 * @returns {number} - Calculated EMI
 */
export const calculateEMI = (principal, rate, tenure) => {
  const monthlyRate = rate / 12 / 100;
  const emi =
    (principal * monthlyRate * Math.pow(1 + monthlyRate, tenure)) /
    (Math.pow(1 + monthlyRate, tenure) - 1);
  return Math.round(emi);
};

/**
 * Get loan configuration for a specific loan type
 * @param {string} loanType - Type of loan (BUSINESS, PERSONAL, etc.)
 * @returns {Object} - Loan configuration
 */
export const getLoanConfig = (loanType) => {
  return LOAN_CONFIG[loanType] || null;
};

/**
 * Upload loan documents
 * @param {string} loanId - The loan ID
 * @param {FormData} formData - Form data containing files
 * @returns {Promise} - API response
 */
export const uploadLoanDocuments = async (loanId, formData) => {
  try {
    const response = await axiosInstance.post(
      `/loans/${loanId}/documents`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error uploading documents:', error);
    throw error;
  }
};

/**
 * Check loan eligibility
 * @param {Object} data - Eligibility check data
 * @returns {Promise} - API response with eligibility result
 */
export const checkEligibility = async (data) => {
  try {
    const response = await axiosInstance.post('/loans/check-eligibility', data);
    return response.data;
  } catch (error) {
    console.error('Error checking eligibility:', error);
    throw error;
  }
};

// ===== LEGACY/DEMO FUNCTIONS (for backward compatibility) =====

/**
 * @deprecated Use createBusinessLoan instead
 * Legacy function for creating loan applications
 */
export const createLoanApplication = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const applicationId = 'LN' + Date.now();
      console.log('Loan application created:', { applicationId, ...data });

      const applications = JSON.parse(localStorage.getItem('loanApplications') || '[]');
      applications.push({
        applicationId,
        ...data,
        status: 'SUBMITTED',
        appliedDate: new Date().toISOString(),
      });
      localStorage.setItem('loanApplications', JSON.stringify(applications));

      resolve({
        success: true,
        applicationId,
        message: 'Application submitted successfully',
      });
    }, 1000);
  });
};

/**
 * @deprecated Use createBusinessLoan instead
 */
export const createLoan = (data) => {
  console.log('Loan application:', data);
  return Promise.resolve({ success: true, loanId: 'LOAN-' + Date.now() });
};

/**
 * @deprecated Use getAllLoans instead
 */
export const getLoanApplications = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const applications = JSON.parse(localStorage.getItem('loanApplications') || '[]');
      resolve(applications);
    }, 500);
  });
};

export default {
  createBusinessLoan,
  getLoanStatus,
  getAllLoans,
  getMyLoans,
  getLoanById,
  resubmitLoan,
  updateLoan,
  cancelLoan,
  fetchLoanTypes,
  calculateEMI,
  getLoanConfig,
  uploadLoanDocuments,
  checkEligibility,
};
