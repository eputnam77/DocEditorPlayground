import { describe, it } from "vitest";
import assert from "node:assert/strict";
import { integrateTemplates } from "../../utils/templateIntegration.js";

describe("integrateTemplates", () => {
  it("filters invalid templates", () => {
    const input = [{ title: "A", body: "b" }, { title: "bad" }, null];
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
});
