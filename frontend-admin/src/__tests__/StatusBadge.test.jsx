/* eslint-env vitest */
import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import StatusBadge from "../components/StatusBadge";

describe("StatusBadge", () => {
  test("renders mapped label", () => {
    render(<StatusBadge status="BRANCH_APPROVED" />);
    expect(screen.getByText("Branch Approved")).toBeInTheDocument();
  });

  test("renders fallback label", () => {
    render(<StatusBadge status="CUSTOM_STATUS" />);
    expect(screen.getByText("CUSTOM STATUS")).toBeInTheDocument();
  });
});
