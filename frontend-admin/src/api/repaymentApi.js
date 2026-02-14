import api from "./axios";

export const getManagerRepayments = async () => {
  const response = await api.get("/repayments/manager");
  return response.data;
};

export const getManagerRepaymentDetail = async (loanId) => {
  const response = await api.get(`/repayments/manager/${loanId}`);
  return response.data;
};
