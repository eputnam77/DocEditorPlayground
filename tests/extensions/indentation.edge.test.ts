import { describe, it, expect, vi } from "vitest";
import { indentCommand, outdentCommand } from "../../extensions/tiptapIndentation";

describe("tiptapIndentation", () => {
  it("increments numeric indent when attribute is a string", () => {
    const updateAttributes = vi.fn();
    indentCommand({
      editor: { getAttributes: () => ({ "data-indent": "2" }) },
      commands: { updateAttributes },
    });
    expect(updateAttributes).toHaveBeenCalledWith("paragraph", { "data-indent": 3 });
  });

  it("does not decrement below zero", () => {
    const updateAttributes = vi.fn();
    outdentCommand({
      editor: { getAttributes: () => ({ "data-indent": "0" }) },
      commands: { updateAttributes },
    });
    expect(updateAttributes).toHaveBeenCalledWith("paragraph", { "data-indent": 0 });
  });

  it("treats negative indent as zero", () => {
    const updateAttributes = vi.fn();
    indentCommand({
      editor: { getAttributes: () => ({ "data-indent": -2 }) },
      commands: { updateAttributes },
    });
    expect(updateAttributes).toHaveBeenCalledWith("paragraph", { "data-indent": 1 });
  });

  it("floors fractional indent values", () => {
    const updateAttributes = vi.fn();
    indentCommand({
      editor: { getAttributes: () => ({ "data-indent": 2.7 }) },
      commands: { updateAttributes },
    });
    expect(updateAttributes).toHaveBeenCalledWith("paragraph", { "data-indent": 3 });
  });
});
