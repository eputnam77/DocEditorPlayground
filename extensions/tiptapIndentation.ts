/**
 * TipTap extension adding indentation controls.
 */
import { Extension, RawCommands } from "@tiptap/core";

type IndentationCommandProps = {
  editor: {
    getAttributes: (name: string) => Record<string, unknown>;
  };
  commands: {
    updateAttributes: (
      name: string,
      attributes: Record<string, unknown>
    ) => boolean;
  };
};

/**
 * Adds simple indent/outdent commands by storing the level
 * in a `data-indent` attribute on paragraphs and list items.
 */
export function getIndentLevel(
  editor: IndentationCommandProps["editor"]
): number {
  const val = editor.getAttributes("paragraph")["data-indent"];
  const num = typeof val === "number" ? val : Number(val);
  if (!Number.isFinite(num) || num <= 0) return 0;
  return Math.floor(num);
}

export function indentCommand({
  editor,
  commands,
}: IndentationCommandProps): boolean {
  const level = getIndentLevel(editor);
  return commands.updateAttributes("paragraph", {
    "data-indent": level + 1,
  });
}

export function outdentCommand({
  editor,
  commands,
}: IndentationCommandProps): boolean {
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
