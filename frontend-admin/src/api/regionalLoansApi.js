import api from "./axios";

export const fetchRegionalPendingLoans = async ({ page = 0, size = 10 } = {}) => {
  const response = await api.get("/regional/loans/pending", {
    params: { page, size },
  });
  return response.data;
};

export const fetchRegionalLoanReview = async (loanId) => {
  const response = await api.get(`/regional/loans/${loanId}`);
  return response.data;
};

export const fetchRegionalEligibilityByLoanId = async (loanId) => {
  const response = await api.get(`/branch/eligibility/loan/${loanId}`);
  return response.data;
};

export const submitRegionalLoanDecision = async (loanId, payload) => {
  const response = await api.post(`/regional/loans/${loanId}/decision`, payload);
  return response.data;
};

