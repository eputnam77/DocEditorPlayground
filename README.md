# Document Editor Playground

This project demonstrates multiple rich text editors side by side using **Next.js** and **TypeScript**. Tailwind CSS styles the UI. Each editor page integrates the official package for that editor.

## Features

- Dedicated pages for **TipTap**, **Toast UI**, **CodeX**, **Slate**, **Lexical** and **CKEditor 5**. Removed **Toast UI** and **Quill** as of July 2025 because those repos haven't been active in over a year.
- Plugin toggles built into each page
- Quick integration tips for each editor
- Track changes and comment widgets
- Heading locking and structure enforcement
- Optional Yjs collaboration, section nodes and watermark
- Indentation controls
- Optional AI Suggest sidebar for rewriting selected text
- Dark mode switch
- Caches templates and validation files for a year via \`Cache-Control\` headers
  configured in **next.config.js**.
- Icons load on demand using dynamic imports so the bundle remains small.
- Navigation links prefetch their target pages on hover for snappy transitions.

### Analyze bundles

Run the Next.js bundle analyzer to inspect bundle sizes:

```bash
npm run analyze
```

Set `ANALYZE=true` when running `next build` to generate the report.

---

# DocEditorPlayground (TypeScript)

Real‑time TipTap editor with Yjs collaboration—ready to hack locally.

**DocEditorPlayground** is a React / TypeScript workspace that showcases TipTap v2 with tables, images, underline, suggestions, and full Yjs‑based live‑collaboration (WebRTC cursors included). The project uses Vite for dev‑server speed and ships with sensible ESLint + Prettier rules.

---

## ✨ Quick install (recommended)

We follow the same pattern as our Python CLIs: keep global tooling isolated (via **nvm** / **nvm‑windows**), then rely on your project‑local `node_modules`.

```bash
# 0 Install Node.js LTS (v22.x recommended) ─────────────────────────────
# macOS / Linux / Codespaces
nvm install --lts
nvm use --lts

# Windows PowerShell (nvm-windows)
nvm install lts
nvm use lts
```

*(Need a specific runtime? Replace `lts` with `20`, `22.1.0`, etc.)*

---

## 1  Install dependencies

```bash
# Standard install
npm install
```

### If you hit TipTap peer‑dep issues

Run the pinned install (one‑time) to satisfy unmet ranges:

```bash
npm install \
  @tiptap/react@2 @tiptap/starter-kit@2 @tiptap/extension-underline@2 \
  @tiptap/extension-table@2 @tiptap/extension-table-row@2 \
  @tiptap/extension-table-cell@2 @tiptap/extension-table-header@2 \
  @tiptap/extension-image@2 @tiptap/extension-collaboration@2 \
  @tiptap/extension-collaboration-cursor@2 @tiptap/suggestion@2 \
  yjs y-webrtc lucide-react \
  --legacy-peer-deps
```

*(The `--legacy-peer-deps` flag skips npm’s strict peer-resolution—handy until TipTap publishes v3 react bindings.)*

---

## 2  (Optional) project setup script

```bash
# Unix / macOS / Codespaces
bash scripts/setup.sh

# Windows users
# • Use Git Bash or WSL for shell scripts
# • Or create a PowerShell (.ps1) equivalent
```

---

## 3  Start the development server

```bash
npm run dev
```

Vite prints a local URL—open it in your browser and start typing. Edits hot‑reload instantly; open a second tab to see Yjs collaboration cursors in action.

---

### About lock files

The repo ships **`package-lock.json`**. Commit changes after dependency bumps so teammates (and CI) get identical installs.

---

### **Extra: Auto-detect Node Version for Contributors**

This repository includes a `.nvmrc` file pinned to the recommended Node.js LTS
version. Most `nvm` implementations will automatically pick up this version so
contributors can simply run `nvm use`.

## Continuous Integration

GitHub Actions runs a single workflow, [`Node CI`](.github/workflows/ci.yml), on
every push to `main` and on pull requests. The job installs dependencies once,
then executes `npm run lint` for ESLint and `npm test` for the Vitest suite. The
workflow intentionally omits the standalone TypeScript check for now because the
codebase contains long-standing type errors that still need to be addressed. You
can run `npm run typecheck` locally to see the current failures and tackle them
incrementally.

```
cat .nvmrc
```

If you maintain your own fork without the file you can create one manually with
a single line containing the desired Node.js version.

---

## Running Tests

Run all linters and the full test suite after installing dependencies.
Navigation links prefetch their destination pages on hover for snappier
transitions.

```bash
npm run lint
npm run typecheck
npm test
npx playwright install   # install browsers for E2E tests
npx playwright test --reporter=line
```

> **Note** The E2E tests in `tests/e2e` use `test.skip` to avoid failures in
> environments without Playwright browsers. Remove those lines and ensure
> `npx playwright install` has run before executing the suite locally.

## Adding or Removing Plugins

See [Integration Guides](docs/integration-guides.md) for quick notes on how to manage plugins or extensions in each editor. For tips on customizing the rewrite service, read [AI Suggest Workflow](docs/ai-suggest.md).

Each editor page also features a **Template Loader** for quickly inserting example
documents. Comments can be added using the built-in comment tracker below the
editor, and a simple change summary appears via the Track Changes widget.
Running **Run Validation** will parse the current document and show pass/fail
information in a small panel powered by the `ValidationStatus` component.

## Scenario Guides

Detailed walkthroughs for each editor live under `docs/scenarios`:

- [TipTap](docs/scenarios/tiptap.md)
- [Toast UI](docs/scenarios/toast.md)
- [Editor.js](docs/scenarios/codex.md)
- [Slate](docs/scenarios/slate.md)
- [Lexical](docs/scenarios/lexical.md)
- [CKEditor 5](docs/scenarios/ckeditor.md)

## Folder Structure

```
/ (repo root)
├── pages/            # Next.js pages for each editor
├── components/       # Reusable React components
├── utils/            # Shared utilities and validation helpers
├── styles/           # Global Tailwind styles
├── public/           # Static assets
└── docs/adr/         # Architectural Decision Records
```

See `docs/adr` for architectural decisions.

## Current Status (July 2025)

All editor pages are available with lightweight stub implementations. TipTap demonstrates custom extensions while the other editors omit their heavy bundles. Plugin toggles, template loading, validation checks, commenting and track changes widgets are shared across pages so you can compare workflows between editors.

## Troubleshooting

In development mode, the first time you open pages like /tiptap can be sluggish. Next.js compiles each page on demand, and the TipTap page imports many extensions. Prefetching only downloads the built chunk—it cannot skip this initial build. Once the dev server finishes compiling, further navigations are fast. Running a production build (`npm run build && npm start`) also avoids this delay.

## License

This project is licensed under the GNU General Public License v3.0. See the [LICENSE](LICENSE) file for details.
