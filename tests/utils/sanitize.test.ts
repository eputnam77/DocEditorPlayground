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

  it("blocks javascript URLs with internal whitespace", () => {
    const dirty = '<a href="javascript\t:alert(1)">x</a>';
    const clean = sanitizeHtml(dirty);
    assert.strictEqual(clean, "<a>x</a>");
  });

  it("strips schemes split by whitespace", () => {
    const dirty = '<a href="java\nscript:alert(1)">x</a>';
    const clean = sanitizeHtml(dirty);
    assert.strictEqual(clean, "<a>x</a>");
  });

  it("removes quoted javascript urls in style attributes", () => {
    const dirty =
      '<div style="background:url(\'javascript:evil\')">x</div>';
    const clean = sanitizeHtml(dirty);
    assert.strictEqual(clean, "<div>x</div>");
  });

  it("removes dangerous srcset entries", () => {
    const dirty = '<img srcset="javascript:alert(1) 1x, http://e/x.png 2x">';
    const clean = sanitizeHtml(dirty);
    assert.strictEqual(clean, "<img>");
  });

  it("removes xlink:href attributes with dangerous schemes", () => {
    const dirty = '<svg><a xlink:href="javascript:alert(1)">x</a></svg>';
    const clean = sanitizeHtml(dirty);
    assert.strictEqual(clean.includes("xlink:href"), false);
    assert.strictEqual(clean.includes("javascript"), false);
  });

  it("removes iframe elements", () => {
    const dirty = '<iframe src="http://example.com" onload="alert(1)"></iframe>';
    const clean = sanitizeHtml(dirty);
    assert.strictEqual(clean, "");
  });
});
