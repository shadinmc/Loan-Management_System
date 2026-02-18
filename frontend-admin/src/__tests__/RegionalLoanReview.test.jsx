/* eslint-env vitest */
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithQuery } from "../test/testUtils";
import RegionalLoanReview from "../pages/loans/RegionalLoanReview";
import {
  fetchRegionalLoanReview,
  submitRegionalLoanDecision,
  fetchRegionalEligibilityByLoanId,
} from "../api/regionalLoansApi";

vi.mock("../api/regionalLoansApi", () => ({
  fetchRegionalLoanReview: vi.fn(),
  submitRegionalLoanDecision: vi.fn(),
  fetchRegionalEligibilityByLoanId: vi.fn(),
}));

describe("RegionalLoanReview", () => {
  beforeEach(() => {
    localStorage.setItem("token", "jwt");
  });

  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  test("approves after consent and submits decision", async () => {
    fetchRegionalLoanReview.mockResolvedValueOnce({
      loanId: "LN-55",
      loanType: "PERSONAL",
      status: "UNDER_REGIONAL_REVIEW",
      approvedAmount: 100000,
      userId: "U1",
    });
    submitRegionalLoanDecision.mockResolvedValueOnce({ status: "DISBURSEMENT_PENDING" });

    renderWithQuery(
      <RegionalLoanReview loan={{ loanId: "LN-55", loanType: "PERSONAL" }} />
    );

    expect(await screen.findByText("Application Review")).toBeInTheDocument();
    expect(await screen.findByText("Final Decision (Regional Manager)")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: /Final Approval/i }));

    await userEvent.click(
      screen.getByRole("checkbox", {
        name: /I confirm final regional verification/i,
      })
    );
    await userEvent.click(
      screen.getByRole("button", { name: /Confirm Final Approval/i })
    );

    expect(submitRegionalLoanDecision).toHaveBeenCalledWith("LN-55", {
      approved: true,
      remarks: "Approved by regional manager",
    });
  });

  test("reject requires reason", async () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    fetchRegionalLoanReview.mockResolvedValueOnce({
      loanId: "LN-99",
      loanType: "PERSONAL",
      status: "UNDER_REGIONAL_REVIEW",
      approvedAmount: 100000,
      userId: "U1",
    });

    renderWithQuery(
      <RegionalLoanReview loan={{ loanId: "LN-99", loanType: "PERSONAL" }} />
    );

    await screen.findByText("Application Review");
    await screen.findByText("Final Decision (Regional Manager)");
    await userEvent.click(screen.getByRole("button", { name: /Final Rejection/i }));
    await userEvent.click(screen.getByRole("button", { name: /Confirm Final Rejection/i }));

    expect(alertSpy).toHaveBeenCalledWith("Rejection reason is required");
    alertSpy.mockRestore();
  });
});
