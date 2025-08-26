import { describe, it, expect } from "vitest";
import assert from "node:assert/strict";
import { sanitizeHtml } from "../../utils/sanitize.js";

describe("sanitizeHtml", () => {
  it("removes script tags and event handlers", () => {
    const dirty = '<div onclick="alert(1)"><script>alert(2)</script>Hi</div>';
    const clean = sanitizeHtml(dirty);
    assert.strictEqual(clean, "<div>Hi</div>");
  });

  it("strips javascript and data URLs", () => {
    const dirty =
      '<a href="javascript:alert(1)" src="data:text/html;base64,AAAA">link</a>';
    const clean = sanitizeHtml(dirty);
    assert.strictEqual(clean, "<a>link</a>");
  });

  it("blocks other dangerous schemes like vbscript", () => {
    const dirty = '<a href="vbscript:evil">x</a>';
    const clean = sanitizeHtml(dirty);
    assert.strictEqual(clean, "<a>x</a>");
  });

  it("removes dangerous CSS expressions", () => {
    const dirty =
      '<div style="color:red; width:expression(alert(1)); background:url(javascript:evil)">x</div>';
    const clean = sanitizeHtml(dirty);
    assert.strictEqual(clean, "<div>x</div>");
  });
});
