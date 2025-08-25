import { describe, it, expect } from "vitest";
import { validateDocument, validateTemplate } from "../../utils/validation";

describe("validateDocument", () => {
  it("returns true for objects with content string", () => {
    expect(validateDocument({ content: "a" })).toBe(true);
  });

  it("returns false otherwise", () => {
    expect(validateDocument({})).toBe(false);
    expect(validateDocument(null)).toBe(false);
    const arr: any = [];
    arr.content = "x";
    expect(validateDocument(arr)).toBe(false);
  });
});

describe("validateTemplate", () => {
  it("returns true for objects with title and body", () => {
    expect(validateTemplate({ title: "t", body: "b" })).toBe(true);
  });

  it("returns false otherwise", () => {
    expect(validateTemplate({ title: "t" })).toBe(false);
    expect(validateTemplate(null)).toBe(false);
    const arr: any = [];
    arr.title = "t";
    arr.body = "b";
    expect(validateTemplate(arr)).toBe(false);
  });
});
