# ADR 0002: Recommended Folder Structure

## Status

Accepted

## Context

To keep the playground organized as new editors and shared utilities are added, a clear directory layout is required. The PRD outlines several pages and shared components, but no structure currently exists.

## Decision

Adopt the following layout to separate Next.js pages from reusable library code:

```
/ (repo root)
├── pages/                # Next.js pages for each editor
├── components/           # Reusable React components
├── src/                  # Library modules compiled with tsup
├── tests/                # Vitest unit and integration tests
├── styles/               # Global Tailwind styles
├── public/               # Static assets
├── docs/                 # Documentation and ADRs
├── scripts/              # Setup and helper scripts
└── templates/            # Example template files
```

## Consequences

- Editors remain isolated on separate pages under `pages/`.
- Shared React pieces live in `components/` while library code goes under `src/`.
- Tests in `tests/` and docs in `docs/` keep concerns separate.
- This mirrors standard Next.js setups so new contributors can ramp up quickly.
