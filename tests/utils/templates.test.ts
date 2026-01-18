import { describe, it } from "vitest";
import assert from "node:assert/strict";
import { TEMPLATES } from "../../utils/templates.js";

describe("TEMPLATES", () => {
  it("includes known templates", () => {
    const labels = TEMPLATES.map((tpl) => tpl.label);
    assert.deepStrictEqual(labels, [
      "FAA Advisory Circular",
      "Software Release Notes",
      "Medical Research Article",
      "Legal Contract Template",
    ]);
  });

  it("uses unique filenames", () => {
    const filenames = TEMPLATES.map((tpl) => tpl.filename);
    const unique = new Set(filenames);
    assert.strictEqual(unique.size, filenames.length);
  });

  it("keeps label and filename values non-empty", () => {
    for (const tpl of TEMPLATES) {
      assert.ok(tpl.label.trim().length > 0);
      assert.ok(tpl.filename.trim().length > 0);
    }
  });

  it("uses html files for templates", () => {
    for (const tpl of TEMPLATES) {
      assert.ok(tpl.filename.endsWith(".html"));
    }
  });
});
