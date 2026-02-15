import { expect, test } from "@playwright/test";

const EDITOR_NAV_LABELS = [
  "TipTap",
  "Toast UI Editor",
  "Editor.js",
  "Slate",
  "Lexical",
  "CKEditor 5",
];

const ALL_EDITOR_ROUTES = [
  "/tiptap",
  "/toast",
  "/codex",
  "/slate",
  "/lexical",
  "/ckeditor",
];

const WORKSPACE_ROUTES = ["/toast", "/codex", "/slate", "/lexical", "/ckeditor"];

const DIRECTION_SELECTORS: Record<string, string> = {
  "/tiptap": ".tiptap-content",
  "/toast": ".toast-editor-shell",
  "/codex": "#codex-editor",
  "/slate": "[data-testid='slate-editor']",
  "/lexical": "[data-testid='lexical-editor']",
  "/ckeditor": ".ckeditor-editor-shell",
};

test("contract: navigation is available across editor routes", async ({ page }) => {
  for (const route of ALL_EDITOR_ROUTES) {
    await page.goto(route);
    for (const navLabel of EDITOR_NAV_LABELS) {
      await expect(page.getByRole("link", { name: navLabel }).first()).toBeVisible();
    }
  }
});

test("contract: theme preference persists across route changes", async ({ page }) => {
  await page.goto("/toast");
  const toggle = page.getByTestId("dark-mode-toggle").first();
  await toggle.click();
  await expect(page.locator("html")).toHaveClass(/dark/);

  await page.getByRole("link", { name: "Lexical" }).first().click();
  await expect(page).toHaveURL("/lexical");
  await expect(page.locator("html")).toHaveClass(/dark/);

  await page.reload();
  await expect(page.locator("html")).toHaveClass(/dark/);
});

test("contract: shared workspace shell is present for baseline editors", async ({ page }) => {
  for (const route of WORKSPACE_ROUTES) {
    await page.goto(route);
    await expect(page.getByTestId("workspace-controls")).toBeVisible();
    await expect(page.getByTestId("workspace-editor")).toBeVisible();
    await expect(page.getByTestId("comment-track")).toBeVisible();
  }
});

test("contract: editor input direction is left-to-right", async ({ page }) => {
  for (const [route, selector] of Object.entries(DIRECTION_SELECTORS)) {
    await page.goto(route);
    const editorSurface = page.locator(selector).first();
    await expect(editorSurface).toBeVisible();
    await expect(editorSurface).toHaveCSS("direction", "ltr");
  }
});
