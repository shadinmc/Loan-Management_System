/* eslint-env vitest */
import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Navbar from "../components/Navbar";

vi.mock("../context/AuthContext", () => ({
  useAuth: () => ({ user: null, isLoggedIn: false }),
}));

vi.mock("../components/LottieAnimation", () => ({
  default: () => <div>Lottie</div>,
}));

describe("Navbar", () => {
  test("shows login when logged out", () => {
    render(
      <MemoryRouter>
        <Navbar onMenuClick={() => {}} />
      </MemoryRouter>
    );
    expect(screen.getByText("Login")).toBeInTheDocument();
  });
});
