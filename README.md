# Document Editor Playground

This project demonstrates multiple rich text editors side by side using **Next.js** and **TypeScript**. Tailwind CSS styles the UI. Each editor page integrates the official package for that editor.

## Features

- Dedicated pages for **TipTap**, **CodeX**, **Quill**, **Slate**, **Lexical** and **CKEditor 5**. Removed **Toast UI** as of July 2025 because that repo hasn't been updated since 2023.
- Plugin toggles built into each page
- Quick integration tips for each editor
- Dark mode switch

## Setup

1. Install dependencies (requires internet access):
   ```bash
   npm install
   ```
2. Run the setup script (requires `nvm`):
   ```bash
   bash scripts/setup.sh
   ```
   This installs the latest LTS version of Node, project dependencies,
   builds the app and configures Git hooks.
   If you run into peer dependency conflicts, you can run `npm install --legacy-peer-deps`.
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Run the test suite:
   ```bash
   npm test
   ```
   To execute the end-to-end tests make sure dependencies are installed and run:
   ```bash
   npx playwright test
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
