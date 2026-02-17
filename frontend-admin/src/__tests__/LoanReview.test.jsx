/* eslint-env vitest */
import { describe, test, expect, vi, afterEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithQuery } from "../test/testUtils";
import LoanReview from "../pages/loans/LoanReview";
import {
  fetchBranchLoanReview,
  submitBranchDecision,
  runEligibilityCheck,
} from "../api/branchLoansApi";

vi.mock("../api/branchLoansApi", () => ({
  fetchBranchLoanReview: vi.fn(),
  submitBranchDecision: vi.fn(),
  runEligibilityCheck: vi.fn(),
}));

describe("LoanReview", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test("renders review data and allows approval with consent", async () => {
    localStorage.setItem("token", "jwt");
    fetchBranchLoanReview.mockResolvedValueOnce({
      loanId: "LN-1",
      loanType: "PERSONAL",
      status: "UNDER_BRANCH_REVIEW",
      applicant: { name: "Asha", email: "asha@example.com" },
      documents: [],
    });
    submitBranchDecision.mockResolvedValueOnce({ status: "BRANCH_APPROVED" });

    renderWithQuery(<LoanReview loanId="LN-1" onClose={() => {}} />);

    expect(await screen.findByText("Application Review")).toBeInTheDocument();
    expect(await screen.findByText("Make Your Decision")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /Approve/i }));
    await userEvent.click(
      screen.getByRole("checkbox", {
        name: /I confirm that this application has been reviewed/i,
      })
    );
    await userEvent.click(screen.getByRole("button", { name: /Confirm Approval/i }));

    expect(submitBranchDecision).toHaveBeenCalledWith("LN-1", { decision: "APPROVE" });
  });

  test("rejection requires reason", async () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    localStorage.setItem("token", "jwt");
    fetchBranchLoanReview.mockResolvedValueOnce({
      loanId: "LN-2",
      loanType: "PERSONAL",
      status: "UNDER_BRANCH_REVIEW",
      applicant: { name: "Asha", email: "asha@example.com" },
      documents: [],
    });

    renderWithQuery(<LoanReview loanId="LN-2" onClose={() => {}} />);

    await screen.findByText("Application Review");
    await screen.findByText("Make Your Decision");
    await userEvent.click(screen.getByRole("button", { name: /Reject/i }));
    await userEvent.click(screen.getByRole("button", { name: "Confirm" }));

    expect(alertSpy).toHaveBeenCalledWith("Rejection reason is required");
    alertSpy.mockRestore();
  });
});
