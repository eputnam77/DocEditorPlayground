import { expect, test } from "@playwright/test";

test("slate plugin menu toggles Lists", async ({ page }) => {
  await page.goto("/slate");
  await page.getByRole("button", { name: "Plugins" }).click();
  const listToggle = page.getByLabel("Lists");
  await expect(listToggle).toBeChecked();
  await listToggle.uncheck();
  await expect(listToggle).not.toBeChecked();
  await listToggle.check();
  await expect(listToggle).toBeChecked();
});
