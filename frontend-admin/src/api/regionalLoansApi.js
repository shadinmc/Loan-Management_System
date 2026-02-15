import api from "./axios";

export const fetchRegionalPendingLoans = async () => {
  const response = await api.get("/regional/loans/pending");
  return response.data;
};

export const fetchRegionalLoanReview = async (loanId) => {
  const response = await api.get(`/regional/loans/${loanId}`);
  return response.data;
};

export const submitRegionalDecision = async (loanId, decision) => {
  const response = await api.post(`/regional/loans/${loanId}/decision`, decision);
  return response.data;
};
