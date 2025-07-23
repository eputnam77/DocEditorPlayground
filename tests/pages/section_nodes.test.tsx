import { describe, it, expect } from "vitest";
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { tiptapSectionNode } from "../../extensions/tiptapSectionNode";

describe("TipTap section nodes", () => {
  it("creates extension", () => {
    const ext = tiptapSectionNode();
    expect(ext.name).toBe("section-node");
  });

  it("constructs editor without schema errors", () => {
    expect(() => {
      new Editor({ extensions: [StarterKit, tiptapSectionNode()] });
    }).not.toThrow();
  });
});
