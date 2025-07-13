import { test, expect } from "@playwright/test";

const PLUGINS = ["History", "Lists"];

test.describe("slate plugin toggles", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/slate");
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
