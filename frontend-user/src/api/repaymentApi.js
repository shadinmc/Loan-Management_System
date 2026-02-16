import axiosInstance from './axiosInstance';

const toNullableNumber = (value) => {
  if (value === null || value === undefined || value === '') return null;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
};

const normalizeOtsQuote = (data = {}) => ({
  outstandingPrincipal: toNullableNumber(
    data.outstandingPrincipal ?? data.principal
  ),
  reducedInterest: toNullableNumber(
    data.reducedInterest
  ),
  penaltyAmount: toNullableNumber(data.penaltyAmount),
  penaltyWaiver: toNullableNumber(data.penaltyWaiver),
  settlementAmount: toNullableNumber(data.settlementAmount),
  remainingMonths: toNullableNumber(data.remainingMonths),
});

export const getOtsQuote = async (loanId) => {
  const response = await axiosInstance.get(`/repayments/${loanId}/ots/quote`);
  return normalizeOtsQuote(response.data?.data ?? response.data);
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

export default {
  getOtsQuote,
  settleOts,
  getRepaymentDashboard,
  payEmi,
};
