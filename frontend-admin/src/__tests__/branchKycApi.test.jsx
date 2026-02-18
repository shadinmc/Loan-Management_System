/* eslint-env vitest */
import { describe, test, expect, vi, afterEach } from "vitest";
import {
  fetchManagerKycs,
  submitManagerKycDecision,
} from "../api/branchKycApi";
import api from "../api/axios";

vi.mock("../api/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe("branchKycApi", () => {
  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  test("fetchManagerKycs calls manager endpoint", async () => {
    api.get.mockResolvedValueOnce({ data: [] });

    await fetchManagerKycs();

    expect(api.get).toHaveBeenCalledWith("/manager/kyc");
  });

  test("submitManagerKycDecision posts decision", async () => {
    api.post.mockResolvedValueOnce({ data: { status: "VERIFIED" } });

    const result = await submitManagerKycDecision("U1", { approved: true });

    expect(api.post).toHaveBeenCalledWith("/manager/kyc/U1/decision", { approved: true });
    expect(result).toEqual({ status: "VERIFIED" });
  });
});
