/**
 * Basic HTML sanitizer removing script tags and event handler attributes.
 * This prevents template content from executing arbitrary JavaScript.
 */
export function sanitizeHtml(html: string): string {
  const parser = new DOMParser();
  const doc = parser.parseFromString(html, "text/html");
  // Remove all script tags
  doc.querySelectorAll("script").forEach((el) => el.remove());
  // Remove event handler attributes like onclick
  doc.querySelectorAll("*").forEach((el) => {
    for (const attr of Array.from(el.attributes)) {
      if (attr.name.startsWith("on")) {
        el.removeAttribute(attr.name);
      }
    }
  });
  return doc.body.innerHTML;
}
export default sanitizeHtml;
