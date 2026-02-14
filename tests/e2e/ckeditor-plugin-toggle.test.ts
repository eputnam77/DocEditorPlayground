import { expect, test } from "@playwright/test";

test("ckeditor plugin menu toggles Bold", async ({ page }) => {
  await page.goto("/ckeditor");
  await page.getByRole("button", { name: "Plugins" }).click();
  const boldToggle = page.getByRole("checkbox", { name: /bold/i });
  await expect(boldToggle).toBeChecked();
  await boldToggle.uncheck();
  await expect(boldToggle).not.toBeChecked();
  await boldToggle.check();
  await expect(boldToggle).toBeChecked();
});
