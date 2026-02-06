/**
 * Loan API
 * Handles loan-related API operations
 */

import { LOAN_CONFIG } from '../utils/constants';

export const createLoanApplication = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const applicationId = 'LN' + Date.now();
      console.log('Loan application created:', { applicationId, ...data });

      // Store in localStorage for demo purposes
      const applications = JSON.parse(localStorage.getItem('loanApplications') || '[]');
      applications.push({
        applicationId,
        ...data,
        status: 'SUBMITTED',
        appliedDate: new Date().toISOString()
      });
      localStorage.setItem('loanApplications', JSON.stringify(applications));

      resolve({
        success: true,
        applicationId,
        message: 'Application submitted successfully'
      });
    }, 1000);
  });
};

export const createLoan = (data) => {
  console.log("Loan application:", data);
  return Promise.resolve({ success: true, loanId: "LOAN-" + Date.now() });
};

export const getLoanStatus = (loanId) => {
  return Promise.resolve({ status: "Pending Approval", loanId });
};

export const getAllLoans = () => {
  return Promise.resolve([]);
};


export const getLoanApplications = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const applications = JSON.parse(localStorage.getItem('loanApplications') || '[]');
      resolve(applications);
    }, 500);
  });
};

export const getLoanConfig = (loanType) => {
  return LOAN_CONFIG[loanType] || null;
};

export const calculateEMI = (principal, rate, tenure) => {
  const monthlyRate = rate / 12 / 100;
  const emi = principal * monthlyRate * Math.pow(1 + monthlyRate, tenure) /
              (Math.pow(1 + monthlyRate, tenure) - 1);
  return Math.round(emi);
};
