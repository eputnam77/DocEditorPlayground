/**
 * Basic HTML sanitizer removing script tags and event handler attributes.
 * This prevents template content from executing arbitrary JavaScript.
 */
import { JSDOM } from "jsdom";

function sanitizeNode(root: ParentNode): void {
  // Remove all script and iframe tags within this subtree
  root.querySelectorAll("script, iframe").forEach((el) => el.remove());
  // Recursively process <template> contents
  root.querySelectorAll("template").forEach((tpl) => {
    sanitizeNode((tpl as HTMLTemplateElement).content);
  });
  // Remove dangerous attributes
  root.querySelectorAll("*").forEach((el) => {
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
        (name === "href" ||
          name === "src" ||
          name === "xlink:href" ||
          name === "action" ||
          name === "formaction") &&
        /^(?:javascript|data|vbscript):/i.test(
          attribute.value.replace(/[\s\u0000-\u001F]+/g, ""),
        )
      ) {
        el.removeAttribute(attribute.name);
      }
    }
  });
}

export function sanitizeHtml(html: string): string {
  const Parser =
    typeof DOMParser !== "undefined" ? DOMParser : new JSDOM("").window.DOMParser;
  const doc = new Parser().parseFromString(html, "text/html");
  sanitizeNode(doc);
  return doc.body.innerHTML;
}
export default sanitizeHtml;
