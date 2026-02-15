# Editor Integrations Fix Plan + Implementation Log

Date: 2026-02-15  
Repo: `DocEditorPlayground`

## Scope

Editors fixed in this pass:

- Toast UI Editor (`/toast`)
- Editor.js (`/codex`)
- Slate (`/slate`)
- Lexical (`/lexical`)
- CKEditor 5 (`/ckeditor`)

TipTap was not removed and remains available.

## Phase 0: Architecture Inventory

### Integration locations

- `pages/toast.tsx`
- `pages/codex.tsx`
- `pages/slate.tsx`
- `pages/lexical.tsx`
- `pages/ckeditor.tsx`

### Shared editor shell and status UI

- Workspace shell/layout: `components/EditorWorkspace.tsx`
- Validation/diagnostics rendering: `components/ValidationStatus.tsx`
- Shared toggle button UX for formatting states: `components/FormatToggleButton.tsx`

### Shared CSS and global style loading

- Global editor stylesheet imports: `pages/_app.tsx:3` to `pages/_app.tsx:10`
- Per-editor overrides:
  - `styles/toast.css`
  - `styles/codex.css`
  - `styles/slate.css`
  - `styles/lexical.css`
  - `styles/ckeditor.css`

### Previous integration risk found

- Runtime had previously been routed through local stubs instead of real editor packages.
- Runtime alias cleanup evidence:
  - `next.config.js:15` to `next.config.js:33` now only aliases TipTap table extensions.
  - `tsconfig.json:19` to `tsconfig.json:26` now only maps TipTap table extensions.
- This removed non-production editor behavior as the default runtime path.

### Run validation implementation

- Old page-level `runValidation` calls were replaced with an editor-agnostic diagnostics adapter:
  - `utils/editorDiagnostics.ts:23` to `utils/editorDiagnostics.ts:125`
- UI label now reflects diagnostics semantics:
  - `components/ValidationStatus.tsx:25`

## Phase 1: Reproduction (Baseline Before Fix) + Directionality Isolation

Baseline repro was performed using each editor page and then codified in Playwright smoke coverage (`tests/e2e/editor-smoke.test.ts`).

### Toast UI Editor

Repro steps:

1. Open `/toast`
2. Type `abc`
3. Try heading and list actions

Expected:

- `abc` remains left-to-right.
- Heading and list commands affect content structure.

Actual before fix:

- Typing order could appear reversed.
- Heading/list behavior and toolbar state were inconsistent with production Toast UI.

Root causes:

- Non-production integration path (stub-based runtime) and non-official toolbar wiring.
- Missing explicit LTR enforcement on actual editable surface.

Evidence/fix points:

- Official Toast UI core editor init: `pages/toast.tsx:49` to `pages/toast.tsx:75`
- Built-in icon toolbar config: `pages/toast.tsx:62` to `pages/toast.tsx:67`
- LTR tagging on editable node: `pages/toast.tsx:29` to `pages/toast.tsx:41`
- LTR/list visibility CSS: `styles/toast.css:3` to `styles/toast.css:29`

### Editor.js

Repro steps:

1. Open `/codex`
2. Type `abc`
3. Use Paragraph/Heading/Bullet/Number controls

Expected:

- Paragraph/Heading convert current block.
- Lists create actual list structure.
- Toolbar indicates active format states.

Actual before fix:

- Paragraph/Heading/list actions were not production-accurate.
- Heading could insert text-like content instead of proper block conversion.
- Toolbar state feedback was weak.

Root causes:

- Partial tool wiring, missing explicit paragraph/header/list production setup.
- No stable active-state synchronization against current block metadata.

Evidence/fix points:

- Official tools config (paragraph/header/list): `pages/codex.tsx:183` to `pages/codex.tsx:203`
- Block conversion logic (uses `blocks.convert` when available): `pages/codex.tsx:254` to `pages/codex.tsx:285`
- Active-state computation: `pages/codex.tsx:117` to `pages/codex.tsx:151`
- LTR tagging on each editable: `pages/codex.tsx:86` to `pages/codex.tsx:107`
- LTR/list CSS: `styles/codex.css:3` to `styles/codex.css:24`
- Startup freeze regression fixed by making `MutationObserver` structural-only (`childList`/`subtree`): `pages/codex.tsx:217` to `pages/codex.tsx:223`

