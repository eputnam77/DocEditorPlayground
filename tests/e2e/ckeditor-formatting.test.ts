import { test, expect } from "@playwright/test";

test("ckeditor basic formatting", async ({ page }) => {
  await page.goto("/ckeditor");
  const editor = page.locator('[role="textbox"]');
  await editor.click();
  await editor.type("Hello ");
  await page.getByRole("button", { name: "Bold" }).click();
  await editor.type("bold ");
  await page.getByRole("button", { name: "Bold" }).click();
  await page.getByRole("button", { name: "Italic" }).click();
  await editor.type("italic ");
  await page.getByRole("button", { name: "Italic" }).click();
  await page.getByRole("button", { name: "Underline" }).click();
  await editor.type("underline");
  const html = await editor.innerHTML();
  expect(html).toMatch(/<(b|strong)>bold <\/(b|strong)>/);
  expect(html).toMatch(/<(i|em)>italic <\/(i|em)>/);
  expect(html).toMatch(/(<u>underline<\/u>)|(<span style="text-decoration: underline;">underline<\/span>)/);
});
