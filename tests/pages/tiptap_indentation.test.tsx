import { describe, it, expect } from "vitest";
import { tiptapIndentation } from "../../extensions/tiptapIndentation";

describe("TipTap indentation controls", () => {
  it("creates extension", () => {
    const ext = tiptapIndentation();
    expect(ext.name).toBe("indentation");
  });
});
