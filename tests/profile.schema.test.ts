import { describe, expect, test } from "bun:test";

import {
  notificationPreferencesSchema,
  updateProfileSchema,
} from "../src/schemas";

describe("notificationPreferencesSchema", () => {
  test("accepts valid channel configuration", () => {
    const result = notificationPreferencesSchema.parse({
      channels: ["EMAIL", "SMS"],
      upcomingAppointments: { enabled: true },
    });

    expect(result.channels).toEqual(["EMAIL", "SMS"]);
    expect(result.upcomingAppointments.enabled).toBe(true);
  });

  test("rejects empty channels array", () => {
    expect(() =>
      notificationPreferencesSchema.parse({
        channels: [],
        upcomingAppointments: { enabled: true },
      })
    ).toThrow("Array must contain at least 1 element(s)");
  });
});

describe("updateProfileSchema", () => {
  test("allows updating only full name", () => {
    const result = updateProfileSchema.parse({
      fullName: "Updated Name",
    });

    expect(result.fullName).toBe("Updated Name");
  });

  test("allows updating only notification preferences", () => {
    const result = updateProfileSchema.parse({
      notificationPreferences: {
        channels: ["EMAIL"],
        upcomingAppointments: { enabled: false },
      },
    });

    expect(result.notificationPreferences?.channels).toEqual(["EMAIL"]);
    expect(
      result.notificationPreferences?.upcomingAppointments.enabled
    ).toBe(false);
  });

  test("rejects payload with no updatable fields", () => {
    expect(() => updateProfileSchema.parse({})).toThrow(
      "At least one field must be provided"
    );
  });
});
