import { test, expect } from "@playwright/test";
test.skip(true, "E2E tests disabled");

const MODULES = ["History", "Clipboard", "Keyboard"];

test.describe("quill module toggles", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/quill");
    await page.getByRole("button", { name: "Modules" }).click();
  });

  for (const name of MODULES) {
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
