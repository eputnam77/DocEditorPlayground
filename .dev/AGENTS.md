# AGENTS.md

*Authoritative playbook for the OpenAI Codex multi-agent workflow in this repository*

---

## 0 · Global Settings

| Key                  | Value                                  |
| -------------------- | -------------------------------------- |
| Default shell        | `bash` (Linux)                         |
| Node.js version      | **20 LTS**                             |
| Package manager      | **npm** (local)                        |
| Test runner          | **Vitest**                             |
| Code formatter       | **Prettier**                           |
| Linter               | **ESLint + @typescript-eslint**        |
| Static-type checker  | **TypeScript** (`tsc --noEmit`)        |
| Docs generator       | **TypeDoc** (manual, optional)         |
| Commit message style | **Conventional Commits**               |
| CI provider          | **GitHub Actions** *(manual triggers)* |

> **Scope**   These settings cover the entire repository. Agents only run the tools listed above unless a task explicitly requires something else.

---

## 1 · Agents & Execution Order

This repo uses a simplified agent chain that only relies on commands runnable inside the sandbox.

| #  | Agent ID     | Purpose                                                            | Auto-trigger        |
| -- | ------------ | ------------------------------------------------------------------ | ------------------- |
| 0  | `planner`    | Parse project requirements → build actionable issues.             | manual              |
| 1  | `architect`  | Confirm repo layout, document decisions.                          | after `planner` PR  |
| 2  | `scaffolder` | Create skeleton code and baseline tests.                          | after `architect`   |
| 3  | `builder`    | Implement features and maintain unit test coverage.               | after `scaffolder`  |
| 4  | `tester`     | Run lint, type-check, and Vitest suites.                          | after `builder`     |
| 5  | `fixer`      | Address any failures from the tester step.                        | on tester failure   |
| 6  | `docwriter`  | Update docs and changelog when the feature set stabilises.        | after `tester` pass |
| 7  | `reviewer`   | Human review.                                                      | after docs ready    |
| 8  | `releasebot` | Prepare release notes and version bumps once merged to `main`.    | post-merge          |

> **Note**   Agents referencing tools like Playwright, Stryker, or Lighthouse have been removed. Tasks that require browsers or external services must be broken down for manual handling.

---

## 2 · Quality Gates

### Dev Gate (feature branches)

All commands are expected to run locally in the sandbox and should pass before handing work to the next agent.

```bash
npm run lint
npm run typecheck
npm run test
```

### Release Gate (`main`)

For `main`, we keep the same checks plus a production build to ensure deployability.

```bash
npm run lint
npm run typecheck
npm run test:coverage
npm run build
```

If any command fails, control returns to the **fixer** agent.

---

## 3 · TypeScript Project Structure

The repository follows a standard Next.js layout:

```
doceditorplayground/
├── src/                # Reusable modules
├── pages/              # Next.js pages
├── components/         # React components
├── tests/              # Vitest unit/integration tests
├── public/             # Static assets
└── styles/             # Tailwind and global CSS
```

### Documentation Guidance

- Keep README and docs aligned with shipped features.
- Use clear terminology and include usage examples for new APIs.
- Update `CHANGELOG.md` following [Keep a Changelog](https://keepachangelog.com/) conventions when releasing.

---

## 4 · Branch & Commit Policy

* **Branches** `plan/<slug>` · `feat/<slug>` · `fix/<issue>` · `docs/<topic>`
* **Commits** follow Conventional Commits, e.g.

  ```
  feat(editor): add table support
  fix(editor): prevent crash on empty document
  chore(ci): adjust lint configuration
  ```

Default merge strategy: **squash-merge**, with required checks defined above.

---

## 5 · Environment Setup

1. `nvm install --lts`
2. `npm install`
3. Run the dev server with `npm run dev` when working on UI features.
4. Use `npm run lint`, `npm run typecheck`, and `npm run test` before opening PRs.

Playwright, mutation testing, and other heavy tooling are intentionally excluded from this workflow to keep tasks compatible with the sandbox.

---

## 6 · Failure-Recovery Matrix

| Problem            | Responsible Agent | Remedy                   |
| ------------------ | ----------------- | ------------------------ |
| Lint error         | fixer             | Run `npm run lint -- --fix` or patch manually |
| Type error         | fixer             | Update types or code     |
| Unit test failure  | fixer             | Adjust implementation or tests |
| Docs out of date   | docwriter         | Refresh docs/changelog   |

---

## 7 · References

- [Next.js](https://nextjs.org/)
- [Vitest](https://vitest.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)

---

*End of AGENTS.md*
