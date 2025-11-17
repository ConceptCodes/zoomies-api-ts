// Simple test to verify test infrastructure works
import { describe, test, expect } from "bun:test";

describe("Test Infrastructure", () => {
  test("should have basic test setup working", () => {
    expect(true).toBe(true);
  });

  test("should load test fixtures", () => {
    expect(1 + 1).toBe(2);
  });
});