### Slate

Repro steps:

1. Open `/slate`
2. Type `abc`
3. Toggle heading and lists

Expected:

- Proper heading/list node transforms.
- Active toolbar states reflect current selection.

Actual before fix:

- Typing direction could appear incorrect.
- List toggles did not apply structural list nodes.

Root causes:

- Integration relied on simplified editing behavior instead of full Slate schema transforms.
- Missing heading/list element rendering and block transforms.

Evidence/fix points:

- Custom element schema: `pages/slate.tsx:21` to `pages/slate.tsx:35`
- Block toggles for heading/lists: `pages/slate.tsx:84` to `pages/slate.tsx:122`
- Element/leaf rendering (`renderElement`/`renderLeaf`): `pages/slate.tsx:124` to `pages/slate.tsx:166`, `pages/slate.tsx:377` to `pages/slate.tsx:379`
- Active toolbar toggles with `aria-pressed`: `pages/slate.tsx:172` to `pages/slate.tsx:223`
- LTR/list CSS: `styles/slate.css:3` to `styles/slate.css:21`

### Lexical

Repro steps:

1. Open `/lexical`
2. Type `abc`
3. Toggle bold/heading/lists and inspect active states

Expected:

- List commands work via Lexical list plugin/nodes.
- Heading and mark states are reflected in toolbar UI.

Actual before fix:

- Bold/italic worked but list behavior and active-state UX were incomplete.

Root causes:

- Incomplete upstream plugin/node registration and insufficient selection state synchronization.

Evidence/fix points:

- Official Lexical React plugin imports and usage: `pages/lexical.tsx:4` to `pages/lexical.tsx:12`, `pages/lexical.tsx:370` to `pages/lexical.tsx:407`
- Required nodes (heading/list/list-item) in `initialConfig`: `pages/lexical.tsx:252` to `pages/lexical.tsx:262`
- Selection-change and editor-update listeners for active states: `pages/lexical.tsx:117` to `pages/lexical.tsx:134`
- List toggle commands with `REMOVE_LIST_COMMAND`: `pages/lexical.tsx:180` to `pages/lexical.tsx:205`
- LTR/list CSS: `styles/lexical.css:3` to `styles/lexical.css:21`

### CKEditor 5

Repro steps:

1. Open `/ckeditor`
2. Type `abc`
3. Use heading/list toolbar commands and press Enter

Expected:

- Classic toolbar visible and operational.
- Enter creates new paragraph.
- Direction stays LTR.

Actual before fix:

- Toolbar controls were missing or incomplete.
- Editing behavior did not match official CKEditor 5 Classic integration.

Root causes:

- Non-official runtime wiring and SSR/client initialization mismatch for CKEditor modules.
- Editable surface directionality not explicitly forced on CKEditor editable element.

Evidence/fix points:

- Client-only constructor load for Classic build: `pages/ckeditor.tsx:29` to `pages/ckeditor.tsx:39`
- Client-only React CKEditor component import: `pages/ckeditor.tsx:181` to `pages/ckeditor.tsx:187`
- Toolbar config includes heading/bold/italic/lists/undo/redo: `pages/ckeditor.tsx:157` to `pages/ckeditor.tsx:172`
- Editable surface tagged LTR on `onReady`: `pages/ckeditor.tsx:145` to `pages/ckeditor.tsx:151`
- LTR/list CSS: `styles/ckeditor.css:3` to `styles/ckeditor.css:27`

## Phase 2: Upstream Alignment References

Official sources used to align setup:

- Toast UI Editor
  - https://nhn.github.io/tui.editor/latest/
  - https://nhn.github.io/tui.editor/latest/ToastUIEditorCore/ (core options including `initialEditType` and `toolbarItems`)
- Editor.js
  - https://editorjs.io/getting-started/
  - https://github.com/editor-js/header
  - https://github.com/editor-js/list
  - https://github.com/editor-js/paragraph
