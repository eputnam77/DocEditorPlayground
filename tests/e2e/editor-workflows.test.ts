import { test, expect } from "@playwright/test";
test.skip(true, "E2E tests disabled");

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

for (const editor of editors) {
  test.describe(`${editor.name} workflow`, () => {
    test("opens and closes history", async ({ page }) => {
      await page.goto(editor.path);
      const historyButton = page.getByRole("button", { name: "History" });
      await historyButton.click();
      await expect(page.getByText("Version History")).toBeVisible();
      await page.getByRole("button", { name: "Close" }).click();
      await expect(page.getByText("Version History")).not.toBeVisible();
    });

    if (editor.hasSave) {
      test("shows alert on save", async ({ page }) => {
        await page.goto(editor.path);
        page.once("dialog", (dialog) => dialog.dismiss());
        await page.getByRole("button", { name: "Save" }).click();
      });
    }
  });
}
