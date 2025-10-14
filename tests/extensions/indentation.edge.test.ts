import { describe, it, expect, vi } from "vitest";
import { indentCommand, outdentCommand } from "../../extensions/tiptapIndentation";

describe("tiptapIndentation", () => {
  it("increments numeric indent when attribute is a string", () => {
    const updateAttributes = vi.fn().mockReturnValue(false);
    indentCommand({
      editor: { getAttributes: () => ({ "data-indent": "2" }) },
      commands: { updateAttributes },
    });
    expect(updateAttributes).toHaveBeenNthCalledWith(1, "paragraph", {
      "data-indent": 3,
    });
    expect(updateAttributes).toHaveBeenNthCalledWith(2, "listItem", {
      "data-indent": 3,
    });
  });

  it("does not decrement below zero", () => {
    const updateAttributes = vi.fn().mockReturnValue(false);
    outdentCommand({
      editor: { getAttributes: () => ({ "data-indent": "0" }) },
      commands: { updateAttributes },
    });
    expect(updateAttributes).toHaveBeenNthCalledWith(1, "paragraph", {
      "data-indent": 0,
    });
    expect(updateAttributes).toHaveBeenNthCalledWith(2, "listItem", {
      "data-indent": 0,
    });
  });

  it("reduces indent when positive", () => {
    const updateAttributes = vi.fn().mockReturnValue(false);
    outdentCommand({
      editor: { getAttributes: () => ({ "data-indent": 3 }) },
      commands: { updateAttributes },
    });
    expect(updateAttributes).toHaveBeenNthCalledWith(1, "paragraph", {
      "data-indent": 2,
    });
    expect(updateAttributes).toHaveBeenNthCalledWith(2, "listItem", {
      "data-indent": 2,
    });
  });

  it("treats negative indent as zero", () => {
    const updateAttributes = vi.fn().mockReturnValue(false);
    indentCommand({
      editor: { getAttributes: () => ({ "data-indent": -2 }) },
      commands: { updateAttributes },
    });
    expect(updateAttributes).toHaveBeenNthCalledWith(1, "paragraph", {
      "data-indent": 1,
    });
    expect(updateAttributes).toHaveBeenNthCalledWith(2, "listItem", {
      "data-indent": 1,
    });
  });

  it("floors fractional indent values", () => {
    const updateAttributes = vi.fn().mockReturnValue(false);
    indentCommand({
      editor: { getAttributes: () => ({ "data-indent": 2.7 }) },
      commands: { updateAttributes },
    });
    expect(updateAttributes).toHaveBeenNthCalledWith(1, "paragraph", {
      "data-indent": 3,
    });
    expect(updateAttributes).toHaveBeenNthCalledWith(2, "listItem", {
      "data-indent": 3,
    });
  });

  it("uses list item indent when it differs from paragraph", () => {
    const updateAttributes = vi.fn((node: string) => node === "listItem");
    const editor = {
      getAttributes: (node: string) =>
        node === "listItem"
          ? { "data-indent": 4 }
          : { "data-indent": 1 },
    };
    const result = indentCommand({ editor, commands: { updateAttributes } });
    expect(result).toBe(true);
    expect(updateAttributes).toHaveBeenCalledWith("paragraph", {
      "data-indent": 5,
    });
    expect(updateAttributes).toHaveBeenCalledWith("listItem", {
      "data-indent": 5,
    });
  });

  it("outdents when only list item indent is present", () => {
    const updateAttributes = vi.fn((node: string) => node === "listItem");
    const editor = {
      getAttributes: (node: string) =>
        node === "listItem" ? { "data-indent": 3 } : { "data-indent": 0 },
    };
    const result = outdentCommand({ editor, commands: { updateAttributes } });
    expect(result).toBe(true);
    expect(updateAttributes).toHaveBeenCalledWith("paragraph", {
      "data-indent": 2,
    });
    expect(updateAttributes).toHaveBeenCalledWith("listItem", {
      "data-indent": 2,
    });
  });
});
