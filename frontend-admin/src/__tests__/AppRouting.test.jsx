/* eslint-env vitest */
import { describe, test, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import App from "../App";
import { getCurrentUser } from "../utils/auth";

vi.mock("../utils/auth", () => ({
  getCurrentUser: vi.fn(),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    BrowserRouter: ({ children }) => <actual.MemoryRouter>{children}</actual.MemoryRouter>,
  };
});

vi.mock("../pages/auth/AdminLogin", () => ({
  default: () => <div>AdminLoginPage</div>,
}));

vi.mock("../routes/AdminRoutes", () => ({
  default: () => <div>AdminRoutesPage</div>,
}));

vi.mock("../routes/RegionalRoutes", () => ({
  default: () => <div>RegionalRoutesPage</div>,
}));

describe("App routing", () => {
  test("redirects to login when no user", async () => {
    getCurrentUser.mockReturnValueOnce(null);
    render(<App />);

    expect(await screen.findByText("AdminLoginPage")).toBeInTheDocument();
  });

  test("redirects to admin dashboard for branch manager", async () => {
    getCurrentUser.mockReturnValueOnce({ role: "BRANCH_MANAGER" });
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("AdminRoutesPage")).toBeInTheDocument();
    });
  });

  test("redirects to regional dashboard for regional manager", async () => {
    getCurrentUser.mockReturnValueOnce({ role: "REGIONAL_MANAGER" });
    render(<App />);

    await waitFor(() => {
      expect(screen.getByText("RegionalRoutesPage")).toBeInTheDocument();
    });
  });
});
