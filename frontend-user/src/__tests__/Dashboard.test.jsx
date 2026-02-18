/* eslint-env vitest */
import { describe, test, expect, vi, afterEach, beforeEach } from "vitest";
import { screen } from "@testing-library/react";
import Dashboard from "../pages/dashboard/Dashboard";
import { renderWithQuery } from "../test/testUtils";
import { getMyLoans } from "../api/loanApi";

vi.mock("../api/loanApi", () => ({
  getMyLoans: vi.fn(),
}));

vi.mock("../hooks/useAuth", () => ({
  useAuth: () => ({ user: { username: "Ava" } }),
}));

describe("Dashboard", () => {
  beforeEach(() => {
    localStorage.setItem("token", "jwt");
  });

  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  test("renders empty state when no loans", async () => {
    getMyLoans.mockResolvedValueOnce([]);
    renderWithQuery(<Dashboard />);

    expect(await screen.findByText("No applications yet")).toBeInTheDocument();
  });
});
