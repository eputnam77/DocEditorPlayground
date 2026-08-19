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
npm run templates:build # Regenerate utils/templateContent.ts from public/templates/
```

To run a single Vitest test file:
```bash
npx vitest run tests/components/NavBar.test.tsx
```

Quality gate before PRs: `npm run lint && npm run typecheck && npm test`

## Architecture

### Pages (`pages/`)
Each editor gets its own page (`ckeditor.tsx`, `tiptap.tsx`, `toast.tsx`, `codex.tsx`, `slate.tsx`, `lexical.tsx`). The home page (`index.tsx`) uses `EDITOR_CATALOG` for the nav, the comparison table, and the editor index. Every page except `tiptap.tsx` wraps its editor in `EditorWorkspace`; TipTap composes `WorkspaceChrome` directly because it also owns an extensions drawer.

Each page's job is to make its editor's *differences* visible: a `surfaceNote` callout saying what to look for, an `EditorOutputPanel` showing the live document as HTML/JSON/Markdown (with unsupported formats shown disabled), and an `EditorProfile` panel built from `EDITOR_CATALOG` metadata.

### Shared shell (`components/`)
- `EditorWorkspace.tsx` — layout shell: exports `WorkspaceChrome` (top bar + `NavBar` + `DarkModeToggle`) and the default `EditorWorkspace` (chrome plus title block, controls, `diagnostics`, `surfaceNote`, editor, status/side panels). Diagnostics render directly under the controls, not at the bottom of the page, so "Run diagnostics" gives immediate feedback.
- `editorCatalog.ts` — single source of truth for editor IDs, names, routes, GitHub URLs, and the comparison metadata (`dataModel`, `nativeFormat`, `outputs`, `toolbarStyle`, `distinctive`, `tradeoff`). Catalog order drives the nav and the home page.
- `EditorOutputPanel.tsx` — HTML/JSON/Markdown tabs over live getters supplied by each page
- `EditorProfile.tsx` — the "what makes this editor different" panel
- `FormatToggleButton.tsx` — toolbar toggle with a styled hover tooltip (name + shortcut); never ship an icon-only control without one
- Other components (`AdvancedToolbar`, `CommentTrack`, `PluginManager`, `TrackChanges`, `ValidationStatus`, etc.) are composed into editor pages as needed

### TipTap extensions (`extensions/`)
Custom ProseMirror extensions for TipTap: heading lock, indentation, section nodes, watermark, mark-review wrapper, Yjs collaboration, slash commands, and lint. All extensions are used only in `pages/tiptap.tsx`.

### Utilities (`utils/`)
- `sanitize.ts` — HTML sanitization used before inserting AI suggestions
- `templateContent.ts` — **generated**; template bodies compiled into the bundle. Edit the HTML under `public/templates/`, then run `npm run templates:build`. Templates are imported, never fetched: a runtime `fetch("/templates/...")` failed whenever the host served that path differently (auth proxy, path prefix, cold CDN) and every editor showed "Failed to load template".
- `templates.ts` — re-exports the generated template registry
- `templateIntegration.ts` — validating and normalizing externally supplied templates
- `validation.ts` — document structure validation
- `editorDiagnostics.ts` — shared diagnostics helpers
- `contentEditableCommands.ts` — helpers for `contenteditable` surfaces

### API (`pages/api/`)
- `ai-suggest.ts` — stub POST endpoint; returns uppercased text. Replace the body with a real LLM call to activate AI suggestions in TipTap.

### Planning docs (`.dev/`)
Non-shipped AI workflow files: `PRD.md` (requirements), `AGENTS.md` (agent chain spec). Reference these when scoping new features or understanding original design intent.

### Styles (`styles/`)
`globals.css` holds the design system: the "Marked Up" tokens (paper/ink/proofreader-red, Newsreader + Public Sans + IBM Plex Mono), the `dep-*` component classes, and `.dep-doc` — the shared document typography.

`.dep-doc` matters: Tailwind's preflight strips heading sizes and list markers, so editors that ship no content CSS of their own (Slate, Lexical, Editor.js) rendered an `<h2>` identically to a `<p>`, and "make this a heading" looked broken. Every editable surface is wrapped in `.dep-doc`, whose descendant rules reach library-owned DOM.

Each editor also has a dedicated file (`ckeditor.css`, `tiptap.css`, `toast.css`, `codex.css`, `slate.css`, `lexical.css`) for chrome its library owns — including dark-mode theming, which CKEditor takes through its own custom properties and Toast through a container class.

Watch for cross-editor leaks: Toast UI's stylesheet is imported globally and contains a bare `.ProseMirror { color: #222 }`, which lands on TipTap's editable too.

### Stubs (`stubs/`)
All heavy editor libraries (CKEditor, Editor.js, Slate, Lexical, Toast UI, Yjs, TipTap table extensions) are aliased to lightweight stubs in `vitest.config.ts` so unit tests run without a browser. The stubs are also used in `next.config.js` for the TipTap table extensions to avoid webpack issues.

## Key conventions

- **Package manager**: `npm` only — `package-lock.json` is authoritative, `.npmrc` enforces lockfile usage.
- **Node version**: 20.19.3 LTS (pinned in `.nvmrc`; CI also uses Node 20).
- **Unit tests** run in jsdom via Vitest; E2E tests run in Chromium via Playwright.
- **Commit style**: Conventional Commits (`feat(editor): ...`, `fix(editor): ...`).
- **LTR contract**: every editor page must set `dir="ltr"` on its editable surface; verified by `tests/e2e/editor-contract.test.ts`.
- **`EDITOR_CATALOG`** in `components/editorCatalog.ts` is the single source of truth for editor metadata — update it when adding or removing editors. Its array order is the display order everywhere.
- **Nothing is persisted.** There is no Save anywhere; the playground is deliberately stateless.
- **Templates are compiled in**, not fetched — see `utils/templateContent.ts` above.
- **Deployment mirror**: `C:\dev\dep-streamlit` publishes this repo as a static Hugging Face Space. It syncs this tree into its `app/` and layers an overlay on top, so fixes belong here, not there. Its build fails if this repo adds `pages/_document.tsx` — that file is the overlay's injection point, which is why `pages/_app.tsx` carries the `<Head>` font links.
