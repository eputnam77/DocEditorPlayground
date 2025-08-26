/**
 * TipTap extension enforcing heading structure rules.
 */
import { Extension } from "@tiptap/core";
import { Plugin } from "prosemirror-state";
import { JSDOM } from "jsdom";

/**
 * Extension skeleton enforcing heading structure rules.
 */
/**
 * Disallow consecutive headings and enforce that only
 * paragraphs or lists may follow a heading block.
 */
export function tiptapStructure() {
  return Extension.create({
    name: "structure",
    addProseMirrorPlugins() {
      return [
        new Plugin({
          filterTransaction(tr) {
            if (!tr.docChanged) return true;
            const doc = tr.doc;
            let prevHeading = false;
            for (let i = 0; i < doc.childCount; i++) {
              const node = doc.child(i);
              const isHeading = node.type.name === "heading";
              if (isHeading && prevHeading) {
                return false;
              }
              if (
                prevHeading &&
                !["paragraph", "bulletList", "orderedList"].includes(
                  node.type.name,
                )
              ) {
                return false;
              }
              prevHeading = isHeading;
            }
            return true;
          },
        }),
      ];
    },
  });
}

/**
 * Basic validator used in tests to verify no consecutive headings.
 */
export function isValidStructure(html: string): boolean {
  const Parser =
    typeof DOMParser !== "undefined" ? DOMParser : new JSDOM("").window.DOMParser;
  const doc: Document = new Parser().parseFromString(html, "text/html");
  let prevHeading = false;
  for (const el of Array.from(doc.body.children) as Element[]) {
    const isHeading = /^H[1-6]$/.test(el.tagName);
    if (isHeading && prevHeading) return false;
    if (prevHeading && !["P", "UL", "OL"].includes(el.tagName)) return false;
    prevHeading = isHeading;
  }
  return true;
}
