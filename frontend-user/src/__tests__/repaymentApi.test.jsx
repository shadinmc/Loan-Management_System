/* eslint-env vitest */
import { describe, test, expect, vi, afterEach } from "vitest";
import axiosInstance from "../api/axiosInstance";
import { getOtsQuote, payEmi } from "../api/repaymentApi";

vi.mock("../api/axiosInstance", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe("repaymentApi", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test("getOtsQuote normalizes response", async () => {
    axiosInstance.get.mockResolvedValueOnce({
      data: { data: { settlementAmount: "1000", remainingMonths: "5" } },
    });
    const result = await getOtsQuote("LN-1");
    expect(result.settlementAmount).toBe(1000);
    expect(result.remainingMonths).toBe(5);
  });

  test("payEmi posts amount", async () => {
    axiosInstance.post.mockResolvedValueOnce({ data: { success: true } });
    const result = await payEmi("LN-1", 500);
    expect(axiosInstance.post).toHaveBeenCalledWith("/repayments/LN-1/pay", {
      amount: 500,
    });
    expect(result).toEqual({ success: true });
  });
});
