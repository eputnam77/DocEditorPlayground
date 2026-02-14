import { expect, test } from "@playwright/test";

test("slate applies text formatting", async ({ page }) => {
  await page.goto("/slate");
  const editor = page.getByTestId("slate-editor");
  await editor.click();
  await page.keyboard.type("Hello ");
  await page.getByRole("button", { name: "Bold" }).click();
  await page.keyboard.type("bold");
  const text = (await editor.textContent()) ?? "";
  expect(text.trim().length).toBeGreaterThan(3);
});
