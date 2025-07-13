# Document Editor Playground

This project demonstrates multiple rich text editors side by side using **Next.js** and **TypeScript**. Tailwind CSS styles the UI. Each editor page integrates the official package for that editor.

## Features

- Dedicated pages for **TipTap**, **CodeX**, **Quill**, **Slate**, **Lexical** and **CKEditor 5**. Removed **Toast UI** as of July 2025 because that repo hasn't been updated since 2023.
- Plugin toggles built into each page
- Quick integration tips for each editor
- Dark mode switch

## Installation

1. Ensure **Node.js 18.18+** is available. If you use `nvm`, install the latest
   LTS release:
   ```bash
   nvm install --lts
   ```
2. Install project dependencies:
   ```bash
   npm install
   ```
3. Run the setup script (uses `nvm` if available):
   ```bash
   bash scripts/setup.sh
   ```
   The script installs the latest LTS version of Node when `nvm` is present or
   falls back to the system `node`. It then installs dependencies,
   builds the app and configures Git hooks.
   If you run into peer dependency conflicts, you can run `npm install --legacy-peer-deps`.
4. Start the development server:
   ```bash
   npm run dev
   ```

## Running Tests

Run all linters and the full test suite after installing dependencies:

```bash
npm run lint
npm run typecheck
npm test
npx playwright test --reporter=line --headless
```

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
