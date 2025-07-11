# ADR 0002: Recommended Folder Structure

## Status
Accepted

## Context
To keep the playground organized as new editors and shared utilities are added, a clear directory layout is required. The PRD outlines several pages and shared components, but no structure currently exists.

## Decision
Adopt a simple Next.js layout:

```
/ (repo root)
├── pages/                # Next.js pages
│   ├── index.tsx         # Home page
│   ├── tiptap.tsx        # Individual editor pages
│   ├── toast.tsx
│   ├── codex.tsx
│   ├── quill.tsx
│   ├── slate.tsx
│   ├── lexical.tsx
│   └── ckeditor.tsx
├── components/           # Shared React components
│   ├── PluginManager.tsx
│   ├── TemplateLoader.tsx
│   └── EditorIntegrationInfo.tsx
├── templates/            # Example template files
├── utils/                # Validation helpers and other utilities
└── public/               # Static assets
```

## Consequences
* Editors remain isolated on separate pages, which simplifies comparison.
* Shared utilities live under `components/` and `utils/` for reuse.
* This structure aligns with typical Next.js projects, easing onboarding.

