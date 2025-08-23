import { describe, it, expect } from "vitest";
import { Editor } from "@tiptap/core";
import StarterKit from "@tiptap/starter-kit";
import { tiptapIndentation } from "../../extensions/tiptapIndentation";

describe("TipTap indentation controls", () => {
  it("indents and outdents paragraphs", () => {
    const editor = new Editor({
      content: "<p>hi</p>",
      extensions: [StarterKit, tiptapIndentation()],
    });

    editor.chain().setTextSelection(1).indent().run();
    expect(editor.getHTML()).toContain('data-indent="1"');

    editor.chain().outdent().run();
    expect(editor.getHTML()).not.toContain('data-indent="1"');
  });
});
