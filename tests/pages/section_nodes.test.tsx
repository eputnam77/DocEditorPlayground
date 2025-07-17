import { describe, it, expect } from "vitest";
import { tiptapSectionNode } from "../../extensions/tiptapSectionNode";

describe("TipTap section nodes", () => {
  it("creates extension", () => {
    const ext = tiptapSectionNode();
    expect(ext.name).toBe("section-node");
  });
});
