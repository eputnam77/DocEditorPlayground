# ADR 0003: Toolchain and Quality Gates

## Status

Accepted

## Context

This playground integrates multiple editors and aims to remain lightweight. We need a consistent toolchain to enforce code quality and automated tests across editors.

## Decision

- **tsup** will compile any library code under `src/`.
- **Vitest** runs unit and property tests.
- **Playwright** covers end‑to‑end flows. See the [Running Tests](../../README.md#running-tests)
  guidance for sandbox limitations and CI workarounds when installing browsers.
- **Stryker Mutator** measures mutation score.
- **ESLint** and **Prettier** enforce style.
- **TypeScript** checks via `tsc --noEmit`.
- **TypeDoc** generates API docs.
- **pnpm** is used in CI for faster installs.
- GitHub Actions workflow `.github/workflows/ci.yml` runs the dev gate with these tools.

## Consequences

- Contributors use `npm` locally but CI runs `pnpm`.
- Tooling config files live in the repo root.
- Coverage and mutation thresholds gate merges into `main`.
