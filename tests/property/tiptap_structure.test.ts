import { describe, it } from "vitest";
import assert from "node:assert/strict";
import { tiptapStructure, isValidStructure } from "../../extensions/tiptapStructure.js";

describe("TipTap heading structure", () => {
  it("detects consecutive headings", () => {
    assert.strictEqual(isValidStructure("<h1>a</h1><h2>b</h2>"), false);
    assert.strictEqual(isValidStructure("<h1>a</h1><p>p</p>"), true);
    assert.strictEqual(
      isValidStructure("<h1>a</h1><blockquote>b</blockquote>"),
      false,
    );
  });

  it("plugin filterTransaction enforces rules", () => {
    const plugin = (tiptapStructure() as any).config.addProseMirrorPlugins()[0];
    const filter = plugin.spec.filterTransaction as (tr: any) => boolean;
    const badDoc = {
      childCount: 2,
      child(i: number) {
        return [
          { type: { name: "heading" } },
          { type: { name: "heading" } },
        ][i];
      },
    };
    assert.strictEqual(filter({ doc: badDoc, docChanged: true } as any), false);
    const goodDoc = {
      childCount: 2,
      child(i: number) {
        return [
          { type: { name: "heading" } },
          { type: { name: "paragraph" } },
        ][i];
      },
    };
    assert.strictEqual(filter({ doc: goodDoc, docChanged: true } as any), true);
  });
});
