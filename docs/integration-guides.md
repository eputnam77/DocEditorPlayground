# Integration Guides

This guide documents the current production-aligned integrations used in this playground.

## TipTap

- Description: Headless ProseMirror-based framework for building custom editors.
- Repository: https://github.com/ueberdosis/tiptap
- Integration pattern:
  1. Install `@tiptap/react` plus required extensions.
  2. Build the editor with an explicit `extensions` array.
  3. Add or remove behavior by adding or removing extensions.

## Toast UI Editor

- Description: Markdown + WYSIWYG editor with built-in toolbar controls.
- Repository: https://github.com/nhn/tui.editor
- Integration pattern:
  1. Install `@toast-ui/editor`.
  2. Create the editor with `new Editor({ ... })`.
  3. Configure `initialEditType: "wysiwyg"` and `toolbarItems` for heading/lists/marks.

## Editor.js

- Description: Block editor with structured tool-based content blocks.
- Repository: https://github.com/codex-team/editor.js
- Integration pattern:
  1. Install `@editorjs/editorjs` and tools (for example `@editorjs/header`, `@editorjs/list`, `@editorjs/paragraph`).
  2. Initialize with a `tools` object.
  3. Convert/insert blocks through the `blocks` API.

## Slate

- Description: Customizable rich-text framework with app-defined schema and commands.
- Repository: https://github.com/ianstormtaylor/slate
- Integration pattern:
  1. Install `slate`, `slate-react`, and `slate-history`.
  2. Define element and leaf renderers.
  3. Implement mark/block toggle commands in app code.

## Lexical

- Description: Extensible React editor framework focused on performance and correctness.
- Repository: https://github.com/facebook/lexical
- Integration pattern:
  1. Install `lexical`, `@lexical/react`, and required packages (`@lexical/list`, `@lexical/rich-text`, `@lexical/html`).
  2. Register required nodes in `initialConfig.nodes`.
  3. Use plugins like `HistoryPlugin`, `ListPlugin`, and `OnChangePlugin`.

## CKEditor 5

- Description: Full-featured rich-text framework with a classic toolbar workflow.
- Repository: https://github.com/ckeditor/ckeditor5
- Integration pattern:
  1. Install `@ckeditor/ckeditor5-react` and a build package such as `@ckeditor/ckeditor5-build-classic`.
  2. Load editor modules on the client side.
  3. Configure toolbar items in `config.toolbar.items`.
