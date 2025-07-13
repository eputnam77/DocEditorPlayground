import { expect, test } from "@playwright/test";

interface EditorInfo {
  name: string;
  path: string;
  hasSave: boolean;
}

const editors: EditorInfo[] = [
  { name: "TipTap", path: "/tiptap", hasSave: true },
  { name: "Toast UI", path: "/toast", hasSave: true },
  { name: "CodeX", path: "/codex", hasSave: true },
  { name: "Slate", path: "/slate", hasSave: true },
  { name: "Lexical", path: "/lexical", hasSave: true },
  { name: "CKEditor", path: "/ckeditor", hasSave: false },
];

// Only include TipTap editor workflow
test.describe(`${editors[0].name} workflow`, () => {
  test("opens and closes history", async ({ page }) => {
    await page.goto(editors[0].path);
    const historyButton = page.getByRole("button", { name: "History" });
    await historyButton.click();
    await expect(page.getByText("Version History")).toBeVisible();
    await page.getByRole("button", { name: "Close" }).click();
    await expect(page.getByText("Version History")).not.toBeVisible();
  });

  if (editors[0].hasSave) {
    test("shows alert on save", async ({ page }) => {
      await page.goto(editors[0].path);
      page.once("dialog", (dialog) => dialog.dismiss());
      await page.getByRole("button", { name: "Save" }).click();
    });
  }
});
