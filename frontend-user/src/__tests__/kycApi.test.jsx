/* eslint-env vitest */
import { describe, test, expect, vi, afterEach } from "vitest";
import axiosInstance from "../api/axiosInstance";
import { submitKyc, getMyKyc } from "../api/kycApi";

vi.mock("../api/axiosInstance", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe("kycApi", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test("submitKyc posts payload with idempotency header", async () => {
    axiosInstance.post.mockResolvedValueOnce({ data: { success: true } });
    const payload = { panNumber: "ABCDE1234F" };
    const result = await submitKyc(payload, "idem-key");
    expect(axiosInstance.post).toHaveBeenCalledWith("/kyc", payload, {
      headers: { "X-Idempotency-Key": "idem-key" },
    });
    expect(result).toEqual({ success: true });
  });

  test("getMyKyc calls endpoint", async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: { status: "PENDING" } });
    const result = await getMyKyc();
    expect(axiosInstance.get).toHaveBeenCalledWith("/kyc/me");
    expect(result).toEqual({ status: "PENDING" });
  });
});
