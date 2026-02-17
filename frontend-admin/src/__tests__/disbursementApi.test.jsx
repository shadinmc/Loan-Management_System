/* eslint-env vitest */
import { describe, test, expect, vi, afterEach } from "vitest";
import { getDisbursements } from "../api/disbursementApi";
import api from "../api/axios";

vi.mock("../api/axios", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("disbursementApi", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test("getDisbursements calls endpoint with params", async () => {
    api.get.mockResolvedValueOnce({ data: { content: [] } });

    const result = await getDisbursements({ page: 1, size: 20 });

    expect(api.get).toHaveBeenCalledWith("/disbursements", {
      params: { page: 1, size: 20 },
    });
    expect(result).toEqual({ content: [] });
  });
});
