import { test, expect } from "@playwright/test";

const EXTENSIONS = ["StarterKit", "Underline", "History"];

test.describe("tiptap extension toggles", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/tiptap");
    await page.getByRole("button", { name: "Extensions" }).click();
  });

  for (const name of EXTENSIONS) {
    test(`toggle ${name}`, async ({ page }) => {
      const checkbox = page.getByLabel(name);
      await expect(checkbox).toBeChecked();
      await checkbox.uncheck();
      await expect(checkbox).not.toBeChecked();
      await checkbox.check();
      await expect(checkbox).toBeChecked();
    });
  }
});
