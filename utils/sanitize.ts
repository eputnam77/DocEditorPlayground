/**
 * Basic HTML sanitizer removing script tags and event handler attributes.
 * This prevents template content from executing arbitrary JavaScript.
 */
const INVISIBLE_SEPARATORS =
  /[\s\u0000-\u001F\u200B-\u200D\u2060-\u206F\uFEFF]+/g;

const ENTITY_DECODER =
  typeof document !== "undefined" &&
  typeof document.createElement === "function"
    ? document.createElement("textarea")
    : null;

const NAMED_ENTITIES: Record<string, string> = {
  amp: "&",
  lt: "<",
  gt: ">",
  quot: '"',
  apos: "'",
};

function decodeEntitiesFallback(value: string): string {
  return value.replace(
    /&(#x[0-9a-f]+|#\d+|[a-z][a-z0-9]+);?/gi,
    (_match, entity: string) => {
      const lower = entity.toLowerCase();
      if (lower.startsWith("#x")) {
        const codePoint = Number.parseInt(lower.slice(2), 16);
        if (Number.isFinite(codePoint)) {
          try {
            return String.fromCodePoint(codePoint);
          } catch {
            return "";
          }
        }
        return "";
      }
      if (lower.startsWith("#")) {
        const codePoint = Number.parseInt(lower.slice(1), 10);
        if (Number.isFinite(codePoint)) {
          try {
            return String.fromCodePoint(codePoint);
          } catch {
            return "";
          }
        }
        return "";
      }
      return NAMED_ENTITIES[lower] ?? `&${entity};`;
    },
  );
}

function decodeEntities(value: string): string {
  if (ENTITY_DECODER) {
    ENTITY_DECODER.innerHTML = value;
    const decoded = ENTITY_DECODER.value || ENTITY_DECODER.textContent || "";
    ENTITY_DECODER.innerHTML = "";
    return decoded;
  }
  return decodeEntitiesFallback(value);
}

const CSS_ESCAPE_HEX_RE = /\\([0-9a-f]{1,6})(\s)?/gi;
const CSS_ESCAPE_SIMPLE_RE = /\\(.)/g;

function decodeCssEscapes(value: string): string {
  return value
    .replace(CSS_ESCAPE_HEX_RE, (_match, hex: string) => {
      const codePoint = Number.parseInt(hex, 16);
      if (Number.isFinite(codePoint)) {
        try {
          return String.fromCodePoint(codePoint);
        } catch {
          return "";
        }
      }
      return "";
    })
    .replace(CSS_ESCAPE_SIMPLE_RE, "$1")
    .replace(/\\$/g, "");
}

function isDangerousStyleValue(raw: string): boolean {
  const withoutComments = raw.replace(/\/\*[^]*?\*\//g, "");
  const lower = decodeCssEscapes(withoutComments).toLowerCase();
  if (/expression\s*\(/.test(lower)) {
    return true;
  }
  const collapsed = lower.replace(INVISIBLE_SEPARATORS, "");
  return /(?:url|image-set)\([^)]*(?:javascript|data|vbscript)\s*:/.test(
    collapsed,
  );
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
        if (isDangerousStyleValue(decoded)) {
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
  if (typeof DOMParser === "undefined") {
    // Safe fallback when no DOM APIs are available.
    return html.replace(/<[^>]*>/g, "");
  }
  const doc = new DOMParser().parseFromString(html, "text/html");
  sanitizeNode(doc);
  return doc.body.innerHTML;
}
export default sanitizeHtml;
