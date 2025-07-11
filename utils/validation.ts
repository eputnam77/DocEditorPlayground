/**
 * Validate that a document object contains a string `content` field.
 * @param doc - Arbitrary document data to validate.
 * @returns `true` if the document has a `content` string field, `false` otherwise.
 */
export function validateDocument(doc: unknown): boolean {
  if (typeof doc !== "object" || doc === null) {
    return false;
  }
  return typeof (doc as Record<string, unknown>).content === "string";
}

/**
 * Validate that a template has `title` and `body` string fields.
 * @param tpl - Template data to validate.
 * @returns `true` if both fields exist and are strings.
 */
export function validateTemplate(tpl: unknown): boolean {
  if (typeof tpl !== "object" || tpl === null) {
    return false;
  }
  const rec = tpl as Record<string, unknown>;
  return typeof rec.title === "string" && typeof rec.body === "string";
}
