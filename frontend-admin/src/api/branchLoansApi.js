import api from "./axios";

export const fetchBranchLoans = async ({ status, emiEligible } = {}) => {
  const params = {};
  if (status && status !== "ALL") params.status = status;
  if (emiEligible !== undefined && emiEligible !== null) {
    params.emiEligible = emiEligible;
  }

  const response = await api.get("/branch/loans", { params });
  return response.data;
};

export const fetchBranchLoanReview = async (loanId) => {
  const response = await api.get(`/branch/loans/${loanId}/review`);
  return response.data;
};

export const submitBranchDecision = async (loanId, decision) => {
  const response = await api.post(`/branch/loans/${loanId}/decision`, decision);
  return response.data;
};

export const runEligibilityCheck = async (loanId) => {
  const response = await api.post(`/branch/loans/${loanId}/eligibility-check`);
  return response.data;
};
