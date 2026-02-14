import { expect, test } from "@playwright/test";

test("cross-editor workflow: edit in Slate then switch to Lexical", async ({ page }) => {
  await page.goto("/slate");
  await page.getByTestId("slate-editor").click();
  await page.keyboard.type("Shared scenario draft");
  await page.getByRole("button", { name: "Run validation" }).click();
  await expect(page.getByText("Validation results")).toBeVisible();

  await page.getByRole("link", { name: "Lexical" }).first().click();
  await expect(page).toHaveURL("/lexical");
  await page.getByTestId("lexical-editor").click();
  await page.keyboard.type("Second editor verification");
  await expect(page.getByTestId("lexical-editor")).toContainText("verification");
});
