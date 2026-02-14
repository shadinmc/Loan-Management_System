import axiosInstance from './axiosInstance';

export const getOtsQuote = async (loanId) => {
  const response = await axiosInstance.get(`/repayments/${loanId}/ots/quote`);
  return response.data;
};

export const settleOts = async (loanId, amount) => {
  const response = await axiosInstance.post(`/repayments/${loanId}/ots/settle`, {
    amount,
  });
  return response.data;
};

export const getRepaymentDashboard = async (loanId) => {
  const response = await axiosInstance.get(`/repayments/${loanId}`);
  return response.data;
};

export const payEmi = async (loanId, amount) => {
  const response = await axiosInstance.post(`/repayments/${loanId}/pay`, {
    amount,
  });
  return response.data;
};
