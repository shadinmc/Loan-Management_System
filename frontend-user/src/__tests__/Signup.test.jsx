/* eslint-env vitest */
import { describe, test, expect, vi, afterEach, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";

vi.mock("../api/authApi", () => ({
  signup: vi.fn(),
}));

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({ login: vi.fn() }),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => vi.fn(),
  };
});

describe("Signup", () => {
  beforeEach(() => {
    vi.resetModules();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test("shows validation error on empty step 1", async () => {
    const { default: Signup } = await import("../pages/auth/Signup");
    render(
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    );
    const user = userEvent.setup({ pointerEventsCheck: 0 });
    await user.click(screen.getByText("Continue").closest("button"));
    expect(await screen.findByText("Username is required")).toBeInTheDocument();
  });
});
