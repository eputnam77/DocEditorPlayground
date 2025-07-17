/**
 * TipTap extension for draggable sections using Heading 2 nodes.
 */
import { Extension } from "@tiptap/core";

/**
 * Basic extension representing draggable sections using Heading 2.
 */
export function tiptapSectionNode() {
  return Extension.create({ name: "section-node" });
}
