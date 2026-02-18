/* eslint-env vitest */
import { describe, test, expect, afterEach } from "vitest";
import { getLoanStatus, getAllApplicationStatus } from "../api/decisionApi";

describe("decisionApi", () => {
  afterEach(() => {
    localStorage.clear();
  });

  test("getLoanStatus returns matching application", async () => {
    localStorage.setItem(
      "loanApplications",
      JSON.stringify([{ applicationId: "APP-1", status: "SUBMITTED" }])
    );
    const result = await getLoanStatus("APP-1");
    expect(result.success).toBe(true);
    expect(result.data.applicationId).toBe("APP-1");
  });

  test("getAllApplicationStatus enriches status history", async () => {
    localStorage.setItem(
      "loanApplications",
      JSON.stringify([{ applicationId: "APP-2", appliedDate: "2024-01-01" }])
    );
    const result = await getAllApplicationStatus();
    expect(result[0].statusHistory.length).toBeGreaterThan(0);
  });
});
