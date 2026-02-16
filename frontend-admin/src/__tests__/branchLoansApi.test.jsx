/* eslint-env vitest */
import { describe, test, expect, vi, afterEach } from "vitest";
import {
  fetchBranchLoans,
  fetchBranchLoanReview,
  submitBranchDecision,
  runEligibilityCheck,
} from "../api/branchLoansApi";
import api from "../api/axios";

vi.mock("../api/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe("branchLoansApi", () => {
  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  test("fetchBranchLoans builds params", async () => {
    localStorage.setItem("token", "jwt");
    api.get.mockResolvedValueOnce({ data: { content: [] } });

    await fetchBranchLoans({ status: "APPLIED", page: 2, size: 5 });

    expect(api.get).toHaveBeenCalledWith("/branch/loans", {
      params: { status: "APPLIED", page: 2, size: 5 },
      headers: { Authorization: "Bearer jwt" },
    });
  });

  test("fetchBranchLoanReview calls review endpoint", async () => {
    localStorage.setItem("token", "jwt");
    api.get.mockResolvedValueOnce({ data: { loanId: "LN-1" } });

    await fetchBranchLoanReview("LN-1");

    expect(api.get).toHaveBeenCalledWith("/branch/loans/LN-1/review", {
      headers: { Authorization: "Bearer jwt" },
    });
  });

  test("submitBranchDecision posts decision", async () => {
    localStorage.setItem("token", "jwt");
    api.post.mockResolvedValueOnce({ data: { status: "BRANCH_APPROVED" } });

    await submitBranchDecision("LN-1", { decision: "APPROVE" });

    expect(api.post).toHaveBeenCalledWith(
      "/branch/loans/LN-1/decision",
      { decision: "APPROVE" },
      { headers: { Authorization: "Bearer jwt" } }
    );
  });

  test("runEligibilityCheck posts to eligibility endpoint", async () => {
    localStorage.setItem("token", "jwt");
    api.post.mockResolvedValueOnce({ data: { eligible: true } });

    await runEligibilityCheck("LN-1");

    expect(api.post).toHaveBeenCalledWith(
      "/branch/loans/LN-1/eligibility-check",
      null,
      { headers: { Authorization: "Bearer jwt" } }
    );
  });
});
