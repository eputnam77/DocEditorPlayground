import { expect, test } from "@playwright/test";

const routes = [
  { name: "TipTap", path: "/tiptap", heading: "TipTap Editor" },
  { name: "Toast UI Editor", path: "/toast", heading: "Toast UI Editor" },
  { name: "Editor.js", path: "/codex", heading: "Editor.js" },
  { name: "Slate", path: "/slate", heading: "Slate editor" },
  { name: "Lexical", path: "/lexical", heading: "Lexical editor" },
  { name: "CKEditor 5", path: "/ckeditor", heading: "CKEditor 5" },
];

test.describe("navigation", () => {
  for (const route of routes) {
    test(`goes to ${route.name} from home`, async ({ page }) => {
      await page.goto("/");
      await page.getByRole("link", { name: route.name }).first().click();
      await expect(page).toHaveURL(route.path);
      if (route.path === "/tiptap") {
        await expect(page.getByText(route.heading)).toBeVisible();
      } else {
        await expect(page.getByRole("heading", { level: 1, name: route.heading })).toBeVisible();
      }
    });
  }

  test("moves from one editor to another using shared nav", async ({ page }) => {
    await page.goto("/lexical");
    await page.getByRole("link", { name: "Slate" }).first().click();
    await expect(page).toHaveURL("/slate");
    await expect(page.getByRole("heading", { level: 1, name: "Slate editor" })).toBeVisible();
    await page.getByRole("link", { name: "CKEditor 5" }).first().click();
    await expect(page).toHaveURL("/ckeditor");
    await expect(page.getByRole("heading", { level: 1, name: "CKEditor 5" })).toBeVisible();
  });
});
