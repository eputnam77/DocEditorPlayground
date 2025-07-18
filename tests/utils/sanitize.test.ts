import { describe, it, expect } from "vitest";
import { sanitizeHtml } from "../../utils/sanitize";

describe("sanitizeHtml", () => {
  it("removes script tags and event handlers", () => {
    const dirty = '<div onclick="alert(1)"><script>alert(2)</script>Hi</div>';
    const clean = sanitizeHtml(dirty);
    expect(clean).toBe("<div>Hi</div>");
  });
});
