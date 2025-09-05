/**
 * Validate that a document object contains a string `content` field.
 * @param doc - Arbitrary document data to validate.
 * @returns `true` if the document has a `content` string field, `false` otherwise.
 */
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
    // Accept both primitive strings and String objects
    if (typeof value === "string" || value instanceof String) {
      return value.toString().trim().length > 0;
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
    const isStringLike = (v: unknown) =>
      typeof v === "string" || v instanceof String;
    const isNumberLike = (v: unknown) =>
      typeof v === "number" && Number.isFinite(v);
    if (!(isStringLike(title) || isNumberLike(title))) {
      return false;
    }
    if (!(isStringLike(body) || isNumberLike(body))) {
      return false;
    }
    return title.toString().trim().length > 0 && body.toString().trim().length > 0;
  } catch {
    // If accessing properties throws (e.g. getters with side effects), treat as invalid
    return false;
  }
}
