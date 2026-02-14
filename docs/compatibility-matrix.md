# Editor Compatibility Matrix

This matrix is the current baseline for this playground.

| Capability | TipTap | Toast UI Editor | Editor.js | Slate | Lexical | CKEditor 5 |
| --- | --- | --- | --- | --- | --- | --- |
| Shared top navigation | Yes | Yes | Yes | Yes | Yes | Yes |
| Theme toggle | Yes | Yes | Yes | Yes | Yes | Yes |
| Full-page editor canvas | Yes | Yes | Yes | Yes | Yes | Yes |
| Shared control bar | Partial (custom toolbar + sidebar) | Yes | Yes | Yes | Yes | Yes |
| Template loading | Yes | Yes | Yes | Yes | Yes | Yes |
| Validation panel | TipTap lint banner + sidebar controls | Yes | Yes | Yes | Yes | Yes |
| Comment panel | Yes | Yes | Yes | Yes | Yes | Yes |
| Track changes summary | Yes | Yes | Yes | Yes | Yes | Yes |
| Plugin/extension toggles | Yes (sidebar) | Yes | Yes | Yes | Yes | Yes |
| E2E baseline coverage | Yes | Yes | Yes | Yes | Yes | Yes |

## Notes

- TipTap intentionally uses a richer custom toolbar and sidebar model.
- Other editors use the standardized workspace controls region.
- This matrix should be updated when behavior changes or new adapters are introduced.
