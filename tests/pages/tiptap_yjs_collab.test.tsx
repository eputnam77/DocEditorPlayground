import { describe, it, expect } from "vitest";
import { tiptapYjsCollab } from "../../extensions/tiptapYjsCollab";

describe("TipTap Yjs collaboration", () => {
  it("creates extension", () => {
    const ext = tiptapYjsCollab();
    expect(ext.name).toBe("yjs-collab");
  });
});
