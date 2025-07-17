import { describe, it, expect } from "vitest";
import { integrateTemplates } from "../../utils/templateIntegration";

describe("integrateTemplates", () => {
  it("filters invalid templates", () => {
    const input = [
      { title: "A", body: "b" },
      { title: "bad" },
      null,
    ];
    const result = integrateTemplates(input as any);
    expect(result).toEqual([{ title: "A", body: "b" }]);
  });

  it("throws for non-array input", () => {
    // @ts-expect-error invalid input
    expect(() => integrateTemplates(null as any)).toThrow(TypeError);
  });
});
