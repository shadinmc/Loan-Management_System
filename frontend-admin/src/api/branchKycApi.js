import api from "./axios";

export const fetchPendingKycs = async () => {
  const response = await api.get("/branch/kyc/pending");
  return response.data;
};

export const submitKycDecision = async (userId, decision) => {
  const response = await api.post(`/branch/kyc/${userId}/decision`, decision);
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
