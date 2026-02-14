import { expect, test } from "@playwright/test";

test("tiptap sidebar toggles heading lock", async ({ page }) => {
  await page.goto("/tiptap");
  await page.getByRole("button", { name: "Open sidebar" }).click();
  const lockButton = page.getByRole("button", { name: "Enable Heading Lock" });
  await expect(lockButton).toBeVisible();
  await lockButton.click();
  await expect(page.getByRole("button", { name: "Disable Heading Lock" })).toBeVisible();
});
