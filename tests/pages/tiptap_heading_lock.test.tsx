import { describe, it, expect } from "vitest";
import { tiptapHeadingLock } from "../../extensions/tiptapHeadingLock";

describe("TipTap heading lock", () => {
  it("creates extension", () => {
    const ext = tiptapHeadingLock();
    expect(ext.name).toBe("heading-lock");
  });
});
