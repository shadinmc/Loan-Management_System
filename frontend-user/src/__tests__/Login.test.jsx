/* eslint-env vitest */
import { describe, test, expect, vi, afterEach } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import Login from "../pages/auth/Login";

const loginMock = vi.hoisted(() => vi.fn());
const navigateMock = vi.hoisted(() => vi.fn());
const setAuthUserMock = vi.hoisted(() => vi.fn());

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
    useLocation: () => ({ state: { from: { pathname: "/dashboard" } } }),
  };
});

vi.mock("../api/authApi", () => ({
  login: loginMock,
}));

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({ login: setAuthUserMock }),
}));

describe("Login", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test("submits login and navigates", async () => {
    loginMock.mockResolvedValueOnce({
      userId: "U1",
      username: "user1",
      email: "u@example.com",
      token: "jwt",
      roles: ["USER"],
    });

    const { container } = render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "u@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "pass123" },
    });
    fireEvent.submit(container.querySelector("form"));

    await waitFor(() => {
      expect(loginMock).toHaveBeenCalledWith({ email: "u@example.com", password: "pass123" });
      expect(setAuthUserMock).toHaveBeenCalled();
      expect(navigateMock).toHaveBeenCalledWith("/dashboard", { replace: true });
    });
  });

  test("shows error on login failure", async () => {
    loginMock.mockRejectedValueOnce(new Error("Login failed"));
    const { container } = render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );

    fireEvent.change(screen.getByPlaceholderText("Enter your email"), {
      target: { value: "u@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter your password"), {
      target: { value: "pass123" },
    });
    fireEvent.submit(container.querySelector("form"));

    expect(await screen.findByRole("alert")).toHaveTextContent("Login failed");
  });
});
