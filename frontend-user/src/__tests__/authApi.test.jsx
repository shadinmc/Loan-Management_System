/* eslint-env vitest */
import { describe, test, expect, vi, afterEach, beforeEach } from "vitest";

vi.mock("axios", () => ({
  default: {
    create: vi.fn(),
  },
}));

vi.mock("../api/axiosInstance", () => ({
  default: {
    get: vi.fn(),
  },
}));

describe("authApi", () => {
  let axios;

  beforeEach(async () => {
    axios = (await import("axios")).default;
  });

  afterEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  test("login stores token and user", async () => {
    vi.resetModules();
    const postMock = vi.fn().mockResolvedValueOnce({
      data: {
        token: "jwt",
        userId: "U1",
        username: "user1",
        email: "u@example.com",
        fullName: "User One",
        phone: "9999999999",
        dateOfBirth: "2000-01-01",
        roles: ["USER"],
      },
    });
    axios.create.mockReturnValue({ post: postMock });
    const { login } = await import("../api/authApi");
    const result = await login({ email: "u@example.com", password: "pass" });

    expect(result.token).toBe("jwt");
    expect(localStorage.getItem("token")).toBe("jwt");
    expect(JSON.parse(localStorage.getItem("user")).email).toBe("u@example.com");
  });

  test("signup stores token and user", async () => {
    vi.resetModules();
    const postMock = vi.fn().mockResolvedValueOnce({
      data: {
        token: "jwt2",
        userId: "U2",
        username: "user2",
        email: "u2@example.com",
        roles: ["USER"],
      },
    });
    axios.create.mockReturnValue({ post: postMock });
    const { signup } = await import("../api/authApi");
    const result = await signup({
      username: "user2",
      email: "u2@example.com",
      password: "pass",
      fullName: "User Two",
      phone: "9999999999",
      dob: "2000-01-01",
    });

    expect(result.token).toBe("jwt2");
    expect(localStorage.getItem("token")).toBe("jwt2");
  });
});
