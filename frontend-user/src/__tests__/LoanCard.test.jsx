/* eslint-env vitest */
import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LoanCard from "../components/LoanCard";
import { isAuthenticated } from "../api/authApi";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("../api/authApi", () => ({
  isAuthenticated: vi.fn(),
}));

const loan = {
  id: "personal",
  name: "Personal Loan",
  interestRate: "8.5%",
  maxAmount: 500000,
  minTenure: 12,
  maxTenure: 60,
  features: ["Fast approval", "Low EMI", "Flexible tenure"],
};

describe("LoanCard", () => {
  test("navigates to login when not authenticated", async () => {
    isAuthenticated.mockReturnValueOnce(false);
    render(<LoanCard loan={loan} index={0} />);
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    await user.click(screen.getByRole("button", { name: /Apply Now/i }));
    expect(navigateMock).toHaveBeenCalledWith("/login");
  });

  test("navigates to apply page when authenticated", async () => {
    isAuthenticated.mockReturnValueOnce(true);
    render(<LoanCard loan={loan} index={0} />);
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    await user.click(screen.getByRole("button", { name: /Apply Now/i }));
    expect(navigateMock).toHaveBeenCalledWith("/loan/apply/personal");
  });
});
