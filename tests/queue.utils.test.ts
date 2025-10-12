import { describe, expect, test } from "bun:test";

import { ensureMessageId } from "../src/lib/queue";

describe("ensureMessageId", () => {
  test("generates an id when missing", () => {
    const message = ensureMessageId({ payload: { foo: "bar" } });
    expect(message.id).toBeDefined();
    expect(typeof message.id).toBe("string");
  });

  test("preserves existing id", () => {
    const message = ensureMessageId({
      id: "custom-id",
      payload: { foo: "bar" },
    });
    expect(message.id).toBe("custom-id");
  });
});
