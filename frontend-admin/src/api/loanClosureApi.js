import api from "./axios";

export const getManagerLoanClosures = async () => {
  const response = await api.get("/manager/loan-closure");
  return response.data;
};

export const closeLoanByManager = async (loanId) => {
  const response = await api.post(`/manager/loan-closure/${loanId}/close`);
  return response.data;
};
