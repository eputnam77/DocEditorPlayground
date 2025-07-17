import { expect, test } from "@playwright/test";

const pages = [
  { name: "TipTap", path: "/tiptap", heading: "TipTap Editor" },
  { name: "Toast Editor", path: "/toast", heading: "Toast UI Editor" },
  { name: "CodeX", path: "/codex", heading: "Editor.js" },
  { name: "Slate", path: "/slate", heading: "Slate Editor" },
  { name: "Lexical", path: "/lexical", heading: "Lexical Editor" },
  { name: "CKEditor 5", path: "/ckeditor", heading: "CKEditor 5" },
];

test.describe("navigation bar", () => {
  for (const { name, path, heading } of pages) {
    test(`navigates to ${name}`, async ({ page }) => {
      await page.goto("/");
      const link = page.getByRole("link", { name });
      await expect(link).toBeVisible({ timeout: 10000 });
      await link.click();
      await expect(page).toHaveURL(path);
      await expect(page.getByText(heading)).toBeVisible();
    });
  }
});
