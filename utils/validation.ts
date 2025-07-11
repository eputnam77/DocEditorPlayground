/**
 * Validate that a document object contains a string `content` field.
 * @param doc - Arbitrary document data to validate.
 * @returns `true` if the document has a `content` string field, `false` otherwise.
 */
export function validateDocument(doc: unknown): boolean {
  if (typeof doc !== 'object' || doc === null) {
    return false;
  }
  return typeof (doc as Record<string, unknown>).content === 'string';
}
