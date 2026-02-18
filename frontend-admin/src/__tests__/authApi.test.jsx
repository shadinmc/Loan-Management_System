/* eslint-env vitest */
import { describe, test, expect, vi, afterEach } from "vitest";
import { adminLogin } from "../api/authApi";
import api from "../api/axios";

vi.mock("../api/axios", () => ({
  default: {
    post: vi.fn(),
  },
}));

describe("authApi", () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  test("adminLogin posts credentials", async () => {
    api.post.mockResolvedValueOnce({ data: { token: "jwt" } });
    const payload = { usernameOrEmail: "a@b.com", password: "pass" };

    const result = await adminLogin(payload);

    expect(api.post).toHaveBeenCalledWith("/auth/login", payload);
    expect(result).toEqual({ token: "jwt" });
  });
});
