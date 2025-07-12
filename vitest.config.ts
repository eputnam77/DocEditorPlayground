import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {
      "@toast-ui/react-editor": "./stubs/toast-ui-react-editor.js",
      "@toast-ui/editor/dist/toastui-editor.css": "./stubs/toastui-editor.css",
      "@editorjs/editorjs": "./stubs/editorjs.js",
      "@editorjs/header": "./stubs/editorjs-header.js",
      "@editorjs/list": "./stubs/editorjs-list.js",
      "@ckeditor/ckeditor5-react": "./stubs/ckeditor5-react.js",
      "@ckeditor/ckeditor5-build-classic": "./stubs/ckeditor5-build-classic.js",
      quill: "./stubs/quill.js",
      slate: "./stubs/slate.js",
      "slate-react": "./stubs/slate-react.js",
      lexical: "./stubs/lexical.js",
      "@lexical/react/LexicalComposer": "./stubs/lexical-react.js",
      "@tiptap/react": "./stubs/tiptap-react.js",
      "@tiptap/starter-kit": "./stubs/tiptap-starter-kit.js",
    },
  },
  test: {
    globals: true,
    environment: "node",
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "dist/",
        "tests/",
        "**/*.d.ts",
        "**/*.test.ts",
        "**/*.spec.ts",
      ],
    },
  },
});
