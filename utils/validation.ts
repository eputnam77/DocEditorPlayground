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
    return (
      Object.prototype.hasOwnProperty.call(rec, "content") &&
      typeof rec.content === "string" &&
      rec.content.trim().length > 0
    );
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
    return (
      Object.prototype.hasOwnProperty.call(rec, "title") &&
      Object.prototype.hasOwnProperty.call(rec, "body") &&
      (typeof rec.title === "string" || typeof rec.title === "number") &&
      String(rec.title).trim().length > 0 &&
      (typeof rec.body === "string" || typeof rec.body === "number") &&
      String(rec.body).trim().length > 0
    );
  } catch {
    // If accessing properties throws (e.g. getters with side effects), treat as invalid
    return false;
  }
}
