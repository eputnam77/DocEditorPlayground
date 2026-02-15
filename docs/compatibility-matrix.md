# Editor Compatibility Matrix

This matrix is the current baseline for this playground.

| Capability | TipTap | Toast UI Editor | Editor.js | Slate | Lexical | CKEditor 5 |
| --- | --- | --- | --- | --- | --- | --- |
| Shared top navigation | Yes | Yes | Yes | Yes | Yes | Yes |
| Theme toggle | Yes | Yes | Yes | Yes | Yes | Yes |
| Full-page editor canvas | Yes | Yes | Yes | Yes | Yes | Yes |
| Shared control bar | Partial (custom toolbar + sidebar) | Yes | Yes | Yes | Yes | Yes |
| Template loading | Yes | Yes | Yes | Yes | Yes | Yes |
| Diagnostics panel | TipTap lint banner + sidebar controls | Yes | Yes | Yes | Yes | Yes |
| Comment panel | Yes | Yes | Yes | Yes | Yes | Yes |
| Track changes summary | Yes | Yes | Yes | Yes | Yes | Yes |
| Heading + list formatting | Yes | Yes | Yes | Yes | Yes | Yes |
| Left-to-right typing baseline | Yes | Yes | Yes | Yes | Yes | Yes |
| E2E smoke coverage | Yes | Yes | Yes | Yes | Yes | Yes |

## Tool references

| Tool | Repository |
| --- | --- |
| TipTap | https://github.com/ueberdosis/tiptap |
| Toast UI Editor | https://github.com/nhn/tui.editor |
| Editor.js | https://github.com/codex-team/editor.js |
| Slate | https://github.com/ianstormtaylor/slate |
| Lexical | https://github.com/facebook/lexical |
| CKEditor 5 | https://github.com/ckeditor/ckeditor5 |

## Notes

- TipTap intentionally uses a richer custom toolbar and sidebar model.
- Other editors use standardized workspace controls and diagnostics.
- This matrix should be updated when behavior changes or new adapters are introduced.
