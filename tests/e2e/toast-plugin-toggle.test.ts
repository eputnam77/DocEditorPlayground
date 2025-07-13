import { test, expect } from "@playwright/test";

const PLUGINS = ["CodeSyntax", "TableMerge", "ColorSyntax"];

test.describe("toast plugin toggles", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/toast");
    await page.getByRole("button", { name: "Plugins" }).click();
  });

  for (const name of PLUGINS) {
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
