/* eslint-env vitest */
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import RegionalLoanApplications from "../pages/LoanApplications/RegionalLoanApplications";
import { fetchRegionalPendingLoans } from "../api/regionalLoansApi";

vi.mock("../api/regionalLoansApi", () => ({
  fetchRegionalPendingLoans: vi.fn(),
}));

vi.mock("../pages/loans/RegionalLoanReview", () => ({
  default: ({ loan }) => (
    <div data-testid="regional-review">Reviewing {loan.loanId}</div>
  ),
}));

const renderWithQuery = (ui) => {
  const client = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  return render(
    <QueryClientProvider client={client}>{ui}</QueryClientProvider>
  );
};

const mockLoans = [
  {
    loanId: "LN-1001",
    loanType: "PERSONAL",
    fullName: "Ava Patel",
    email: "ava@example.com",
    approvedAmount: 120000,
    status: "BRANCH_APPROVED",
  },
  {
    loanId: "LN-2002",
    loanType: "VEHICLE",
    fullName: "Ravi Kumar",
    email: "ravi@example.com",
    approvedAmount: 300000,
    status: "UNDER_REGIONAL_REVIEW",
  },
];

describe("RegionalLoanApplications", () => {
  beforeEach(() => {
    localStorage.setItem("token", "test-token");
  });

  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  test("renders loans and opens review modal", async () => {
    fetchRegionalPendingLoans.mockResolvedValueOnce({
      content: mockLoans,
      page: 0,
      totalPages: 1,
      first: true,
      last: true,
    });

    renderWithQuery(<RegionalLoanApplications />);

    expect(await screen.findByText("LN-1001")).toBeInTheDocument();
    expect(screen.getByText("LN-2002")).toBeInTheDocument();

    await userEvent.click(screen.getAllByRole("button", { name: "Review" })[0]);
    expect(screen.getByTestId("regional-review")).toHaveTextContent(
      "Reviewing LN-1001"
    );
  });

  test("filters by loan type selection", async () => {
    fetchRegionalPendingLoans.mockResolvedValueOnce({
      content: mockLoans,
      page: 0,
      totalPages: 1,
      first: true,
      last: true,
    });

    renderWithQuery(<RegionalLoanApplications />);

    expect(await screen.findByText("LN-1001")).toBeInTheDocument();

    await userEvent.click(screen.getByText("Vehicle (1)"));
    expect(screen.queryByText("LN-1001")).not.toBeInTheDocument();
    expect(screen.getByText("LN-2002")).toBeInTheDocument();
  });
});
