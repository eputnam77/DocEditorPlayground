import { test, expect } from "@playwright/test";

test("lexical basic formatting", async ({ page }) => {
  await page.goto("/lexical");
  const editor = page.locator('[data-testid="lexical-editor"]');
  await editor.click();
  await editor.type("Hello ");
  await page.getByRole("button", { name: "Bold" }).click();
  await editor.type("bold ");
  await page.getByRole("button", { name: "Bold" }).click();
  await page.getByRole("button", { name: "Italic" }).click();
  await editor.type("italic");
  await page.getByRole("button", { name: "Italic" }).click();
  await page.getByRole("button", { name: "Bullet List" }).click();
  await editor.press("Enter");
  await editor.type("item");
  const html = await editor.innerHTML();
  expect(html).toMatch(/<(b|strong)>bold <\/(b|strong)>/);
  expect(html).toMatch(/<(i|em)>italic<\/(i|em)>/);
  expect(html).toMatch(/<ul>/);
});
