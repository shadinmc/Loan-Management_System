/* eslint-env vitest */
import { describe, test, expect, vi, afterEach } from "vitest";
import ProtectedRoute from "../components/ProtectedRoute";
import { render } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import { isAuthenticated } from "../api/authApi";

vi.mock("../api/authApi", () => ({
  isAuthenticated: vi.fn(),
}));

const Protected = () => <div>Protected Content</div>;

describe("ProtectedRoute", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test("redirects to login when unauthenticated", () => {
    isAuthenticated.mockReturnValueOnce(false);
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Protected />} />
          </Route>
          <Route path="/login" element={<div>Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );
    expect(document.body.textContent).toContain("Login Page");
  });

  test("renders outlet when authenticated", () => {
    isAuthenticated.mockReturnValueOnce(true);
    render(
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Protected />} />
          </Route>
        </Routes>
      </MemoryRouter>
    );
    expect(document.body.textContent).toContain("Protected Content");
  });
});
