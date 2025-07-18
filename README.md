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
- Dark mode switch
- Caches templates and validation files for a year via \`Cache-Control\` headers
  configured in **next.config.js**.
- Icons load on demand using dynamic imports so the bundle remains small.
- Navigation links prefetch their target pages on hover for snappy transitions.
- In offline environments some editor pages display a simple textarea
  placeholder because their dependencies cannot be installed.

### Analyze bundles

Run the Next.js bundle analyzer to inspect bundle sizes:

```bash
npm run analyze
```

Set `ANALYZE=true` when running `next build` to generate the report.

## Installation

````markdown
## Prerequisites

- **Node.js 18.18+ required** (Recommended: Node.js LTS 22.x)
- [npm](https://www.npmjs.com/) is bundled with Node.js

### Install Node.js (choose your environment)

#### On Codespaces, Mac, or Linux (using nvm)

```bash
nvm install --lts
nvm use --lts
```
````

#### On Windows (using nvm-windows)

```cmd
nvm install lts
nvm use lts
```

_or specify a version:_

```cmd
nvm install 22.17.0
nvm use 22.17.0
```

### 1. Install project dependencies

```bash
npm install
```

### 2. Run setup script (optional)

If your setup script is bash-based and you are on Windows, use **Git Bash** or **WSL** (Windows Subsystem for Linux).
Otherwise, run:

```bash
bash scripts/setup.sh
```

If you need a Windows-native script, consider creating a `.ps1` (PowerShell) or `.cmd` alternative.

### 3. Start development server

```bash
npm run dev
```

---

### **Extra: Auto-detect Node Version for Contributors**

This repository includes a `.nvmrc` file pinned to the recommended Node.js LTS
version. Most `nvm` implementations will automatically pick up this version so
contributors can simply run `nvm use`.

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

See [Integration Guides](docs/integration-guides.md) for quick notes on how to manage plugins or extensions in each editor.

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

All editor pages are available with lightweight placeholder implementations. TipTap demonstrates custom extensions while the other editors currently render a basic textarea to keep the dependency footprint small. Plugin toggles, template loading, validation checks, commenting and track changes widgets are shared across pages so you can compare workflows between editors.
