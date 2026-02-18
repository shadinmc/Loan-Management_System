/* eslint-env vitest */
import { describe, test, expect, vi } from "vitest";
import { screen } from "@testing-library/react";
import LoanTypes from "../pages/loans/LoanTypes";
import { renderWithRouter } from "../test/testUtils";
import { LOAN_CONFIG } from "../utils/constants";

vi.mock("../components/LoanCard", () => ({
  default: ({ loan }) => <div data-testid="loan-card">{loan.name}</div>,
}));

vi.mock("../components/HeroSection", () => ({
  default: () => <div>Hero</div>,
}));

vi.mock("../components/FeatureShowcase", () => ({
  default: () => <div>Showcase</div>,
}));

describe("LoanTypes", () => {
  test("renders loan cards from config", () => {
    renderWithRouter(<LoanTypes />);
    const expectedCount = Object.values(LOAN_CONFIG).length;
    expect(screen.getAllByTestId("loan-card")).toHaveLength(expectedCount);
  });
});
