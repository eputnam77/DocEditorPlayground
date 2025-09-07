/**
 * Validate that a document object contains a string `content` field.
 * @param doc - Arbitrary document data to validate.
 * @returns `true` if the document has a `content` string field, `false` otherwise.
 */
const ZWS_RE = /[\s\u200B-\u200D\u2060-\u206F\uFEFF]+/g;

function isStringLike(v: unknown): v is string | String {
  return typeof v === "string" || v instanceof String;
}

function isNumberLike(v: unknown): v is number | Number {
  return (typeof v === "number" || v instanceof Number) && Number.isFinite(Number(v));
}

function hasVisibleContent(str: string): boolean {
  return str.replace(ZWS_RE, "").length > 0;
}

export function validateDocument(doc: unknown): boolean {
  if (typeof doc !== "object" || doc === null || Array.isArray(doc)) {
    return false;
  }
  const rec = doc as Record<string, unknown>;
  try {
    if (!Object.prototype.hasOwnProperty.call(rec, "content")) {
      return false;
    }
    const value = rec.content;
    if (isStringLike(value) && hasVisibleContent(value.toString())) {
      return true;
    }
    return false;
  } catch {
    // Accessing the property might trigger a getter that throws; treat as invalid
    return false;
  }
}

/**
 * Validate that a template has `title` and `body` fields that can be
 * converted to strings. Numeric values are accepted and coerced later.
 * @param tpl - Template data to validate.
 * @returns `true` if both fields exist and are non-empty.
 */
export function validateTemplate(tpl: unknown): boolean {
  if (typeof tpl !== "object" || tpl === null || Array.isArray(tpl)) {
    return false;
  }
  const rec = tpl as Record<string, unknown>;
  try {
    if (
      !Object.prototype.hasOwnProperty.call(rec, "title") ||
      !Object.prototype.hasOwnProperty.call(rec, "body")
    ) {
      return false;
    }
    const title = rec.title;
    const body = rec.body;
    if (!(isStringLike(title) || isNumberLike(title))) {
      return false;
    }
    if (!(isStringLike(body) || isNumberLike(body))) {
      return false;
    }
    return (
      hasVisibleContent(title.toString()) &&
      hasVisibleContent(body.toString())
    );
  } catch {
    // If accessing properties throws (e.g. getters with side effects), treat as invalid
    return false;
  }
}
