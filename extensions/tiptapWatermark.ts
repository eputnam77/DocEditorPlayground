/**
 * TipTap extension for customizable watermarks.
 */
import { Extension } from "@tiptap/core";

/**
 * Extension adding a simple watermark to the editor DOM.
 */
export function tiptapWatermark() {
  return Extension.create({ name: "watermark" });
}
