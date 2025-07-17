import { describe, it, expect } from "vitest";
import { tiptapWatermark } from "../../extensions/tiptapWatermark";

describe("TipTap watermark overlay", () => {
  it("creates extension", () => {
    const ext = tiptapWatermark();
    expect(ext.name).toBe("watermark");
  });
});