- Slate
  - https://docs.slatejs.org/walkthroughs/01-installing-slate
  - https://docs.slatejs.org/walkthroughs/03-defining-custom-elements
  - https://docs.slatejs.org/walkthroughs/04-applying-custom-formatting
- Lexical
  - https://lexical.dev/docs/getting-started/react
  - https://lexical.dev/docs/react/plugins
- CKEditor 5
  - https://ckeditor.com/docs/ckeditor5/latest/getting-started/installation/self-hosted/react/react-default-npm.html

## Phase 3: Run Validation Redesign

Changes:

- Replaced vague "Run validation" behavior with concrete diagnostics:
  - non-empty content
  - LTR computed direction
  - HTML export availability
  - JSON export availability
  - heading/list capability flags
  - selection format state availability
- Shared adapter contract:
  - `getContent()`
  - `getDirection()`
  - `getSelectionFormatState()`
- Implementation: `utils/editorDiagnostics.ts:23` to `utils/editorDiagnostics.ts:125`
- Applied in all scoped editor pages:
  - `pages/toast.tsx:107`
  - `pages/codex.tsx:299`
  - `pages/slate.tsx:285`
  - `pages/lexical.tsx:292`
  - `pages/ckeditor.tsx:55`

## Phase 4: Regression Tests + CI Wiring

### New smoke suite

- Added `tests/e2e/editor-smoke.test.ts`
- Coverage per editor:
  - LTR typing order (`abc` stays `abc`)
  - bold application
  - heading application
  - bullet list application
  - numbered list application

### CI wiring

- Added smoke script: `package.json:25`
- CI e2e job now runs smoke suite: `.github/workflows/ci.yml:65` to `.github/workflows/ci.yml:66`

### Supporting unit test updates

- Updated page-level tests to match production-aligned async/editor-host behavior:
  - `tests/pages/toast.test.tsx`
  - `tests/pages/ckeditor.test.tsx`
  - `tests/pages/codex.test.tsx`

## Phase 5: Acceptance Criteria

Criteria considered passed when all are true:

1. Typing direction is LTR in each scoped editor.
2. Bold, heading, bullet list, numbered list all apply via editor-native mechanisms.
3. Toolbar toggles show active/inactive state for selection/context.
4. Diagnostics produce meaningful pass/fail output with reasons.
5. Playwright smoke suite passes in CI.

Verification status on this branch:

- `npm run lint` passed
- `npm run typecheck` passed
- `npm test -- --run` passed
- `npx playwright test tests/e2e/editor-smoke.test.ts` passed (5/5)

## Pinned Stable Versions (Installed)

Resolved versions (`npm ls`) during this fix:

- `@toast-ui/editor@3.2.2`
- `@editorjs/editorjs@2.31.0`
- `@editorjs/header@2.8.8`
- `@editorjs/list@1.10.0`
- `@editorjs/paragraph@2.11.7`
- `slate@0.94.1`
- `slate-react@0.94.2`
- `slate-history@0.113.1`
- `lexical@0.40.0`
- `@lexical/react@0.40.0`
- `@lexical/list@0.40.0`
- `@lexical/rich-text@0.40.0`
- `@lexical/html@0.40.0`
- `@lexical/selection@0.40.0`
- `@ckeditor/ckeditor5-build-classic@39.0.2`
- `@ckeditor/ckeditor5-react@6.3.0`

## Remaining Known Issues

- Next.js warns about multiple lockfiles due a parent-directory lockfile outside this app root. This does not block editor behavior or tests but should be cleaned to avoid workspace-root ambiguity.

## PR-Style Summary

### What changed

- Replaced non-production editor integrations with upstream-aligned setups.
- Fixed LTR direction and list marker visibility across all scoped editors.
- Implemented active-state toolbar UX parity pattern (icon toggles with pressed state).
- Replaced vague validation with actionable diagnostics across editors.
- Added Playwright smoke regression tests and CI wiring for quick editor health checks.

### How to verify

1. `npm ci`
2. `npm run lint && npm run typecheck && npm test -- --run`
3. `npm run test:e2e:smoke`
4. Manually spot-check `/toast`, `/codex`, `/slate`, `/lexical`, `/ckeditor` for heading/list/toggle behavior.
