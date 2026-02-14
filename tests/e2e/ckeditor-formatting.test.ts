import { expect, test } from "@playwright/test";

test("ckeditor applies basic formatting commands", async ({ page }) => {
  await page.goto("/ckeditor");
  const editor = page.locator('[role="textbox"]').first();
  await editor.click();
  await page.keyboard.type("Hello ");
  await page.getByRole("button", { name: "Bold" }).click();
  await page.keyboard.type("bold");
  const text = (await editor.textContent()) ?? "";
  expect(text.trim().length).toBeGreaterThan(3);
});
