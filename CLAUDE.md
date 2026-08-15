# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

A Next.js + TypeScript playground for comparing six open-source rich-text editors (TipTap, Toast UI Editor, Editor.js/Codex, Slate, Lexical, CKEditor 5) in a single consistent workspace UI.

## Commands

```bash
npm run dev          # Start dev server at http://localhost:3000
npm run build        # Production build
npm run lint         # ESLint
npm run typecheck    # tsc --noEmit
npm test             # Vitest unit tests (jsdom, no browser)
npm run test:watch   # Vitest in watch mode
npm run test:coverage
npm run test:e2e     # Playwright E2E (auto-starts dev server on port 3101)
npm run test:e2e:smoke  # Smoke suite only
```

To run a single Vitest test file:
```bash
npx vitest run tests/components/NavBar.test.tsx
```

Quality gate before PRs: `npm run lint && npm run typecheck && npm test`

## Architecture

### Pages (`pages/`)
Each editor gets its own page (`tiptap.tsx`, `toast.tsx`, `codex.tsx`, `slate.tsx`, `lexical.tsx`, `ckeditor.tsx`). The home page (`index.tsx`) uses `EDITOR_CATALOG` for navigation. All pages wrap their editor in `EditorWorkspace` (the shared shell).

### Shared shell (`components/`)
- `EditorWorkspace.tsx` — layout shell used by every editor page: header, `NavBar`, `DarkModeToggle`, optional controls/side/status panels
- `editorCatalog.ts` — single source of truth for editor IDs, names, routes, and GitHub URLs; used by `NavBar` and the home page
- Other components (`AdvancedToolbar`, `CommentTrack`, `PluginManager`, `TrackChanges`, `ValidationStatus`, etc.) are composed into editor pages as needed

### TipTap extensions (`extensions/`)
Custom ProseMirror extensions for TipTap: heading lock, indentation, section nodes, watermark, mark-review wrapper, Yjs collaboration, slash commands, and lint. All extensions are used only in `pages/tiptap.tsx`.

### Utilities (`utils/`)
- `sanitize.ts` — HTML sanitization used before inserting AI suggestions
- `templates.ts` / `templateIntegration.ts` — loading and injecting document templates
- `validation.ts` — document structure validation
- `editorDiagnostics.ts` — shared diagnostics helpers
- `contentEditableCommands.ts` — helpers for `contenteditable` surfaces

### API (`pages/api/`)
- `ai-suggest.ts` — stub POST endpoint; returns uppercased text. Replace the body with a real LLM call to activate AI suggestions in TipTap.

### Planning docs (`.dev/`)
Non-shipped AI workflow files: `PRD.md` (requirements), `AGENTS.md` (agent chain spec). Reference these when scoping new features or understanding original design intent.

### Styles (`styles/`)
Each editor has a dedicated CSS file (`tiptap.css`, `toast.css`, `codex.css`, `slate.css`, `lexical.css`, `ckeditor.css`) plus `globals.css` for shared Tailwind and workspace styles.

### Stubs (`stubs/`)
All heavy editor libraries (CKEditor, Editor.js, Slate, Lexical, Toast UI, Yjs, TipTap table extensions) are aliased to lightweight stubs in `vitest.config.ts` so unit tests run without a browser. The stubs are also used in `next.config.js` for the TipTap table extensions to avoid webpack issues.

## Key conventions

- **Package manager**: `npm` only — `package-lock.json` is authoritative, `.npmrc` enforces lockfile usage.
- **Node version**: 20.19.3 LTS (pinned in `.nvmrc`; CI also uses Node 20).
- **Unit tests** run in jsdom via Vitest; E2E tests run in Chromium via Playwright.
- **Commit style**: Conventional Commits (`feat(editor): ...`, `fix(editor): ...`).
- **LTR contract**: every editor page must set `dir="ltr"` on its editable surface; verified by `tests/e2e/editor-contract.test.ts`.
- **`EDITOR_CATALOG`** in `components/editorCatalog.ts` is the single source of truth for editor metadata — update it when adding or removing editors.
