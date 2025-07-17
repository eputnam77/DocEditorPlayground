/**
 * TipTap extension adding indentation controls.
 */
import { Extension } from "@tiptap/core";

/**
 * Minimal indentation extension returning a blank command set.
 */
export function tiptapIndentation() {
  return Extension.create({ name: "indentation" });
}
