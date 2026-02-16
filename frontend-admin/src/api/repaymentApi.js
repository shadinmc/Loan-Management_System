import api from "./axios";

export const getManagerRepayments = async ({ page = 0, size = 10 } = {}) => {
  const response = await api.get("/repayments/manager", {
    params: { page, size },
  });
  return response.data;
};

export const getManagerRepaymentDetail = async (loanId) => {
  const response = await api.get(`/repayments/manager/${loanId}`);
  return response.data;
};
