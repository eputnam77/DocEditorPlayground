import { describe, it, expect } from "vitest";
import { tiptapMarkReview } from "../../extensions/tiptapMarkReview";

describe("TipTap MarkReview", () => {
  it("creates extension", () => {
    const ext = tiptapMarkReview();
    expect(ext.name).toBe("mark-review");
  });
});
