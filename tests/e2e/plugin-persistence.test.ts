import { expect, test } from "@playwright/test";

test("tiptap keeps sidebar toggle state while staying on page", async ({ page }) => {
  await page.goto("/tiptap");
  await page.getByRole("button", { name: "Open sidebar" }).click();
  await page.getByRole("button", { name: "Enable Indentation" }).click();
  await expect(page.getByRole("button", { name: "Disable Indentation" })).toBeVisible();
  await page.getByRole("button", { name: "Close sidebar" }).click();
  await page.getByRole("button", { name: "Open sidebar" }).click();
  await expect(page.getByRole("button", { name: "Disable Indentation" })).toBeVisible();
});
