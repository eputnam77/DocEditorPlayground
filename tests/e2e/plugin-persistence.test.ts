import { test, expect } from "@playwright/test";

interface Editor {
  path: string;
  menu: { name: string };
  label: string;
}

const editors: Editor[] = [
  { path: "/tiptap", menu: { name: "Extensions" }, label: "Underline" },
  { path: "/toast", menu: { name: "Plugins" }, label: "ColorSyntax" },
  { path: "/codex", menu: { name: "Plugins" }, label: "Checklist" },
  { path: "/quill", menu: { name: "Modules" }, label: "History" },
  { path: "/slate", menu: { name: "Plugins" }, label: "History" },
  { path: "/lexical", menu: { name: "Plugins" }, label: "CodeHighlight" },
  { path: "/ckeditor", menu: { name: "Plugins" }, label: "Bold" },
];

for (const e of editors) {
  test.describe(`${e.path} plugin persistence`, () => {
    test(`persists ${e.label} toggle`, async ({ page }) => {
      await page.goto(e.path);
      await page.getByRole("button", e.menu).click();
      const checkbox = page.getByLabel(e.label);
      await expect(checkbox).toBeChecked();
      await checkbox.uncheck();
      await page.getByRole("button", { name: "Close" }).click();
      await page.reload();
      await page.getByRole("button", e.menu).click();
      await expect(page.getByLabel(e.label)).not.toBeChecked();
    });
  });
}
