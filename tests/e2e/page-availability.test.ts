import { expect, test } from "@playwright/test";

const pages = [
  { path: "/", text: "Document Editor Playground" },
  { path: "/tiptap", text: "TipTap Editor" },
  { path: "/toast", text: "Toast UI Editor" },
  { path: "/codex", text: "Editor.js" },
  { path: "/quill", text: "Quill Editor" },
  { path: "/slate", text: "Slate Editor" },
  { path: "/lexical", text: "Lexical Editor" },
  { path: "/ckeditor", text: "CKEditor 5" },
];

// Only test TipTap page availability
for (const { path, text } of pages) {
  test(`opens ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByText(text)).toBeVisible();
  });
}
