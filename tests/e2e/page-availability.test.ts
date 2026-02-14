import { expect, test } from "@playwright/test";

const pages = [
  { path: "/", heading: "Evaluate editors with one consistent workflow", asHeading: true },
  { path: "/tiptap", heading: "TipTap Editor", asHeading: false },
  { path: "/toast", heading: "Toast UI Editor", asHeading: true },
  { path: "/codex", heading: "Editor.js", asHeading: true },
  { path: "/slate", heading: "Slate editor", asHeading: true },
  { path: "/lexical", heading: "Lexical editor", asHeading: true },
  { path: "/ckeditor", heading: "CKEditor 5", asHeading: true },
];

for (const { path, heading, asHeading } of pages) {
  test(`opens ${path}`, async ({ page }) => {
    await page.goto(path);
    if (asHeading) {
      await expect(page.getByRole("heading", { level: 1, name: heading })).toBeVisible();
    } else {
      await expect(page.getByText(heading).first()).toBeVisible();
    }
  });
}
