import { test, expect } from "@playwright/test";
test.skip(true, "E2E tests disabled");

const PLUGINS = ["History", "Lists", "CodeHighlight", "Link"];

test.describe("lexical plugin toggles", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/lexical");
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
