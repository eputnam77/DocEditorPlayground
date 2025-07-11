import { test, expect } from "@playwright/test";

const pages = [
  { path: "/", text: "Document Editor Playground" },
  { path: "/tiptap", text: "TipTap" },
  { path: "/toast", text: "Toast UI Editor" },
  { path: "/codex", text: "CodeX (Editor.js)" },
  { path: "/quill", text: "Quill" },
  { path: "/slate", text: "Slate" },
  { path: "/lexical", text: "Lexical" },
  { path: "/ckeditor", text: "CKEditor 5" },
];

for (const { path, text } of pages) {
  test(`opens ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByText(text)).toBeVisible();
  });
}
