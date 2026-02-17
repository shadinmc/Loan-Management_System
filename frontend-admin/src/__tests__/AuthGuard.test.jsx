/* eslint-env vitest */
import { describe, test, expect, vi, afterEach } from "vitest";
import AuthGuard from "../utils/AuthGuard";
import { renderWithRouter } from "../test/testUtils";
import { getCurrentUser } from "../utils/auth";

vi.mock("../utils/auth", () => ({
  getCurrentUser: vi.fn(),
}));

const Protected = () => <div>Protected Content</div>;

describe("AuthGuard", () => {
  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  test("redirects to login when not authenticated", () => {
    getCurrentUser.mockReturnValueOnce(null);
    localStorage.removeItem("token");

    renderWithRouter(
      <AuthGuard role="BRANCH_MANAGER">
        <Protected />
      </AuthGuard>,
      { route: "/admin/dashboard", path: "/admin/dashboard" }
    );

    expect(document.body.textContent).toContain("Login Page");
  });

  test("redirects to role dashboard when role mismatch", () => {
    getCurrentUser.mockReturnValueOnce({ roles: ["REGIONAL_MANAGER"] });
    localStorage.setItem("token", "jwt");

    renderWithRouter(
      <AuthGuard role="BRANCH_MANAGER">
        <Protected />
      </AuthGuard>,
      { route: "/admin/dashboard", path: "/admin/dashboard" }
    );

    expect(document.body.textContent).toContain("Regional Dashboard");
  });

  test("renders children when authorized", () => {
    getCurrentUser.mockReturnValueOnce({ roles: ["BRANCH_MANAGER"] });
    localStorage.setItem("token", "jwt");

    renderWithRouter(
      <AuthGuard role="BRANCH_MANAGER">
        <Protected />
      </AuthGuard>,
      { route: "/admin/dashboard", path: "/admin/dashboard" }
    );

    expect(document.body.textContent).toContain("Protected Content");
  });
});
