import api from "./axios";

export const getManagerLoanClosures = async ({ page = 0, size = 10 } = {}) => {
  const response = await api.get("/manager/loan-closure", {
    params: { page, size },
  });
  return response.data;
};

export const closeLoanByManager = async (loanId) => {
  const response = await api.post(`/manager/loan-closure/${loanId}/close`);
  return response.data;
};
