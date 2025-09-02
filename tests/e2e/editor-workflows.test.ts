import { expect, test } from "@playwright/test";

interface EditorInfo {
  name: string;
  path: string;
  selector: string;
  hasSave: boolean;
  useKeyboard?: boolean;
  formatWithKeyboard?: boolean;
}

const editors: EditorInfo[] = [
  { name: "TipTap", path: "/tiptap", selector: ".ProseMirror", hasSave: true },
  {
    name: "Toast UI",
    path: "/toast",
    selector: '[data-testid="toast-editor"]',
    hasSave: false,
  },
  {
    name: "CodeX",
    path: "/codex",
    selector: '[data-testid="codex-editor"]',
    hasSave: false,
    useKeyboard: true,
    formatWithKeyboard: true,
  },
  {
    name: "Slate",
    path: "/slate",
    selector: '[data-testid="slate-editor"]',
    hasSave: false,
  },
  {
    name: "Lexical",
    path: "/lexical",
    selector: '[data-testid="lexical-editor"]',
    hasSave: false,
  },
  {
    name: "CKEditor",
    path: "/ckeditor",
    selector: '[role="textbox"]',
    hasSave: false,
  },
];

for (const editor of editors) {
  test.describe(`${editor.name} workflow`, () => {
    test("types, formats and saves", async ({ page }) => {
      await page.goto(editor.path);

      const area = page.locator(editor.selector);
      await area.click();
      if (editor.useKeyboard) {
        await page.keyboard.type("Hello ");
      } else {
        await area.type("Hello ");
      }

      if (editor.formatWithKeyboard) {
        await page.keyboard.down("Control");
        await page.keyboard.press("b");
        await page.keyboard.up("Control");
      } else {
        await page.getByRole("button", { name: "Bold" }).click();
      }
      if (editor.useKeyboard) {
        await page.keyboard.type("bold");
      } else {
        await area.type("bold");
      }
      if (editor.formatWithKeyboard) {
        await page.keyboard.down("Control");
        await page.keyboard.press("b");
        await page.keyboard.up("Control");
      } else {
        await page.getByRole("button", { name: "Bold" }).click();
      }

      const html = await area.innerHTML();
      expect(html).toMatch(/<(b|strong)>bold<\/(b|strong)>/i);

      if (editor.hasSave) {
        page.once("dialog", (dialog) => dialog.dismiss());
        await page.getByRole("button", { name: "Save" }).click();
      }
    });
  });
}

