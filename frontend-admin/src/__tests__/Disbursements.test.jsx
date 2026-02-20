/* eslint-env vitest */
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithQuery } from "../test/testUtils";
import Disbursements from "../pages/disbursements/Disbursements";
import { getDisbursements } from "../api/disbursementApi";

vi.mock("../api/disbursementApi", () => ({
  getDisbursements: vi.fn(),
}));

describe("Disbursements", () => {
  beforeEach(() => {
    localStorage.setItem("token", "jwt");
  });

  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  test("filters by status card", async () => {
    getDisbursements.mockResolvedValueOnce({
      content: [
        { loanId: "LN-1", status: "DISBURSEMENT_PENDING", amount: 1000 },
        { loanId: "LN-2", status: "DISBURSED", amount: 2000 },
      ],
      page: 0,
      totalPages: 1,
      first: true,
      last: true,
    });

    renderWithQuery(<Disbursements />);

    expect(await screen.findByText("LN-1")).toBeInTheDocument();
    const disbursedLabel = screen.getAllByText("Disbursed")[0];
    await userEvent.click(disbursedLabel.closest(".stat-card"));
    expect(screen.queryByText("LN-1")).not.toBeInTheDocument();
    expect(screen.getByText("LN-2")).toBeInTheDocument();

    await userEvent.click(disbursedLabel.closest(".stat-card"));
    expect(screen.getByText("LN-1")).toBeInTheDocument();
    expect(screen.getByText("LN-2")).toBeInTheDocument();
  });
});
