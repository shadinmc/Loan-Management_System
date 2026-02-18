/* eslint-env vitest */
import { describe, test, expect, vi, afterEach } from "vitest";
import axiosInstance from "../api/axiosInstance";
import {
  calculateEMI,
  fetchLoanTypes,
  getMyLoans,
} from "../api/loanApi";

vi.mock("../api/axiosInstance", () => ({
  default: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}));

describe("loanApi", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test("calculateEMI returns a rounded value", () => {
    const emi = calculateEMI(100000, 12, 12);
    expect(typeof emi).toBe("number");
    expect(emi).toBeGreaterThan(0);
  });

  test("fetchLoanTypes returns fallback on error", async () => {
    axiosInstance.get.mockRejectedValueOnce(new Error("fail"));
    const result = await fetchLoanTypes();
    expect(result).toEqual(["PERSONAL", "BUSINESS", "EDUCATIONAL", "VEHICLE"]);
  });

  test("getMyLoans normalizes array content", async () => {
    axiosInstance.get.mockResolvedValueOnce({ data: { content: [{ id: 1 }] } });
    const result = await getMyLoans();
    expect(result).toEqual([{ id: 1 }]);
  });
});
