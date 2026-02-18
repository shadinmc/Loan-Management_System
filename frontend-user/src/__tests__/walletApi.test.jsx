/* eslint-env vitest */
import { describe, test, expect, vi, afterEach } from "vitest";
import axiosInstance from "../api/axiosInstance";
import { getMyWallet, creditWallet } from "../api/walletApi";

vi.mock("../api/axiosInstance", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe("walletApi", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test("getMyWallet calls endpoint", async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: { balance: 100 } });
    const result = await getMyWallet();
    expect(axiosInstance.get).toHaveBeenCalledWith("/wallet/me");
    expect(result).toEqual({ balance: 100 });
  });

  test("creditWallet posts payload", async () => {
    axiosInstance.post.mockResolvedValueOnce({ data: { success: true } });
    const result = await creditWallet("LN-1", 250);
    expect(axiosInstance.post).toHaveBeenCalledWith("/wallet/credit", {
      loanId: "LN-1",
      amount: 250,
    });
    expect(result).toEqual({ success: true });
  });
});
