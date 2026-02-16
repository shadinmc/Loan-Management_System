/* eslint-env vitest */
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { renderWithQuery } from "../test/testUtils";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoanApplications from "../pages/LoanApplications/LoanApplications";
import { fetchBranchLoans } from "../api/branchLoansApi";

vi.mock("../api/branchLoansApi", () => ({
  fetchBranchLoans: vi.fn(),
}));

vi.mock("../pages/loans/LoanReview", () => ({
  default: ({ loanId }) => <div data-testid="loan-review">Review {loanId}</div>,
}));

const mockLoans = [
  {
    loanId: "LN-10",
    loanType: "PERSONAL",
    applicantName: "Asha",
    email: "asha@example.com",
    loanAmount: 50000,
    status: "APPLIED",
  },
  {
    loanId: "LN-20",
    loanType: "VEHICLE",
    applicantName: "Rohit",
    email: "rohit@example.com",
    loanAmount: 120000,
    status: "BRANCH_APPROVED",
  },
];

describe("LoanApplications", () => {
  beforeEach(() => {
    localStorage.setItem(
      "adminAuth",
      JSON.stringify({ roles: ["BRANCH_MANAGER"] })
    );
    localStorage.setItem("token", "jwt");
  });

  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  test("renders loans and opens review modal", async () => {
    fetchBranchLoans.mockResolvedValueOnce({
      content: mockLoans,
      page: 0,
      totalPages: 1,
      first: true,
      last: true,
    });

    renderWithQuery(<LoanApplications />);

    expect(await screen.findByText("LN-10")).toBeInTheDocument();

    await userEvent.click(screen.getAllByRole("button", { name: "Review" })[0]);
    expect(screen.getByTestId("loan-review")).toHaveTextContent("Review LN-10");
  });
});
