import api from "./axios";

const getAuthHeader = () => {
  const rawAuth = localStorage.getItem("adminAuth");
  const parsedAuth = rawAuth ? JSON.parse(rawAuth) : null;
  const token = localStorage.getItem("token") || parsedAuth?.token;
  if (!token) {
    console.warn("Branch loans request blocked: missing auth token");
    return {};
  }
  return { Authorization: `Bearer ${token}` };
};

export const fetchBranchLoans = async ({ status, emiEligible, page = 0, size = 10 } = {}) => {
  const params = {};
  if (status && status !== "ALL") params.status = status;
  if (emiEligible !== undefined && emiEligible !== null) {
    params.emiEligible = emiEligible;
  }
  params.page = page;
  params.size = size;

  const response = await api.get("/branch/loans", {
    params,
    headers: getAuthHeader(),
  });
  return response.data;
};

export const fetchBranchLoanReview = async (loanId) => {
  const response = await api.get(`/branch/loans/${loanId}/review`, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const submitBranchDecision = async (loanId, decision) => {
  const response = await api.post(
    `/branch/loans/${loanId}/decision`,
    decision,
    {
      headers: getAuthHeader(),
    }
  );
  return response.data;
};

export const runEligibilityCheck = async (loanId) => {
  const response = await api.post(
    `/branch/loans/${loanId}/eligibility-check`,
    null,
    {
      headers: getAuthHeader(),
    }
  );
  return response.data;
};
