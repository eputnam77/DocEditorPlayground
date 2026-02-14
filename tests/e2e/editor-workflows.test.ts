import { expect, test } from "@playwright/test";

interface EditorCase {
  name: string;
  path: string;
  selector: string;
  runValidation?: boolean;
}

const editors: EditorCase[] = [
  { name: "TipTap", path: "/tiptap", selector: ".ProseMirror", runValidation: false },
  { name: "Toast UI", path: "/toast", selector: '[data-testid="toast-editor"]', runValidation: true },
  { name: "Editor.js", path: "/codex", selector: '[data-testid="codex-editor"]', runValidation: true },
  { name: "Slate", path: "/slate", selector: '[data-testid="slate-editor"]', runValidation: true },
  { name: "Lexical", path: "/lexical", selector: '[data-testid="lexical-editor"]', runValidation: true },
  { name: "CKEditor 5", path: "/ckeditor", selector: '[role="textbox"]', runValidation: true },
];

for (const editor of editors) {
  test(`${editor.name} basic authoring workflow`, async ({ page }) => {
    await page.goto(editor.path);
    const area = page.locator(editor.selector).first();
    await area.click();
    await page.keyboard.type(`${editor.name} workflow sample`);
    const text = (await area.textContent()) ?? "";
    expect(text.trim().length).toBeGreaterThan(6);

    if (editor.path === "/tiptap") {
      page.once("dialog", (dialog) => dialog.dismiss());
      await page.getByRole("button", { name: "Save" }).click();
    }

    if (editor.runValidation) {
      await page.getByRole("button", { name: "Run validation" }).click();
      await expect(page.getByText("Validation results")).toBeVisible();
    }
  });
}
