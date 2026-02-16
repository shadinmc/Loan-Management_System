/* eslint-env vitest */
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithQuery } from "../test/testUtils";
import Repayments from "../pages/Repayments/Repayments";
import { getManagerRepayments, getManagerRepaymentDetail } from "../api/repaymentApi";

vi.mock("../api/repaymentApi", () => ({
  getManagerRepayments: vi.fn(),
  getManagerRepaymentDetail: vi.fn(),
}));

describe("Repayments", () => {
  beforeEach(() => {
    localStorage.setItem("token", "jwt");
  });

  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  test("opens repayment detail modal", async () => {
    getManagerRepayments.mockResolvedValueOnce({
      content: [
        { loanId: "LN-1", fullName: "Ava", status: "ACTIVE", totalPaidAmount: 5000 },
      ],
      page: 0,
      totalPages: 1,
      first: true,
      last: true,
    });
    getManagerRepaymentDetail.mockResolvedValueOnce({
      loanId: "LN-1",
      fullName: "Ava",
      totalPaidAmount: 5000,
      remainingMonths: 5,
      paidProgressPercent: 40,
      status: "ACTIVE",
      emis: [],
    });

    renderWithQuery(<Repayments />);

    expect(await screen.findByText("LN-1")).toBeInTheDocument();
    const row = screen.getByText("LN-1").closest("tr");
    await userEvent.click(within(row).getByRole("button"));
    expect(await screen.findByText(/Repayment Detail - LN-1/)).toBeInTheDocument();
  });
});
