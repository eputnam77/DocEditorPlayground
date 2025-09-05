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

  it("returns false when content getter throws", () => {
    const doc: any = {};
    Object.defineProperty(doc, "content", {
      get() {
        throw new Error("boom");
      },
    });
    assert.strictEqual(validateDocument(doc), false);
  });

  it("evaluates content getter only once", () => {
    let first = true;
    const doc: any = {};
    Object.defineProperty(doc, "content", {
      get() {
        if (first) {
          first = false;
          return "hello";
        }
        return "";
      },
    });
    assert.strictEqual(validateDocument(doc), true);
  });

  it("accepts String objects", () => {
    const doc: any = { content: new String("hi") };
    assert.strictEqual(validateDocument(doc), true);
    assert.strictEqual(
      validateDocument({ content: new String("") as any }),
      false,
    );
    assert.strictEqual(
      validateTemplate({ title: new String("t"), body: new String("b") }),
      true,
    );
  });
});

describe("validateTemplate", () => {
  it("returns true for objects with title and body", () => {
    assert.strictEqual(validateTemplate({ title: "t", body: "b" }), true);
  });

  it("accepts numeric fields", () => {
    assert.strictEqual(validateTemplate({ title: 1, body: 2 }), true);
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

  it("returns false when property getters throw", () => {
    const tpl: any = {};
    Object.defineProperty(tpl, "title", {
      get() {
        throw new Error("nope");
      },
    });
    Object.defineProperty(tpl, "body", {
      get() {
        throw new Error("nope");
      },
    });
    assert.strictEqual(validateTemplate(tpl), false);
  });

  it("evaluates getters once and rejects NaN", () => {
    let first = true;
    const tpl: any = {};
    Object.defineProperty(tpl, "title", {
      get() {
        if (first) {
          first = false;
          return "t";
        }
        return "";
      },
    });
    tpl.body = "b";
    assert.strictEqual(validateTemplate(tpl), true);

    assert.strictEqual(validateTemplate({ title: NaN, body: "b" }), false);
    assert.strictEqual(validateTemplate({ title: "t", body: NaN }), false);
  });

  it("rejects infinite numbers", () => {
    assert.strictEqual(
      validateTemplate({ title: Infinity, body: 1 }),
      false,
    );
    assert.strictEqual(
      validateTemplate({ title: 1, body: Infinity }),
      false,
    );
    assert.strictEqual(
      validateTemplate({ title: -Infinity, body: 1 }),
      false,
    );
  });
});
