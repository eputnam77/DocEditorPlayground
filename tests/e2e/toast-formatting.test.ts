import { test, expect } from "@playwright/test";

test("toast basic formatting", async ({ page }) => {
  await page.goto("/toast");
  const editor = page.getByTestId("toast-editor");
  await editor.click();
  await editor.type("Hello ");
  await page.getByRole("button", { name: "Bold" }).click();
  await editor.type("bold ");
  await page.getByRole("button", { name: "Bold" }).click();
  await page.getByRole("button", { name: "Table" }).click();
  const html = await editor.innerHTML();
  expect(html).toMatch(/<(b|strong)>bold <\/(b|strong)>/);
  expect(html).toMatch(/<table/);
});
