/* eslint-env vitest */
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithQuery } from "../test/testUtils";
import LoanClosure from "../pages/LoanClosure/LoanClosure";
import { getManagerLoanClosures, closeLoanByManager } from "../api/loanClosureApi";

vi.mock("../api/loanClosureApi", () => ({
  getManagerLoanClosures: vi.fn(),
  closeLoanByManager: vi.fn(),
}));

describe("LoanClosure", () => {
  beforeEach(() => {
    localStorage.setItem("token", "jwt");
  });

  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  test("closes eligible loan", async () => {
    getManagerLoanClosures.mockResolvedValueOnce({
      content: [
        {
          loanId: "LN-1",
          status: "ACTIVE",
          fullName: "Ava",
          loanAmount: 100000,
          totalPaidAmount: 100000,
          paidEmis: 12,
          totalEmis: 12,
          remainingMonths: 0,
          closureEligible: true,
        },
      ],
      page: 0,
      totalPages: 1,
      first: true,
      last: true,
    });
    closeLoanByManager.mockResolvedValueOnce({ status: "CLOSED" });

    renderWithQuery(<LoanClosure />);

    expect(await screen.findByText("LN-1")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Close Loan" }));
    expect(closeLoanByManager).toHaveBeenCalledWith("LN-1");
  });

  test("toggles status card filter", async () => {
    getManagerLoanClosures.mockResolvedValueOnce({
      content: [
        {
          loanId: "LN-1",
          status: "ACTIVE",
          fullName: "Ava",
          loanAmount: 100000,
          totalPaidAmount: 50000,
          paidEmis: 6,
          totalEmis: 12,
          remainingMonths: 6,
          closureEligible: false,
        },
        {
          loanId: "LN-2",
          status: "CLOSED",
          fullName: "Ben",
          loanAmount: 100000,
          totalPaidAmount: 100000,
          paidEmis: 12,
          totalEmis: 12,
          remainingMonths: 0,
          closureEligible: true,
        },
      ],
      page: 0,
      totalPages: 1,
      first: true,
      last: true,
    });

    renderWithQuery(<LoanClosure />);

    expect(await screen.findByText("LN-1")).toBeInTheDocument();
    expect(screen.getByText("LN-2")).toBeInTheDocument();

    await userEvent.click(screen.getByText("Closed Loans").closest(".stat-card"));
    expect(screen.queryByText("LN-1")).not.toBeInTheDocument();
    expect(screen.getByText("LN-2")).toBeInTheDocument();

    await userEvent.click(screen.getByText("Closed Loans").closest(".stat-card"));
    expect(screen.getByText("LN-1")).toBeInTheDocument();
    expect(screen.getByText("LN-2")).toBeInTheDocument();
  });
});
