/* eslint-env vitest */
import { describe, test, expect, vi, afterEach } from "vitest";
import {
  fetchRegionalPendingLoans,
  fetchRegionalLoanReview,
  fetchRegionalEligibilityByLoanId,
  submitRegionalLoanDecision,
} from "../api/regionalLoansApi";
import api from "../api/axios";

vi.mock("../api/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe("regionalLoansApi", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test("fetchRegionalPendingLoans calls pending endpoint with params", async () => {
    api.get.mockResolvedValueOnce({ data: { content: [] } });

    const result = await fetchRegionalPendingLoans({ page: 2, size: 5 });

    expect(api.get).toHaveBeenCalledWith("/regional/loans/pending", {
      params: { page: 2, size: 5 },
    });
    expect(result).toEqual({ content: [] });
  });

  test("fetchRegionalLoanReview calls loan detail endpoint", async () => {
    api.get.mockResolvedValueOnce({ data: { loanId: "LN-1" } });

    const result = await fetchRegionalLoanReview("LN-1");

    expect(api.get).toHaveBeenCalledWith("/regional/loans/LN-1");
    expect(result).toEqual({ loanId: "LN-1" });
  });

  test("fetchRegionalEligibilityByLoanId calls eligibility endpoint", async () => {
    api.get.mockResolvedValueOnce({ data: { score: 82 } });

    const result = await fetchRegionalEligibilityByLoanId("LN-2");

    expect(api.get).toHaveBeenCalledWith("/branch/eligibility/loan/LN-2");
    expect(result).toEqual({ score: 82 });
  });

  test("submitRegionalLoanDecision posts decision payload", async () => {
    api.post.mockResolvedValueOnce({ data: { status: "DISBURSEMENT_PENDING" } });
    const payload = { approved: true, remarks: "OK" };

    const result = await submitRegionalLoanDecision("LN-3", payload);

    expect(api.post).toHaveBeenCalledWith(
      "/regional/loans/LN-3/decision",
      payload
    );
    expect(result).toEqual({ status: "DISBURSEMENT_PENDING" });
  });
});
