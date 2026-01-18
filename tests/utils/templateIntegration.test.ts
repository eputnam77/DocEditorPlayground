import { describe, it } from "vitest";
import assert from "node:assert/strict";
import { integrateTemplates } from "../../utils/templateIntegration.js";

describe("integrateTemplates", () => {
  it("filters invalid templates", () => {
    const proto = { title: "P", body: "p" };
    const input = [
      { title: "A", body: "b" },
      { title: "bad" },
      null,
      Object.create(proto),
      Object.assign([], { title: "x", body: "y" }),
    ];
    const result = integrateTemplates(input as any);
    assert.deepStrictEqual(result, [{ title: "A", body: "b" }]);
  });

  it("throws for non-array input", () => {
    // invalid input passed intentionally
    assert.throws(() => integrateTemplates(null as any), TypeError);
  });

  it("strips extraneous fields and returns new objects", () => {
    const tpl: any = { title: "A", body: "b", evil: "x" };
    const [result] = integrateTemplates([tpl]);
    assert.deepStrictEqual(result, { title: "A", body: "b" });
    assert.notStrictEqual(result, tpl);
  });

  it("coerces non-string fields to strings", () => {
    const input: any = [{ title: 123, body: 456 }];
    const result = integrateTemplates(input);
    assert.deepStrictEqual(result, [{ title: "123", body: "456" }]);
  });

  it("trims whitespace from fields", () => {
    const input: any = [{ title: "  A  ", body: " b  " }];
    const result = integrateTemplates(input);
    assert.deepStrictEqual(result, [{ title: "A", body: "b" }]);
  });

  it("removes zero-width characters while normalising", () => {
    const input: any = [{ title: "Tit\u200Ble", body: "Body\u200C" }];
    const result = integrateTemplates(input);
    assert.deepStrictEqual(result, [{ title: "Title", body: "Body" }]);
  });

  it("rejects arrays and prototype properties", () => {
    const proto = { title: "t", body: "b" };
    const arr: any = Object.assign([], { title: "x", body: "y" });
    const obj = Object.create(proto);
    const result = integrateTemplates([arr, obj]);
    assert.deepStrictEqual(result, []);
  });

  it("accesses template fields only once", () => {
    let calls = 0;
    const tpl: any = {
      get title() {
        calls++;
        if (calls > 1) {
          throw new Error("called twice");
        }
        return "A";
      },
      body: "b",
    };
    const result = integrateTemplates([tpl]);
    assert.deepStrictEqual(result, [{ title: "A", body: "b" }]);
    assert.strictEqual(calls, 1);
  });

  it("ignores entries when body getter throws", () => {
    const tpl: any = { title: "A" };
    Object.defineProperty(tpl, "body", {
      get() {
        throw new Error("boom");
      },
    });
    const result = integrateTemplates([tpl]);
    assert.deepStrictEqual(result, []);
  });

  it("does not mutate the original template objects", () => {
    const tpl: any = { title: " Title ", body: " Body " };
    integrateTemplates([tpl]);
    assert.deepStrictEqual(tpl, { title: " Title ", body: " Body " });
  });

  it("keeps template order after filtering", () => {
    const input: any = [
      { title: "First", body: "One" },
      { title: "", body: "skip" },
      { title: "Second", body: "Two" },
    ];
    const result = integrateTemplates(input);
    assert.deepStrictEqual(result, [
      { title: "First", body: "One" },
      { title: "Second", body: "Two" },
    ]);
  });
});
