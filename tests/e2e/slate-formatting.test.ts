import { test, expect } from "@playwright/test";

test("slate basic formatting", async ({ page }) => {
  await page.goto("/slate");
  const editor = page.locator('[data-testid="slate-editor"]');
  await editor.click();
  await editor.type("Hello ");
  await page.getByRole("button", { name: "Bold" }).click();
  await editor.type("bold");
  await page.getByRole("button", { name: "Bold" }).click();
  const html = await editor.innerHTML();
  expect(html).toMatch(/<(b|strong)>bold<\/(b|strong)>/i);
});
