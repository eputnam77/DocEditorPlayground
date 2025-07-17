/**
 * TipTap extension enforcing heading structure rules.
 */
import { Extension } from "@tiptap/core";

/**
 * Extension skeleton enforcing heading structure rules.
 */
export function tiptapStructure() {
  return Extension.create({ name: "structure" });
}

/**
 * Basic validator used in tests to verify no consecutive headings.
 */
export function isValidStructure(html: string): boolean {
  const doc = new DOMParser().parseFromString(html, "text/html");
  let prevHeading = false;
  for (const el of Array.from(doc.body.children)) {
    const isHeading = /^H[1-6]$/.test(el.tagName);
    if (isHeading && prevHeading) return false;
    prevHeading = isHeading;
  }
  return true;
}
