import { describe, it, expect } from "vitest";
import { isValidStructure } from "../../extensions/tiptapStructure";

describe("TipTap heading structure", () => {
  it("detects consecutive headings", () => {
    expect(isValidStructure("<h1>a</h1><h2>b</h2>")).toBe(false);
    expect(isValidStructure("<h1>a</h1><p>p</p>")).toBe(true);
  });
});
