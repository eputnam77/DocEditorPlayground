import { describe, it, expect } from "vitest";
import assert from "node:assert/strict";
import { JSDOM } from "jsdom";
import { sanitizeHtml, sanitizeNode } from "../../utils/sanitize.js";

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

  it("removes object and embed elements", () => {
    const dirty =
      '<object data="javascript:alert(1)"></object><embed src="javascript:evil"></embed><div>safe</div>';
    const clean = sanitizeHtml(dirty);
    assert.strictEqual(clean, "<div>safe</div>");
  });

  it("strips base elements", () => {
    const dirty = '<base href="javascript:alert(1)"><div>safe</div>';
    const clean = sanitizeHtml(dirty);
    assert.strictEqual(clean, "<div>safe</div>");
  });

  it("strips meta refresh redirects", () => {
    const dirty =
      '<meta http-equiv="refresh" content="0;url=javascript:alert(1)"><div>ok</div>';
    const clean = sanitizeHtml(dirty);
    assert.strictEqual(clean, "<div>ok</div>");
  });

  it("removes meta refresh without URL", () => {
    const dirty = '<meta http-equiv="refresh" content="5"><div>ok</div>';
    const clean = sanitizeHtml(dirty);
    assert.strictEqual(clean, "<div>ok</div>");
  });

  it("removes meta refresh with safe URL", () => {
    const dom = new JSDOM(
      '<meta http-equiv="refresh" content="0;url=/safe"><div>ok</div>',
    );
    sanitizeNode(dom.window.document);
    expect(dom.window.document.querySelector("meta[http-equiv]")).toBeNull();
  });

  it("strips meta refresh with extra whitespace", () => {
    const dirty =
      '<meta http-equiv="  Refresh " content="0;url=javascript:alert(1)"><div>ok</div>';
    const clean = sanitizeHtml(dirty);
    assert.strictEqual(clean, "<div>ok</div>");
  });

  it("removes meta refresh with internal whitespace", () => {
    const dom = new JSDOM(
      '<meta http-equiv="re fres h" content="0;url=javascript:alert(1)"><div>ok</div>',
      { url: "http://localhost" },
    );
    sanitizeNode(dom.window.document);
    expect(dom.window.document.querySelector("meta")).toBeNull();
  });

  it("strips meta refresh added programmatically with spaces", () => {
    const dom = new JSDOM("<div>ok</div>", { url: "http://localhost" });
    const meta = dom.window.document.createElement("meta");
    meta.setAttribute("http-equiv", " Refresh ");
    meta.setAttribute("content", "0;url=javascript:alert(1)");
    dom.window.document.body.prepend(meta);
    sanitizeNode(dom.window.document);
    expect(dom.window.document.querySelector("meta")).toBeNull();
  });

  it("strips dangerous form actions", () => {
    const dirty = '<form action="javascript:alert(1)"><input></form>';
    const clean = sanitizeHtml(dirty);
    assert.strictEqual(clean, '<form><input></form>');
  });

  it("removes formaction attributes", () => {
    const dirty = '<button formaction="javascript:alert(1)">x</button>';
    const clean = sanitizeHtml(dirty);
    assert.strictEqual(clean, '<button>x</button>');
  });

  it("removes background attributes with dangerous URLs", () => {
    const dirty = '<table background="javascript:alert(1)">x</table>';
    const clean = sanitizeHtml(dirty);
    assert.strictEqual(clean.includes("background"), false);
    assert.strictEqual(clean.includes("javascript"), false);
    assert.ok(clean.includes("x"));
  });

  it("strips uppercase event handlers", () => {
    const dirty = '<div ONCLICK="alert(1)">x</div>';
    const clean = sanitizeHtml(dirty);
    assert.strictEqual(clean, '<div>x</div>');
  });

  it("removes javascript URLs split by whitespace in style", () => {
    const dirty =
      '<div style="background:url(java\nscript:alert(1))">x</div>';
    const clean = sanitizeHtml(dirty);
    assert.strictEqual(clean, "<div>x</div>");
  });

  it("sanitizes inside template elements", () => {
    const dirty =
      '<div><template><div onclick="alert(1)"><script>alert(1)</script></div></template></div>';
    const clean = sanitizeHtml(dirty);
    assert.strictEqual(clean, '<div><template><div></div></template></div>');
  });

  it("removes javascript urls in style even with comments", () => {
    const dirty =
      '<div style="background:url(/**/javascript:alert(1))">x</div>';
    const clean = sanitizeHtml(dirty);
    assert.strictEqual(clean, '<div>x</div>');
  });

  it("removes javascript urls containing zero-width characters", () => {
    const dirty = '<a href="java\u200Bscript:alert(1)">x</a>';
    const clean = sanitizeHtml(dirty);
    assert.strictEqual(clean, "<a>x</a>");

    const styleBypass =
      '<div style="background:url(java\u200Bscript:alert(1))">x</div>';
    const cleanStyle = sanitizeHtml(styleBypass);
    assert.strictEqual(cleanStyle, "<div>x</div>");

    const srcsetBypass =
      '<img srcset="java\u200Bscript:alert(1) 1x, https://e/x.png 2x">';
    const cleanSrcset = sanitizeHtml(srcsetBypass);
    assert.strictEqual(cleanSrcset, "<img>");
  });

  it("removes style and link elements", () => {
    const dirty =
      '<style>body{background:url(javascript:alert(1))}</style><link rel="stylesheet" href="javascript:alert(1)"><div>ok</div>';
    const clean = sanitizeHtml(dirty);
    assert.strictEqual(clean, '<div>ok</div>');
  });
});
