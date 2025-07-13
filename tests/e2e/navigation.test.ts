import { test, expect } from "@playwright/test";
test.skip(true, "E2E tests disabled");

const pages = [
  { name: "TipTap", path: "/tiptap", heading: "TipTap Editor" },
  { name: "Toast Editor", path: "/toast", heading: "Toast UI Editor" },
  { name: "CodeX", path: "/codex", heading: "Editor.js" },
  { name: "Quill", path: "/quill", heading: "Quill Editor" },
  { name: "Slate", path: "/slate", heading: "Slate Editor" },
  { name: "Lexical", path: "/lexical", heading: "Lexical Editor" },
  { name: "CKEditor 5", path: "/ckeditor", heading: "CKEditor 5" },
];

test.describe("navigation bar", () => {
  for (const { name, path, heading } of pages) {
    test(`navigates to ${name}`, async ({ page }) => {
      await page.goto("/");
      await page.getByRole("link", { name }).click();
      await expect(page).toHaveURL(path);
      await expect(page.getByText(heading)).toBeVisible();
    });
  }
});
