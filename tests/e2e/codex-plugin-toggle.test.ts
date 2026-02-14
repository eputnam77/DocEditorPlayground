import { expect, test } from "@playwright/test";

test.describe("editor.js plugin toggles", () => {
  test("toggles Header", async ({ page }) => {
    await page.goto("/codex");
    await page.getByRole("button", { name: "Plugins" }).click();
    const toggle = page.getByLabel("Header");
    await expect(toggle).toBeChecked();
    await toggle.uncheck();
    await expect(toggle).not.toBeChecked();
    await toggle.check();
    await expect(toggle).toBeChecked();
  });

  test("toggles List", async ({ page }) => {
    await page.goto("/codex");
    await page.getByRole("button", { name: "Plugins" }).click();
    const toggle = page.getByLabel("List");
    await expect(toggle).toBeChecked();
    await toggle.uncheck();
    await expect(toggle).not.toBeChecked();
    await toggle.check();
    await expect(toggle).toBeChecked();
  });
});
