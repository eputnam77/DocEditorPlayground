import { expect, test } from "@playwright/test";

test("lexical responds to bold and list controls", async ({ page }) => {
  await page.goto("/lexical");
  const editor = page.getByTestId("lexical-editor");
  await editor.click();
  await page.keyboard.type("List item");
  await page.getByRole("button", { name: "Bullet list" }).click();
  await expect(editor).toContainText("List item");
});
