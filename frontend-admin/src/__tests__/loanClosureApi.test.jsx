/* eslint-env vitest */
import { describe, test, expect, vi, afterEach } from "vitest";
import { getManagerLoanClosures, closeLoanByManager } from "../api/loanClosureApi";
import api from "../api/axios";

vi.mock("../api/axios", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
  },
}));

describe("loanClosureApi", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test("getManagerLoanClosures calls endpoint with params", async () => {
    api.get.mockResolvedValueOnce({ data: { content: [] } });

    const result = await getManagerLoanClosures({ page: 0, size: 10 });

    expect(api.get).toHaveBeenCalledWith("/manager/loan-closure", {
      params: { page: 0, size: 10 },
    });
    expect(result).toEqual({ content: [] });
  });

  test("closeLoanByManager posts to close endpoint", async () => {
    api.post.mockResolvedValueOnce({ data: { status: "CLOSED" } });

    const result = await closeLoanByManager("LN-1");

    expect(api.post).toHaveBeenCalledWith("/manager/loan-closure/LN-1/close");
    expect(result).toEqual({ status: "CLOSED" });
  });
});
