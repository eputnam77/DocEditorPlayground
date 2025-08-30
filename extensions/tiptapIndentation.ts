/**
 * TipTap extension adding indentation controls.
 */
import { Extension, RawCommands } from "@tiptap/core";
import { Node as PMNode } from "prosemirror-model";

/**
 * Minimal indentation extension returning a blank command set.
 */
/**
 * Adds simple indent/outdent commands by storing the level
 * in a `data-indent` attribute on paragraphs and list items.
 */
export function getIndentLevel(editor: {
  getAttributes: (name: string) => Record<string, unknown>;
}): number {
  const val = editor.getAttributes("paragraph")["data-indent"];
  const num = typeof val === "number" ? val : Number(val);
  return Number.isFinite(num) ? num : 0;
}

export function indentCommand({
  editor,
  commands,
}: {
  editor: any;
  commands: any;
}): any {
  const level = getIndentLevel(editor);
  return commands.updateAttributes("paragraph", {
    "data-indent": level + 1,
  });
}

export function outdentCommand({
  editor,
  commands,
}: {
  editor: any;
  commands: any;
}): any {
  const level = getIndentLevel(editor);
  return commands.updateAttributes("paragraph", {
    "data-indent": Math.max(0, level - 1),
  });
}

export function tiptapIndentation() {
  return Extension.create({
    name: "indentation",
    addCommands() {
      return {
        indent: () => indentCommand,
        outdent: () => outdentCommand,
      } as Partial<RawCommands>;
    },
    addGlobalAttributes() {
      return [
        {
          types: ["paragraph", "listItem"],
          attributes: {
            "data-indent": {
              default: 0,
              parseHTML: (el: HTMLElement) =>
                Number(el.getAttribute("data-indent")) || 0,
              renderHTML: (attrs: any) => {
                if (!attrs["data-indent"]) return {};
                return { "data-indent": attrs["data-indent"] };
              },
            },
          },
        },
      ];
    },
  });
}
