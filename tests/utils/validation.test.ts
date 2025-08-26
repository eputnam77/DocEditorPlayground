import { describe, it } from "vitest";
import assert from "node:assert/strict";
import { validateDocument, validateTemplate } from "../../utils/validation.js";

describe("validateDocument", () => {
  it("returns true for objects with content string", () => {
    assert.strictEqual(validateDocument({ content: "a" }), true);
  });

  it("returns false otherwise", () => {
    assert.strictEqual(validateDocument({}), false);
    assert.strictEqual(validateDocument(null), false);
    const arr: any = [];
    arr.content = "x";
    assert.strictEqual(validateDocument(arr), false);
    // should not accept properties from the prototype chain
    const protoDoc = Object.create({ content: "p" });
    assert.strictEqual(validateDocument(protoDoc), false);
  });

  it("rejects empty content", () => {
    assert.strictEqual(validateDocument({ content: "" }), false);
    assert.strictEqual(validateDocument({ content: "   " }), false);
  });
});

describe("validateTemplate", () => {
  it("returns true for objects with title and body", () => {
    assert.strictEqual(validateTemplate({ title: "t", body: "b" }), true);
  });

  it("returns false otherwise", () => {
    assert.strictEqual(validateTemplate({ title: "t" }), false);
    assert.strictEqual(validateTemplate(null), false);
    const arr: any = [];
    arr.title = "t";
    arr.body = "b";
    assert.strictEqual(validateTemplate(arr), false);
    const protoTpl = Object.create({ title: "t", body: "b" });
    assert.strictEqual(validateTemplate(protoTpl), false);
  });

  it("rejects empty strings", () => {
    assert.strictEqual(validateTemplate({ title: "", body: "b" }), false);
    assert.strictEqual(validateTemplate({ title: "t", body: "" }), false);
    assert.strictEqual(validateTemplate({ title: " ", body: "b" }), false);
    assert.strictEqual(validateTemplate({ title: "t", body: "   " }), false);
  });
});
