# Document Editor Playground

This project demonstrates multiple rich text editors side by side using **Next.js** and **TypeScript**. Tailwind CSS styles the UI. Each editor page integrates the official package for that editor.

## Features

- Dedicated pages for **TipTap**, **CodeX**, **Quill**, **Slate**, **Lexical** and **CKEditor 5**. Removed **Toast UI** as of July 2025 because that repo hasn't been updated since 2023.
- Simple toolbar editor shared across pages
- Plugin toggles via `PluginManager`
- Loadable example templates with validation
- Quick integration tips for each editor
- Dark mode switch

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```
   If you see a peer dependency conflict error, run:
   ```bash
   npm install --legacy-peer-deps
   ```
2. Start the development server:
   ```bash
   npm run dev
   ```
3. Run the test suite:
   ```bash
   npm test
   ```

## Adding or Removing Plugins

See [Integration Guides](docs/integration-guides.md) for quick notes on how to manage plugins or extensions in each editor.

## Folder Structure

```
/ (repo root)
├── pages/            # Next.js pages for each editor
├── components/       # Reusable React components
├── templates/        # Example content templates
├── utils/            # Shared utilities and validation helpers
├── styles/           # Global Tailwind styles
├── public/           # Static assets
└── docs/adr/         # Architectural Decision Records
```

See `docs/adr` for architectural decisions.
