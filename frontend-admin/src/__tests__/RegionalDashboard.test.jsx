/* eslint-env vitest */
import { describe, test, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import { renderWithQuery } from "../test/testUtils";
import RegionalDashboard from "../pages/dashboard/RegionalDashboard";
import { fetchRegionalPendingLoans } from "../api/regionalLoansApi";

vi.mock("../api/regionalLoansApi", () => ({
  fetchRegionalPendingLoans: vi.fn(),
}));

describe("RegionalDashboard", () => {
  test("renders pending queue data", async () => {
    localStorage.setItem("token", "jwt");
    fetchRegionalPendingLoans.mockResolvedValueOnce({
      content: [
        { loanId: "LN-1", loanType: "PERSONAL", approvedAmount: 100000 },
      ],
      totalElements: 1,
    });

    renderWithQuery(<RegionalDashboard />);

    expect(await screen.findByText("Regional Manager Dashboard")).toBeInTheDocument();
    expect(await screen.findByText("LN-1")).toBeInTheDocument();
  });
});
