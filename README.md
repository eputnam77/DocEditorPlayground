# Document Editor Playground

This project demonstrates multiple rich text editors side by side using **Next.js** and **TypeScript**. Tailwind CSS styles the UI. Each editor page integrates the official package for that editor.

## Features

 - Dedicated pages for **TipTap**, **Toast UI**, **CodeX**, **Slate**, **Lexical** and **CKEditor 5**. Removed **Toast UI** as of July 2025 because that repo hasn't been updated since 2023.
- Plugin toggles built into each page
- Quick integration tips for each editor
- Dark mode switch

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

- **Add a `.nvmrc` file** to your project root with just this line (for LTS 22.x):

```
22.17.0
```

- In Codespaces, this will be picked up automatically.
- In nvm/nvm-windows, users can run `nvm use` with no arguments if `.nvmrc` is present.

---

## Running Tests

Run all linters and the full test suite after installing dependencies:

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

- **Only TipTap is currently available in the playground.**
- All other editors (CKEditor, Editor.js, Lexical, Slate, Toast UI, etc.) and their dependencies have been removed for now.
- Over time, the other editors will be reintroduced for testing, comparison, and feature evaluation.

If you are looking for a multi-editor playground, check back as more editors are added back in!
