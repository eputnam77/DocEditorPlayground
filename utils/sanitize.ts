/**
 * Basic HTML sanitizer removing script tags and event handler attributes.
 * This prevents template content from executing arbitrary JavaScript.
 */
import { JSDOM } from "jsdom";

export function sanitizeNode(root: ParentNode): void {
  // Remove tags that can execute scripts or modify document navigation
  root
    .querySelectorAll("script, iframe, object, embed, base, style, link")
    .forEach((el) => el.remove());
  // Remove meta refresh tags which can trigger redirects or script URLs
  root.querySelectorAll("meta[http-equiv]").forEach((el) => {
    const equiv = el.getAttribute("http-equiv");
    if (equiv && equiv.toLowerCase().trim() === "refresh") {
      // Refresh tags can trigger unwanted redirects even with supposedly safe URLs
      el.remove();
    }
  });
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
        // Strip CSS comments before checking for dangerous patterns
        const stripped = attribute.value.replace(/\/\*[^]*?\*\//g, "");
        const valLower = stripped.toLowerCase();
        const collapsed = valLower.replace(/[\s\u0000-\u001F]+/g, "");
        if (
          /expression\s*\(/.test(valLower) ||
          /url\(['"]?(javascript|data|vbscript):/.test(collapsed)
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
          name === "formaction" ||
          name === "background") &&
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
