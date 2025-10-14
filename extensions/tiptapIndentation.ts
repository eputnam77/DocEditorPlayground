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
function readIndent(
  editor: IndentationCommandProps["editor"],
  type: string,
): number {
  try {
    const attrs = editor.getAttributes(type) as
      | Record<string, unknown>
      | undefined;
    const val = attrs ? attrs["data-indent"] : undefined;
    const num = typeof val === "number" ? val : Number(val);
    if (!Number.isFinite(num) || num <= 0) {
      return 0;
    }
    return Math.floor(num);
  } catch {
    return 0;
  }
}

export function getIndentLevel(
  editor: IndentationCommandProps["editor"],
): number {
  const paragraphIndent = readIndent(editor, "paragraph");
  const listIndent = readIndent(editor, "listItem");
  return Math.max(paragraphIndent, listIndent);
}

export function indentCommand({
  editor,
  commands,
}: IndentationCommandProps): boolean {
  const level = getIndentLevel(editor);
  const next = { "data-indent": level + 1 };
  let updated = false;
  try {
    updated = commands.updateAttributes("paragraph", next) || updated;
  } catch {
    // ignore failures for node types that aren't active
  }
  try {
    updated = commands.updateAttributes("listItem", next) || updated;
  } catch {
    // ignore failures for node types that aren't active
  }
  return updated;
}

export function outdentCommand({
  editor,
  commands,
}: IndentationCommandProps): boolean {
  const level = getIndentLevel(editor);
  const nextLevel = Math.max(0, level - 1);
  const next = { "data-indent": nextLevel };
  let updated = false;
  try {
    updated = commands.updateAttributes("paragraph", next) || updated;
  } catch {
    // ignore failures for node types that aren't active
  }
  try {
    updated = commands.updateAttributes("listItem", next) || updated;
  } catch {
    // ignore failures for node types that aren't active
  }
  return updated;
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
