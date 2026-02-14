import { expect, test } from "@playwright/test";

test("lexical plugin menu toggles History", async ({ page }) => {
  await page.goto("/lexical");
  await page.getByRole("button", { name: "Plugins" }).click();
  const historyToggle = page.getByLabel("History");
  await expect(historyToggle).toBeChecked();
  await historyToggle.uncheck();
  await expect(historyToggle).not.toBeChecked();
  await historyToggle.check();
  await expect(historyToggle).toBeChecked();
});
