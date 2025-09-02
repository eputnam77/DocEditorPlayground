import { defineConfig } from "vitest/config";
import { resolve } from "path";

export default defineConfig({
  resolve: {
    alias: {
      "@ckeditor/ckeditor5-react": resolve(__dirname, "stubs/ckeditor5-react.tsx"),
      "@ckeditor/ckeditor5-build-classic": resolve(
        __dirname,
        "stubs/ckeditor5-build-classic.ts",
      ),
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    // Run every test file under the tests directory
    include: ["tests/**/*.test.ts?(x)"],
    exclude: ["tests/e2e/**"],
    threads: false,
  },
});
