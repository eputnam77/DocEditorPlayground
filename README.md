# Document Editor Playground

Compare multiple open-source authoring editors in one consistent, full-page UI.

## What this app does

- Provides dedicated pages for `TipTap`, `Toast UI Editor`, `Editor.js`, `Slate`, `Lexical`, and `CKEditor 5`.
- Uses a shared workspace shell for navigation, theme toggle, controls, validation, and comments.
- Lets users move editor to editor with the same test flow: type content, toggle plugins, run validation, and compare behavior.

## Editor routes

- `/` Home and editor selection
- `/tiptap` TipTap advanced workspace (custom sidebar, AI suggest, collaboration toggles)
- `/toast` Toast UI workflow page
- `/codex` Editor.js workflow page
- `/slate` Slate workflow page
- `/lexical` Lexical workflow page
- `/ckeditor` CKEditor 5 workflow page

## Quick start

1. Install dependencies.

```bash
npm install
```

2. Start the app.

```bash
npm run dev
```

3. Open `http://localhost:3000`.

## Repository hygiene baseline

- Package manager: `npm` only.
- Authoritative lockfile: `package-lock.json` in this repository root.
- NPM policy: `.npmrc` enforces lockfile usage and engine checks.

If Next.js warns about multiple lockfiles, your checkout is likely nested inside another JavaScript project that also has a lockfile in a parent folder. Use a standalone clone location, or remove parent lockfiles for local development.

## Test and quality commands

Run lint, type checks, unit tests, and E2E:

```bash
npm run lint
npm run typecheck
npm test
npx playwright install chromium
npm run test:e2e
```

## Test coverage status

- Unit tests: `138` passing
- E2E tests: `38` passing

See `tests/E2E_REPORT.md` for current E2E notes.

## Documentation

- Integration guide: `docs/integration-guides.md`
- Compatibility matrix: `docs/compatibility-matrix.md`
- Editor scenario guides:
  - `docs/scenarios/tiptap.md`
  - `docs/scenarios/toast.md`
  - `docs/scenarios/codex.md`
  - `docs/scenarios/slate.md`
  - `docs/scenarios/lexical.md`
  - `docs/scenarios/ckeditor.md`

## Notes

- Some editor integrations are intentionally lightweight to keep local startup and tests deterministic.
