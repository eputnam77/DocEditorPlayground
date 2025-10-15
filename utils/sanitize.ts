/**
 * Basic HTML sanitizer removing script tags and event handler attributes.
 * This prevents template content from executing arbitrary JavaScript.
 */
import { JSDOM } from "jsdom";

const INVISIBLE_SEPARATORS =
  /[\s\u0000-\u001F\u200B-\u200D\u2060-\u206F\uFEFF]+/g;

const DECODER_DOCUMENT =
  typeof document !== "undefined" &&
  typeof document.createElement === "function"
    ? document
    : new JSDOM("").window.document;

const ENTITY_DECODER = DECODER_DOCUMENT.createElement("textarea");

function decodeEntities(value: string): string {
  ENTITY_DECODER.innerHTML = value;
  const decoded = ENTITY_DECODER.value || ENTITY_DECODER.textContent || "";
  ENTITY_DECODER.innerHTML = "";
  return decoded;
}

export function sanitizeNode(root: ParentNode): void {
  // Remove tags that can execute scripts or modify document navigation
  root
    .querySelectorAll("script, iframe, object, embed, base, style, link")
    .forEach((el) => el.remove());
  // Remove meta refresh tags which can trigger redirects or script URLs
  root.querySelectorAll("meta[http-equiv]").forEach((el) => {
    const equiv = el.getAttribute("http-equiv");
    const decodedEquiv = equiv ? decodeEntities(equiv) : null;
    // Some browsers are tolerant of stray whitespace inside the value, so we
    // normalise by removing all whitespace characters before comparison.
    if (
      decodedEquiv &&
      decodedEquiv
        .toLowerCase()
        .replace(INVISIBLE_SEPARATORS, "") === "refresh"
    ) {
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
        const decoded = decodeEntities(attribute.value);
        // Strip CSS comments before checking for dangerous patterns
        const stripped = decoded.replace(/\/\*[^]*?\*\//g, "");
        const valLower = stripped.toLowerCase();
        const collapsed = valLower.replace(INVISIBLE_SEPARATORS, "");
        if (
          /expression\s*\(/.test(valLower) ||
          /url\(['"]?(javascript|data|vbscript):/.test(collapsed)
        ) {
          el.removeAttribute(attribute.name);
        }
        continue;
      }
      if (name === "srcset") {
        const decoded = decodeEntities(attribute.value);
        const entries = decoded.split(",");
        const unsafe = entries.some((entry) => {
          const normalized = decodeEntities(entry).replace(
            INVISIBLE_SEPARATORS,
            "",
          );
          return /^(?:javascript|data|vbscript):/i.test(normalized);
        });
        if (unsafe) {
          el.removeAttribute(attribute.name);
        }
        continue;
      }

      if (
        name === "href" ||
        name === "src" ||
        name === "xlink:href" ||
        name === "action" ||
        name === "formaction" ||
        name === "background"
      ) {
        const decoded = decodeEntities(attribute.value);
        const normalized = decoded.replace(INVISIBLE_SEPARATORS, "");
        if (/^(?:javascript|data|vbscript):/i.test(normalized)) {
          el.removeAttribute(attribute.name);
        }
        continue;
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
