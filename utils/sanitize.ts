/**
 * Basic HTML sanitizer removing script tags and event handler attributes.
 * This prevents template content from executing arbitrary JavaScript.
 */
import { JSDOM } from "jsdom";

export function sanitizeHtml(html: string): string {
  const Parser =
    typeof DOMParser !== "undefined" ? DOMParser : new JSDOM("").window.DOMParser;
  const doc = new Parser().parseFromString(html, "text/html");
  // Remove all script tags
  doc.querySelectorAll("script").forEach((el) => el.remove());
  // Remove event handler attributes like onclick
  doc.querySelectorAll("*").forEach((el) => {
    for (const attribute of Array.from(el.attributes) as Attr[]) {
      const name = attribute.name.toLowerCase();
      if (name.startsWith("on")) {
        el.removeAttribute(attribute.name);
        continue;
      }
      if (name === "style") {
        const val = attribute.value.toLowerCase();
        if (
          /expression\s*\(/i.test(val) ||
          /url\s*\(\s*(javascript|data|vbscript):/i.test(val)
        ) {
          el.removeAttribute(attribute.name);
          continue;
        }
      }
      if (
        (name === "href" || name === "src") &&
        /^(javascript|data|vbscript):/i.test(attribute.value.trim())
      ) {
        el.removeAttribute(attribute.name);
      }
    }
  });
  return doc.body.innerHTML;
}
export default sanitizeHtml;
