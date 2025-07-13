import { test, expect } from "@playwright/test";

test.describe("dark mode toggle", () => {
  test("toggles the dark class", async ({ page }) => {
    await page.goto("/");
    const toggle = page.getByTestId("dark-mode-toggle");
    await expect(page.locator("html")).not.toHaveClass(/dark/);
    await toggle.click();
    await expect(page.locator("html")).toHaveClass(/dark/);
    await toggle.click();
    await expect(page.locator("html")).not.toHaveClass(/dark/);
  });
});
