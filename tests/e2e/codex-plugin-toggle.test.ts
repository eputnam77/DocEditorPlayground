import { test, expect } from "@playwright/test";

const PLUGINS = ["Header", "List"];

test.describe("codex plugin toggles", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/codex");
    await page.getByRole("button", { name: "Plugins" }).click();
  });

  for (const name of PLUGINS) {
    test(`toggle ${name}`, async ({ page }) => {
      const checkbox = page.getByLabel(name);
      await expect(checkbox).toBeChecked();
      await checkbox.uncheck();
      await expect(checkbox).not.toBeChecked();
      await checkbox.check();
      await expect(checkbox).toBeChecked();
    });
  }

  test("type content and insert header block", async ({ page }) => {
    await page.goto("/codex");
    const editor = page.getByTestId("codex-editor");
    await editor.click();
    await page.keyboard.type("Hello world");
    await page.getByRole("button", { name: "Plugins" }).click();
    const headerToggle = page.getByLabel("Header");
    await headerToggle.uncheck();
    await headerToggle.check();
    await page.getByRole("button", { name: "Plugins" }).click();
    await page.evaluate(() =>
      (window as any).editor.blocks.insert("header", { text: "Title" }),
    );
    const data = await page.evaluate(() => (window as any).editor.save());
    expect(data.blocks[0].type).toBe("paragraph");
    expect(data.blocks[0].data.text).toContain("Hello world");
    expect(data.blocks[1].type).toBe("header");
    expect(data.blocks[1].data.text).toBe("Title");
  });
});
