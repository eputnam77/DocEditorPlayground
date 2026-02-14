import { expect, test } from "@playwright/test";

test("toast plugin menu toggles CodeSyntax", async ({ page }) => {
  await page.goto("/toast");
  await page.getByRole("button", { name: "Plugins" }).click();
  const toggle = page.getByLabel("CodeSyntax");
  await expect(toggle).toBeChecked();
  await toggle.uncheck();
  await expect(toggle).not.toBeChecked();
  await toggle.check();
  await expect(toggle).toBeChecked();
});
