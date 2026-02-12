import api from "./axios";

// Get all pending KYC requests
export const getPendingKycs = () => {
  return api.get("/branch/kyc/pending");
};

// Approve KYC
export const approveKyc = (userId) => {
  return api.post(`/branch/kyc/${userId}/decision`, {
    approved: true,
    rejectionReason: null
  });
};

// Reject KYC
export const rejectKyc = (userId, reason) => {
  return api.post(`/branch/kyc/${userId}/decision`, {
    approved: false,
    rejectionReason: reason
  });
};
