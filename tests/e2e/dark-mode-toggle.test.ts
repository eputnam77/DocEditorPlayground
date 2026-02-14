import { expect, test } from "@playwright/test";

test.describe("dark mode toggle", () => {
  test("toggles theme on home page", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByTestId("dark-mode-toggle").first();
    await expect(toggle).toBeVisible();
    await expect(page.locator("html")).not.toHaveClass(/dark/);
    await toggle.click();
    await expect(page.locator("html")).toHaveClass(/dark/);
  });

  test("is available on editor pages", async ({ page }) => {
    await page.goto("/slate");
    const toggle = page.getByTestId("dark-mode-toggle").first();
    await expect(toggle).toBeVisible();
    await toggle.click();
    await expect(page.locator("html")).toHaveClass(/dark/);
  });
});
