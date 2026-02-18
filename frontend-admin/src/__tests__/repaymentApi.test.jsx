/* eslint-env vitest */
import { describe, test, expect, vi, afterEach } from "vitest";
import { getManagerRepayments, getManagerRepaymentDetail } from "../api/repaymentApi";
import api from "../api/axios";

vi.mock("../api/axios", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("repaymentApi", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test("getManagerRepayments calls endpoint with params", async () => {
    api.get.mockResolvedValueOnce({ data: { content: [] } });

    const result = await getManagerRepayments({ page: 1, size: 25 });

    expect(api.get).toHaveBeenCalledWith("/repayments/manager", {
      params: { page: 1, size: 25 },
    });
    expect(result).toEqual({ content: [] });
  });

  test("getManagerRepaymentDetail calls detail endpoint", async () => {
    api.get.mockResolvedValueOnce({ data: { loanId: "LN-2" } });

    const result = await getManagerRepaymentDetail("LN-2");

    expect(api.get).toHaveBeenCalledWith("/repayments/manager/LN-2");
    expect(result).toEqual({ loanId: "LN-2" });
  });
});
