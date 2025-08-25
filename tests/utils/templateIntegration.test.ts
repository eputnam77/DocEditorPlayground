import { describe, it, expect } from "vitest";
import { integrateTemplates } from "../../utils/templateIntegration";

describe("integrateTemplates", () => {
  it("filters invalid templates", () => {
    const input = [{ title: "A", body: "b" }, { title: "bad" }, null];
    const result = integrateTemplates(input as any);
    expect(result).toEqual([{ title: "A", body: "b" }]);
  });

  it("throws for non-array input", () => {
    // invalid input passed intentionally
    expect(() => integrateTemplates(null as any)).toThrow(TypeError);
  });

  it("strips extraneous fields and returns new objects", () => {
    const tpl: any = { title: "A", body: "b", evil: "x" };
    const [result] = integrateTemplates([tpl]);
    expect(result).toEqual({ title: "A", body: "b" });
    expect(result).not.toBe(tpl);
  });
});
