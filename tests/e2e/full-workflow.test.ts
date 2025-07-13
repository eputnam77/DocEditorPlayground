import { test, expect } from "@playwright/test";
test.skip(true, "E2E tests disabled");

interface EditorWorkflow {
  path: string;
  pluginMenu: { name: string };
  pluginLabel: string;
  hasSave: boolean;
}

const editors: EditorWorkflow[] = [
  { path: "/tiptap", pluginMenu: { name: "Extensions" }, pluginLabel: "Underline", hasSave: true },
  { path: "/toast", pluginMenu: { name: "Plugins" }, pluginLabel: "ColorSyntax", hasSave: true },
  { path: "/codex", pluginMenu: { name: "Plugins" }, pluginLabel: "Checklist", hasSave: true },
  { path: "/quill", pluginMenu: { name: "Modules" }, pluginLabel: "History", hasSave: true },
  { path: "/slate", pluginMenu: { name: "Plugins" }, pluginLabel: "History", hasSave: true },
  { path: "/lexical", pluginMenu: { name: "Plugins" }, pluginLabel: "CodeHighlight", hasSave: true },
  { path: "/ckeditor", pluginMenu: { name: "Plugins" }, pluginLabel: "Bold", hasSave: false },
];

for (const editor of editors) {
  test.describe(`${editor.path} full workflow`, () => {
    test("runs full editor workflow", async ({ page }) => {
      await page.goto(editor.path);

      // toggle and persist plugin
      await page.getByRole("button", editor.pluginMenu).click();
      const checkbox = page.getByLabel(editor.pluginLabel);
      await expect(checkbox).toBeChecked();
      await checkbox.uncheck();
      await page.getByRole("button", { name: "Close" }).click();
      await page.reload();
      await page.getByRole("button", editor.pluginMenu).click();
      await expect(page.getByLabel(editor.pluginLabel)).not.toBeChecked();
      await page.getByRole("button", { name: "Close" }).click();

      // open and close history
      const historyButton = page.getByRole("button", { name: "History" });
      await historyButton.click();
      await expect(page.getByText("Version History")).toBeVisible();
      await page.getByRole("button", { name: "Close" }).click();
      await expect(page.getByText("Version History")).not.toBeVisible();

      // save action shows alert if supported
      if (editor.hasSave) {
        page.once("dialog", (dialog) => dialog.dismiss());
        await page.getByRole("button", { name: "Save" }).click();
      }
    });
  });
}
