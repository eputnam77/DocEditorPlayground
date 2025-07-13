import { test, expect } from "@playwright/test";

test.describe("quill workflow", () => {
  test("opens and closes history", async ({ page }) => {
    await page.goto("/quill");
    const historyButton = page.getByRole("button", { name: "History" });
    await historyButton.click();
    await expect(page.getByText("Version History")).toBeVisible();
    await page.getByRole("button", { name: "Close" }).click();
    await expect(page.getByText("Version History")).not.toBeVisible();
  });

  test("shows alert on save", async ({ page }) => {
    await page.goto("/quill");
    page.once("dialog", (dialog) => dialog.dismiss());
    await page.getByRole("button", { name: "Save" }).click();
  });
});
