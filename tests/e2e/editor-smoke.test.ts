import { expect, test } from "@playwright/test";

async function selectAll(page: any) {
  await page.keyboard.press("Control+A");
}

async function expectLtrTyping(page: any, selector: string) {
  const editor = page.locator(selector).first();
  await editor.click();
  await page.keyboard.type("abc");
  await expect(editor).toHaveCSS("direction", "ltr");
  await expect
    .poll(async () => (await editor.innerText()).replace(/\s+/g, " "))
    .toContain("abc");
}

test("toast smoke: ltr typing + bold/heading/lists", async ({ page }) => {
  await page.goto("/toast");
  const editor = page.locator("[data-testid='toast-editor']").first();
  await editor.waitFor();

  await expectLtrTyping(page, "[data-testid='toast-editor']");

  await page.evaluate(() => (window as any).toastEditor.setHTML("<p>abc</p>"));
  await editor.click();
  await selectAll(page);
  await page.getByRole("button", { name: "Bold" }).click();
  await expect.poll(async () => await editor.innerHTML()).toMatch(/<(strong|b)[\s>]/i);

  await page.evaluate(() => (window as any).toastEditor.setHTML("<p>abc</p>"));
  await editor.click();
  await selectAll(page);
  await page.evaluate(() =>
    (window as any).toastEditor.exec("heading", { level: 2 }),
  );
  await expect.poll(async () => await editor.innerHTML()).toMatch(/<h[1-6][\s>]/i);

  await page.evaluate(() => (window as any).toastEditor.setHTML("<p>abc</p>"));
  await editor.click();
  await selectAll(page);
  await page.getByRole("button", { name: "Unordered list" }).click();
  await expect.poll(async () => await editor.innerHTML()).toMatch(/<ul[\s>]/i);
  await expect
    .poll(async () => {
      return editor.evaluate((el) => {
        const list = el.querySelector("ul");
        return list ? window.getComputedStyle(list).listStyleType : "none";
      });
    })
    .not.toBe("none");

  await page.evaluate(() => (window as any).toastEditor.setHTML("<p>abc</p>"));
  await editor.click();
  await selectAll(page);
  await page.getByRole("button", { name: "Ordered list", exact: true }).click();
  await expect.poll(async () => await editor.innerHTML()).toMatch(/<ol[\s>]/i);
});

test("editor.js smoke: ltr typing + bold/heading/lists", async ({ page }) => {
  test.setTimeout(120000);
  await page.goto("/codex");
  await expect
    .poll(
      async () =>
        await page.locator("#codex-editor [contenteditable='true']").count(),
      { timeout: 90000 },
    )
    .toBeGreaterThan(0);
  const editor = page.locator("#codex-editor [contenteditable='true']").first();
  await editor.waitFor();

  await expectLtrTyping(page, "#codex-editor [contenteditable='true']");

  await editor.click();
  await selectAll(page);
  await page.getByRole("button", { name: "Bold" }).click();
  const holder = page.locator("#codex-editor");
  await expect.poll(async () => await holder.innerHTML()).toMatch(/<(strong|b)[\s>]/i);

  await editor.click();
  await selectAll(page);
  await page.getByRole("button", { name: "Heading" }).click();
  await expect.poll(async () => await holder.innerHTML()).toMatch(/<h[1-6][\s>]/i);

  await editor.click();
  await selectAll(page);
  await page.getByRole("button", { name: "Bullet list" }).click();
  await expect.poll(async () => await holder.innerHTML()).toMatch(/<ul[\s>]/i);

  await editor.click();
  await selectAll(page);
  await page.getByRole("button", { name: "Numbered list" }).click();
  await expect.poll(async () => await holder.innerHTML()).toMatch(/<ol[\s>]/i);
});

test("slate smoke: ltr typing + bold/heading/lists", async ({ page }) => {
  await page.goto("/slate");
  const editor = page.locator("[data-testid='slate-editor']");
  await editor.waitFor();

  await expectLtrTyping(page, "[data-testid='slate-editor']");

  await editor.click();
  await selectAll(page);
  await page.getByRole("button", { name: "Bold" }).click();
  await expect.poll(async () => await editor.innerHTML()).toMatch(/<(strong|b)[\s>]/i);

  await editor.click();
  await selectAll(page);
  await page.getByRole("button", { name: "Heading" }).click();
  await expect.poll(async () => await editor.innerHTML()).toMatch(/<h2[\s>]/i);

  await editor.click();
  await selectAll(page);
  await page.getByRole("button", { name: "Bullet List" }).click();
  await expect.poll(async () => await editor.innerHTML()).toMatch(/<ul[\s>]/i);

  await editor.click();
  await selectAll(page);
  await page.getByRole("button", { name: "Numbered List" }).click();
  await expect.poll(async () => await editor.innerHTML()).toMatch(/<ol[\s>]/i);
});

test("lexical smoke: ltr typing + bold/heading/lists", async ({ page }) => {
  await page.goto("/lexical");
  const editor = page.locator("[data-testid='lexical-editor']");
  await editor.waitFor();

  await expectLtrTyping(page, "[data-testid='lexical-editor']");

  await editor.click();
  await selectAll(page);
  await page.getByRole("button", { name: "Bold" }).click();
  await expect.poll(async () => await editor.innerHTML()).toMatch(/<(strong|b)[\s>]/i);

  await editor.click();
  await selectAll(page);
  await page.getByRole("button", { name: "Heading" }).click();
  await expect.poll(async () => await editor.innerHTML()).toMatch(/<h2[\s>]/i);

  await editor.click();
  await selectAll(page);
  await page.getByRole("button", { name: "Bullet List" }).click();
  await expect.poll(async () => await editor.innerHTML()).toMatch(/<ul[\s>]/i);

  await editor.click();
  await selectAll(page);
  await page.getByRole("button", { name: "Numbered List" }).click();
  await expect.poll(async () => await editor.innerHTML()).toMatch(/<ol[\s>]/i);
});

test("ckeditor smoke: ltr typing + bold/heading/lists", async ({ page }) => {
  await page.goto("/ckeditor");
  const editor = page.locator("[role='textbox']").first();
  await editor.waitFor();

  await expectLtrTyping(page, "[role='textbox']");

  await editor.click();
  await selectAll(page);
  await page.evaluate(() => (window as any).ckeditorEditor.execute("bold"));
  await expect.poll(async () => await editor.innerHTML()).toMatch(/<(strong|b)[\s>]/i);

  await editor.click();
  await selectAll(page);
  await page.evaluate(() =>
    (window as any).ckeditorEditor.execute("heading", { value: "heading2" }),
  );
  await expect.poll(async () => await editor.innerHTML()).toMatch(/<h[1-6][\s>]/i);

  await editor.click();
  await selectAll(page);
  await page.evaluate(() => (window as any).ckeditorEditor.execute("bulletedList"));
  await expect.poll(async () => await editor.innerHTML()).toMatch(/<ul[\s>]/i);
  await expect
    .poll(async () => {
      return editor.evaluate((el) => {
        const list = el.querySelector("ul");
        return list ? window.getComputedStyle(list).listStyleType : "none";
      });
    })
    .not.toBe("none");

  await editor.click();
  await selectAll(page);
  await page.evaluate(() => (window as any).ckeditorEditor.execute("numberedList"));
  await expect.poll(async () => await editor.innerHTML()).toMatch(/<ol[\s>]/i);
});
