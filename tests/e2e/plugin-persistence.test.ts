import { expect, test } from "@playwright/test";

test.describe("TipTap extension persistence", () => {
  test("persists Underline toggle", async ({ page }) => {
    await page.goto("/tiptap");
    await page.getByRole("button", { name: "Extensions" }).click();
    const checkbox = page.getByLabel("Underline");
    await expect(checkbox).toBeChecked();
    await checkbox.uncheck();
    await page.getByRole("button", { name: "Close" }).click();
    await page.reload();
    await page.getByRole("button", { name: "Extensions" }).click();
    await expect(page.getByLabel("Underline")).not.toBeChecked();
  });
});
