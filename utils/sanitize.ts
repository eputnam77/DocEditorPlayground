/**
 * Basic HTML sanitizer removing script tags and event handler attributes.
 * This prevents template content from executing arbitrary JavaScript.
 */
import { JSDOM } from "jsdom";

export function sanitizeHtml(html: string): string {
  const Parser =
    typeof DOMParser !== "undefined" ? DOMParser : new JSDOM("").window.DOMParser;
  const doc = new Parser().parseFromString(html, "text/html");
  // Remove all script and iframe tags
  doc.querySelectorAll("script, iframe").forEach((el) => el.remove());
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
        // Allow optional quotes around url schemes
        if (
          /expression\s*\(/i.test(val) ||
          /url\s*\(\s*['"]?(javascript|data|vbscript):/i.test(val)
        ) {
          el.removeAttribute(attribute.name);
          continue;
        }
      }
      if (name === "srcset") {
        const entries = attribute.value.split(",");
        const unsafe = entries.some((entry) => {
          const norm = entry.replace(/[\s\u0000-\u001F]+/g, "");
          return /^(?:javascript|data|vbscript):/i.test(norm);
        });
        if (unsafe) {
          el.removeAttribute(attribute.name);
        }
        continue;
      }

      if (
        (name === "href" || name === "src" || name === "xlink:href") &&
        /^(?:javascript|data|vbscript):/i.test(
          attribute.value.replace(/[\s\u0000-\u001F]+/g, ""),
        )
      ) {
        el.removeAttribute(attribute.name);
      }
    }
  });
  return doc.body.innerHTML;
}
export default sanitizeHtml;
