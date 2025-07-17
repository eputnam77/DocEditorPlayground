/**
 * TipTap extension enforcing locked heading levels.
 */
import { Extension } from "@tiptap/core";

/**
 * Extension skeleton for locking heading levels 1 and 2.
 * Actual ProseMirror logic omitted for brevity.
 */
export function tiptapHeadingLock() {
  return Extension.create({ name: "heading-lock" });
}
