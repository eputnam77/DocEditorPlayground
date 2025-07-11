import fc from "fast-check";
import { validateDocument, validateTemplate } from "../../utils/validation";
import { describe, it } from "vitest";

// Property: validators should return boolean for any input without throwing

describe("validation utils (property)", () => {
  it("validateDocument returns boolean", () => {
    fc.assert(
      fc.property(fc.anything(), (doc) => {
        const result = validateDocument(doc);
        return typeof result === "boolean";
      }),
    );
  });

  it("validateTemplate returns boolean", () => {
    fc.assert(
      fc.property(fc.anything(), (tpl) => {
        const result = validateTemplate(tpl);
        return typeof result === "boolean";
      }),
    );
  });
});
