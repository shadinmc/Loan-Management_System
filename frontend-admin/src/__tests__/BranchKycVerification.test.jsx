/* eslint-env vitest */
import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithQuery } from "../test/testUtils";
import BranchKycVerification from "../pages/KycVerification/BranchKycVerification";
import { fetchManagerKycs, submitManagerKycDecision } from "../api/branchKycApi";

vi.mock("../api/branchKycApi", () => ({
  fetchManagerKycs: vi.fn(),
  submitManagerKycDecision: vi.fn(),
}));

describe("BranchKycVerification", () => {
  beforeEach(() => {
    localStorage.setItem("token", "jwt");
    localStorage.setItem("adminAuth", JSON.stringify({ roles: ["BRANCH_MANAGER"] }));
  });

  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  test("opens review modal and approves KYC", async () => {
    fetchManagerKycs.mockResolvedValueOnce([
      {
        userId: "U1",
        fullName: "Ava",
        email: "ava@example.com",
        status: "PENDING",
        documents: [],
      },
    ]);
    submitManagerKycDecision.mockResolvedValueOnce({ status: "VERIFIED" });

    renderWithQuery(<BranchKycVerification />);

    expect(await screen.findByText("Ava")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Review" }));
    await userEvent.click(screen.getByRole("button", { name: "Approve" }));

    expect(submitManagerKycDecision).toHaveBeenCalledWith("U1", {
      approved: true,
      rejectionReason: null,
    });
  });

  test("reject requires reason", async () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    fetchManagerKycs.mockResolvedValueOnce([
      {
        userId: "U1",
        fullName: "Ava",
        email: "ava@example.com",
        status: "PENDING",
        documents: [],
      },
    ]);

    renderWithQuery(<BranchKycVerification />);

    expect(await screen.findByText("Ava")).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "Review" }));
    await userEvent.click(screen.getByRole("button", { name: "Reject" }));
    await userEvent.click(screen.getByRole("button", { name: "Submit Rejection" }));

    expect(alertSpy).toHaveBeenCalledWith("Rejection reason is required");
    alertSpy.mockRestore();
  });
});
