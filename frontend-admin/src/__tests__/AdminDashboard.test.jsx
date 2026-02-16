/* eslint-env vitest */
import { describe, test, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import { fetchBranchLoans } from "../api/branchLoansApi";

vi.mock("../api/branchLoansApi", () => ({
  fetchBranchLoans: vi.fn(),
}));

const mockLoans = [
  { loanId: "L1", status: "UNDER_BRANCH_REVIEW", loanType: "PERSONAL", createdAt: "2025-01-01" },
  { loanId: "L2", status: "BRANCH_APPROVED", loanType: "VEHICLE", createdAt: "2025-01-02" },
  { loanId: "L3", status: "BRANCH_REJECTED", loanType: "BUSINESS", createdAt: "2025-01-03" },
  { loanId: "L4", status: "ACTIVE", loanType: "EDUCATION", createdAt: "2025-01-04" },
];

describe("AdminDashboard", () => {
  test("shows loading then renders KPI counts", async () => {
    fetchBranchLoans.mockResolvedValueOnce({ content: mockLoans });

    render(
      <MemoryRouter>
        <AdminDashboard />
      </MemoryRouter>
    );
    expect(screen.getByText("Loading dashboard...")).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText("Branch Manager Dashboard")).toBeInTheDocument();
    });

    expect(screen.getByText("Pending Review")).toBeInTheDocument();
    expect(screen.getByText("Branch Approved")).toBeInTheDocument();
    expect(screen.getByText("Branch Rejected")).toBeInTheDocument();
    expect(screen.getByText("Active Loans")).toBeInTheDocument();
  });
});
