import api from "./axios";

// Get all branch loans (optional filters)
export const getBranchLoans = (status) => {
  return api.get("/branch/loans", {
    params: status ? { status } : {},
  });
};

// Get single loan review data
export const getLoanReview = (loanId) => {
  return api.get(`/branch/loans/${loanId}/review`);
};

// Run eligibility check
export const runEligibilityCheck = (loanId) => {
  return api.post(`/branch/loans/${loanId}/eligibility-check`);
};

// Make branch decision (APPROVE / REJECT / CLARIFICATION_REQUIRED)
export const makeBranchDecision = (loanId, decisionData) => {
  return api.post(`/branch/loans/${loanId}/decision`, decisionData);
};
