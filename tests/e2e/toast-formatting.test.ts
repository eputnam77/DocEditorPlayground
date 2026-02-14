import { expect, test } from "@playwright/test";

test("toast editor keeps typed content", async ({ page }) => {
  await page.goto("/toast");
  const editor = page.getByTestId("toast-editor");
  await editor.click();
  await page.keyboard.type("Toast sample text");
  const text = (await editor.textContent()) ?? "";
  expect(text.trim().length).toBeGreaterThan(4);
});
