import api from "./axios";

const getAuthHeader = () => {
  const rawAuth = localStorage.getItem("adminAuth");
  const parsedAuth = rawAuth ? JSON.parse(rawAuth) : null;
  const token = localStorage.getItem("token") || parsedAuth?.token;
  if (!token) {
    console.warn("Branch KYC request blocked: missing auth token");
    return {};
  }
  return { Authorization: `Bearer ${token}` };
};

export const fetchPendingKycs = async () => {
  const response = await api.get("/branch/kyc/pending", {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const submitKycDecision = async (userId, decision) => {
  const response = await api.post(`/branch/kyc/${userId}/decision`, decision, {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const fetchManagerKycs = async () => {
  const response = await api.get("/manager/kyc", {
    headers: getAuthHeader(),
  });
  return response.data;
};

export const submitManagerKycDecision = async (userId, decision) => {
  const response = await api.post(`/manager/kyc/${userId}/decision`, decision, {
    headers: getAuthHeader(),
  });
  return response.data;
};
