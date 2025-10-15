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
      "@editorjs/editorjs": resolve(__dirname, "stubs/editorjs.ts"),
      "@editorjs/header": resolve(__dirname, "stubs/editorjs-header.ts"),
      "@editorjs/list": resolve(__dirname, "stubs/editorjs-list.ts"),
      slate: resolve(__dirname, "stubs/slate.ts"),
      "slate-react": resolve(__dirname, "stubs/slate-react.tsx"),
      "@toast-ui/react-editor": resolve(
        __dirname,
        "stubs/toast-ui-react-editor.tsx",
      ),
      "@toast-ui/editor-plugin-code-syntax-highlight": resolve(
        __dirname,
        "stubs/toast-ui-editor-plugin-code-syntax-highlight.ts",
      ),
      "@toast-ui/editor-plugin-table-merged-cell": resolve(
        __dirname,
        "stubs/toast-ui-editor-plugin-table-merged-cell.ts",
      ),
      "@toast-ui/editor-plugin-color-syntax": resolve(
        __dirname,
        "stubs/toast-ui-editor-plugin-color-syntax.ts",
      ),
      "@toast-ui/editor-plugin-chart": resolve(
        __dirname,
        "stubs/toast-ui-editor-plugin-chart.ts",
      ),
      "@vitest/coverage-v8": resolve(__dirname, "stubs/vitest-coverage-v8.ts"),
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
