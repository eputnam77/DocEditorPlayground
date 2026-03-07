# AGENTS.md

Codex workflow for this repository. Keep this file aligned with `CLAUDE.md` and `.claude/settings.json` when shared repo rules change.

## Scope

- This repo is a Next.js + TypeScript playground for comparing six rich-text editors in one shared workspace UI.
- Use the active shell from the local environment. Command examples assume `npm` from the repo root.
- Treat `package-lock.json` as authoritative. Use `npm` only.
- Node version is `20.19.3` LTS, as pinned in `.nvmrc`.

## Primary Commands

```bash
npm run dev
npm run build
npm run lint
npm run lint -- --fix
npm run typecheck
npm test
npm run test:watch
npm run test:coverage
npm run test:e2e
npm run test:e2e:smoke
npx vitest run tests/components/NavBar.test.tsx
```

Use the smallest command that proves the change. Escalate to the full gate before handoff.

## Verification Workflow

1. Read the relevant page, component, utility, and test files before editing.
2. Make the smallest change that fixes the issue or implements the feature.
3. Run targeted verification first.
4. Before a PR or handoff, run:

```bash
npm run lint
npm run typecheck
npm test
```

5. Run `npm run build` when the change affects production bundling, Next.js config, or deployability.
6. Run `npm run test:e2e` or `npm run test:e2e:smoke` when the change affects browser behavior, editor contracts, routing, or shared UI flows.

If a command fails, fix the failure or explain why it could not be resolved locally.

## Project Anchors

- `pages/`: one page per editor plus `index.tsx`
- `components/EditorWorkspace.tsx`: shared shell for every editor page
- `components/editorCatalog.ts`: single source of truth for editor IDs, routes, names, and GitHub URLs
- `extensions/`: TipTap-only ProseMirror extensions
- `utils/`: sanitization, templates, validation, diagnostics, and contenteditable helpers
- `pages/api/ai-suggest.ts`: stub AI endpoint that returns uppercased text
- `styles/`: shared globals plus per-editor styles
- `stubs/`: lightweight test and bundling substitutes for heavy editor libraries
- `.dev/`: planning and workflow docs, including this file

## Repo Conventions

- Commits use Conventional Commits such as `feat(editor): add table support`.
- Every editor page must set `dir="ltr"` on its editable surface. `tests/e2e/editor-contract.test.ts` verifies this.
- Update `components/editorCatalog.ts` whenever editors are added, removed, or renamed.
- Unit tests run in jsdom via Vitest. E2E tests run in Chromium via Playwright.
- Keep README and shipped docs aligned with user-visible behavior.

## Working Set Guidance

- Ignore generated and dependency-heavy paths unless the task requires them: `node_modules/`, `.next/`, `build/`, `dist/`, `.git/`, `playwright-report/`, `test-results/`, `lighthouse.html`.
- Avoid reading or rewriting `package-lock.json` unless the change actually updates dependencies.
- After edits, check lint output early so formatting or obvious syntax issues do not compound.

## Delivery Standard

- Summarize the change, note the verification commands you ran, and call out any gaps.
- If behavior changed, update the relevant docs in the same pass.
