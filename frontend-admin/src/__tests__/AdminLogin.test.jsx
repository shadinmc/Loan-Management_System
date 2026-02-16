/* eslint-env vitest */
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AdminLogin from "../pages/auth/AdminLogin";
import { adminLogin } from "../api/authApi";

const navigateMock = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

vi.mock("../api/authApi", () => ({
  adminLogin: vi.fn(),
}));

describe("AdminLogin", () => {
  beforeEach(() => {
    localStorage.setItem("adminAuth", JSON.stringify({ token: "stale" }));
    localStorage.setItem("token", "stale-token");
  });

  afterEach(() => {
    localStorage.clear();
    navigateMock.mockReset();
    vi.clearAllMocks();
  });

  test("clears previous session on mount", async () => {
    render(<AdminLogin />);
    await waitFor(() => {
      expect(localStorage.getItem("adminAuth")).toBeNull();
      expect(localStorage.getItem("token")).toBeNull();
    });
  });

  test("logs in branch manager and navigates to admin dashboard", async () => {
    adminLogin.mockResolvedValueOnce({
      token: "jwt",
      roles: ["BRANCH_MANAGER"],
    });
    render(<AdminLogin />);

    await userEvent.type(
      screen.getByPlaceholderText("Enter email"),
      "admin@example.com"
    );
    await userEvent.type(
      screen.getByPlaceholderText("Enter password"),
      "pass123"
    );
    await userEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(adminLogin).toHaveBeenCalledWith({
        usernameOrEmail: "admin@example.com",
        password: "pass123",
      });
      expect(navigateMock).toHaveBeenCalledWith("/admin/dashboard");
      expect(localStorage.getItem("token")).toBe("jwt");
    });
  });

  test("logs in regional manager and navigates to regional dashboard", async () => {
    adminLogin.mockResolvedValueOnce({
      token: "jwt",
      roles: ["REGIONAL_MANAGER"],
    });
    render(<AdminLogin />);

    await userEvent.type(
      screen.getByPlaceholderText("Enter email"),
      "regional@example.com"
    );
    await userEvent.type(
      screen.getByPlaceholderText("Enter password"),
      "pass123"
    );
    await userEvent.click(screen.getByRole("button", { name: "Login" }));

    await waitFor(() => {
      expect(navigateMock).toHaveBeenCalledWith("/regional/dashboard");
    });
  });

  test("shows error on login failure", async () => {
    adminLogin.mockRejectedValueOnce({
      response: { data: { message: "Invalid credentials" } },
    });
    render(<AdminLogin />);

    await userEvent.type(
      screen.getByPlaceholderText("Enter email"),
      "bad@example.com"
    );
    await userEvent.type(
      screen.getByPlaceholderText("Enter password"),
      "bad"
    );
    await userEvent.click(screen.getByRole("button", { name: "Login" }));

    expect(await screen.findByText("Invalid credentials")).toBeInTheDocument();
  });
});
