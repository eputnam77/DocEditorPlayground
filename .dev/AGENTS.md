# AGENTS.md

*Authoritative playbook for the OpenAI Codex multi‑agent workflow in this repository*

---

## 0 · Global Settings

| Key                      | Value                                                                  |
| ------------------------ | ---------------------------------------------------------------------- |
| Default shell            | `bash` (Linux)                                                         |
| Node.js version          | **20 LTS**                                                             |
| Package manager          | **npm** (local) · **pnpm** (CI)                                        |
| Bundler / transpiler     | **tsup** (esbuild wrapper)                                             |
| Test runner              | **Vitest**                                                             |
| **E2E framework**        | **Playwright + @playwright/test**                                      |
| **Property‑based tests** | **fast‑check** (via Vitest)                                            |
| **Mutation testing**     | **Stryker Mutator** (`stryker run`)                                    |
| Coverage thresholds      | **75 %** on feature branches → **90 %** on `main` (branch + statement) |
| Mutation score           | **≥60 %** on feature → **≥80 %** on `main`                             |
| Code formatter           | **Prettier**                                                           |
| Linter                   | **ESLint + @typescript‑eslint**                                        |
| Static‑type checker      | **TypeScript** (`tsc --noEmit`)                                        |
| Security scanners        | **npm audit --prod**, **Snyk CLI**                                     |
| Docs generator           | **TypeDoc** (`typedoc --out docs src`)                                 |
| Commit message style     | **Conventional Commits**                                               |
| CI provider              | **GitHub Actions** *(experimental – see §6)*                           |

> **Data flow**   Each agent works from the latest commit on its branch and communicates only via GitHub Issues / PRs.
> 
---

## 1 · Agents & Execution Order

| #  | Agent ID       | Purpose                                                                                     | Auto‑trigger             |
| -- | -------------- | ------------------------------------------------------------------------------------------- | ------------------------ |
| 0  | `planner`      | Parse **project‑management/PRD.md** → build **TASKS.md** (issues with acceptance criteria). | manual                   |
| 1  | `architect`    | Repo layout, write ADRs, init `package.json`, stub CI.                                      | `planner` PR merged      |
| 2  | `scaffolder`   | Generate skeleton code *and tests*.                                                         | `architect` PR merged    |
| 3  | `scenario‑gen` | Convert acceptance criteria → Gherkin *.feature* files & fast‑check arbitraries.            | new ready issue          |
| 4  | `builder`      | Implement code; keep unit/integration coverage ≥75 %.                                       | after `scenario‑gen`     |
| 5  | `verifier`     | Trace PRD → TASKS → code; emit completeness report.                                         | after `builder`          |
| 6  | `linter`       | `eslint --fix` + `prettier --write`.                                                        | after `verifier` green   |
| 7  | `tester`       | Run *dev gate* (unit, property, type‑check, coverage).                                      | after `linter` green     |
| 8  | `e2e‑tester`   | Playwright E2E suite (headless).                                                            | after `tester` green     |
| 9  | `mutation`     | Stryker; fails if mutation score < threshold.                                               | after `e2e‑tester` green |
| 10 | `fixer`        | Patch failing files; loop until green.                                                      | on any gate fail         |
| 11 | `security`     | `npm audit --prod` + Snyk; open CVE issues.                                                 | nightly · pre‑merge      |
| 12 | `docwriter`    | Update docs/changelog once all gates green & score ≥ thresholds.                            | after `security` green   |
| 13 | `reviewer`     | Human code review.                                                                          | after `docwriter`        |
| 14 | `releasebot`   | Bump semver, publish package + Docker, draft release notes.                                 | PR merged→`main`         |

### Handoff conventions

* **Feature branches** enforce *dev gate* (≥75 % cov, ≥60 % mut).
* **main** enforces *release gate* (≥90 % cov, ≥80 % mut, security, docs).
* Agents tag PRs with `ready-for:<next-agent>`; a router Action (disabled by default) reads the tag and triggers the next agent.

---

## 2 · Quality Gates

### Dev Gate (feature)

```bash
eslint "src/**/*.ts" "tests/**/*.ts"
prettier --check .
tsc --noEmit
npm audit --prod --audit-level=high || true  # warn only on feature
vitest run --coverage --coverage.reporter=text --coverage.branches --coverage.statements --coverage.failUnder=75
vitest run -m property                        # fast‑check suites
playwright install --with-deps --dry-run      # ensure binaries cached
playwright test --reporter=line --headless
stryker run --coverageAnalysis=perTest --threshold-break 60
```

### Release Gate (`main`)

```bash
eslint .
prettier --check .
tsc --noEmit
npm audit --prod
snyk test --severity-threshold=high
vitest run --coverage --coverage.reporter=html --coverage.failUnder=90
playwright test --reporter=html --timeout 60000
stryker run --threshold-break 80
typedoc --out docs src --strict
```

Any non‑zero exit passes control to **fixer**.

---

## 3.5 · TypeScript Project Structure

### Repository Structure

```
my-lib/
├── project-management/          # Project management files (not in NPM package)
│   ├── AGENTS.md               # Agent definitions and workflow
│   ├── TASKS.md                # Generated by planner agent
│   ├── PRD.md                  # Product Requirements Document
│   ├── VERIFICATION_REPORT.md  # Generated by verifier agent
│   ├── ADRs/                   # Architecture Decision Records
│   │   ├── 001-project-structure.md
│   │   ├── 002-technology-stack.md
│   │   └── ...
│   ├── Templates/              # Project templates
│   │   ├── README.md
│   │   ├── API_DOCS.md
│   │   ├── CHANGELOG.md
│   │   └── TEST_EXAMPLES.md
│   └── Workflows/              # GitHub Actions and automation
│       ├── agents.yml
│       └── next-agent.sh
├── src/                        # All .ts / .tsx source (included in NPM package)
│   ├── index.ts                # Main entry point
│   ├── types/                  # Type definitions and interfaces
│   ├── utils/                  # Utility functions
│   └── components/             # Reusable components (if applicable)
├── tests/                      # Unit & integration specs
│   ├── unit/                   # Unit tests
│   ├── integration/            # Integration tests
│   └── fixtures/               # Test data and mocks
├── dist/                       # Auto-generated build artefacts (git-ignored)
├── docs/                       # TypeDoc generated documentation
├── examples/                   # Working sample apps / snippets
├── .github/workflows/          # CI (lint + test + type-check + release)
├── .eslintrc.json              # Lint rules
├── .prettierrc                 # Formatter
├── tsconfig.json               # Editor + type-checker config
├── tsconfig.build.json         # Narrow build-time config (⟂ tsup/tsc)
├── vitest.config.ts            # Test runner setup
├── package.json
├── README.md
└── LICENSE
```

### Package.json Configuration

To ensure project management files are excluded from the NPM package, add to `package.json`:

```jsonc
{
  "files": [
    "dist",
    "src",
    "README.md",
    "LICENSE"
  ],
  "ignore": [
    "project-management",
    "tests",
    "examples",
    "docs",
    ".github"
  ]
}
```

### Project Management Structure Benefits

The `project-management/` folder provides several advantages:

1. **Separation of Concerns**: Project management files stay separate from actual NPM package code
2. **Reusability**: Templates and workflows can be referenced across multiple projects
3. **Version Control**: Track changes to agent workflows independently from code changes
4. **Documentation**: Keep project management approach well-documented and accessible
5. **Template System**: Easy to copy and adapt for new projects
6. **Clean Package**: NPM packages contain only the essential code and documentation

### File Purposes

- **AGENTS.md**: Defines the multi-agent workflow and agent specifications
- **PRD.md**: Product Requirements Document that drives task generation
- **TASKS.md**: Generated by planner agent with detailed task breakdown
- **VERIFICATION_REPORT.md**: Generated by verifier agent with completeness analysis
- **ADRs/**: Architecture Decision Records for technical decisions
- **Templates/**: Reusable templates for documentation and code generation
- **Workflows/**: GitHub Actions and automation scripts

### Core Configuration Files

#### TypeScript Configuration
```jsonc
// tsconfig.json  – IDE-friendly, no Emit
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "rootDir": "src",
    "strict": true,
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "incremental": true
  },
  "include": ["src/**/*.ts", "tests/**/*.ts"]
}
```

```jsonc
// tsconfig.build.json – used by tsup (extends the above)
{
  "extends": "./tsconfig.json",
  "compilerOptions": { "noEmit": false, "outDir": "dist" },
  "exclude": ["tests", "**/*.test.ts"]
}
```

#### Test Configuration
```ts
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: { 
    globals: true, 
    environment: 'node',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'dist/',
        'tests/',
        '**/*.d.ts',
        '**/*.test.ts',
        '**/*.spec.ts'
      ]
    }
  }
});
```

#### Linting Configuration
```jsonc
// .eslintrc.json (flat config variant)
{
  "plugins": { "@typescript-eslint": "latest" },
  "languageOptions": { "parser": "@typescript-eslint/parser" },
  "rules": {
    "no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "@typescript-eslint/prefer-const": "error",
    "@typescript-eslint/no-unused-vars": "error"
  }
}
```

### Package.json Scripts
```jsonc
{
  "scripts": {
    "dev": "tsup src/index.ts --watch --dts",
    "build": "tsup src/index.ts --dts --minify",
    "typecheck": "tsc --noEmit",
    "lint": "eslint .",
    "lint:fix": "eslint . --fix",
    "format": "prettier --write .",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "docs": "typedoc --out docs src",
    "release": "semantic-release",
    "prepare": "husky install"
  }
}
```

---

## 4 · Writing Style Guidelines

### Documentation Standards

All documentation generated by the `docwriter` agent must follow these style guidelines:

#### Tone & Voice
- **Friendly and conversational** - Write like you're explaining to a colleague over coffee
- **Enthusiastic but not over-the-top** - Show genuine excitement about features and solutions
- **Active voice preferred** - "The system processes data" not "Data is processed by the system"
- **Confident and helpful** - Use encouraging language that builds user confidence
- **Inclusive and welcoming** - Use "they/them" pronouns and create an inviting atmosphere
- **Avoid corporate jargon** - Use plain language that feels human and relatable
- **Celebrate user success** - Frame features as helping users achieve their goals

#### Structure & Formatting
- **Clear hierarchical headings** - Use consistent heading levels (H1 → H2 → H3)
- **Code examples for every feature** - Include practical, runnable examples
- **Step-by-step instructions** - Break complex processes into numbered steps
- **Cross-references** - Link related sections and external resources

#### Content Guidelines
- **Start with the problem** - Explain what the feature solves before how it works
- **Include use cases** - Show real-world scenarios where features apply
- **Error handling** - Document common errors and their solutions
- **Performance notes** - Mention any performance implications or limitations

#### Technical Writing Standards
- **Consistent terminology** - Use the same terms throughout all documentation
- **API documentation** - Include parameter types, return values, and examples
- **Changelog format** - Follow [Keep a Changelog](https://keepachangelog.com/) standards
- **README structure** - Installation, quick start, features, contributing, license

### Style Templates

The `docwriter` agent should reference these templates:
- `templates/README.md` - Standard README structure
- `templates/API_DOCS.md` - API documentation format (TypeDoc compatible)
- `templates/CHANGELOG.md` - Release notes template
- `templates/TEST_EXAMPLES.md` - TypeScript test examples and patterns

---

## 5 · Branch & Commit Policy

* **Branches** `plan/<slug>` · `scaffold/<slug>` · `feat/<slug>` · `fix/<issue>` · `docs/<topic>` · `test/<scope>`
* **Commits** follow Conventional Commits, e.g.

  ```
  feat(auth): add OAuth2 login flow
  fix(api): prevent division‑by‑zero in calculator
  chore(ci): raise coverage threshold to 90%
  ```
* Default merge strategy: **squash-merge**, with required-status checks on `main`.

---

## 6 · Automation Workflow (GitHub Actions - Experimental)

<!--
⚠️  EXPERIMENTAL_CI: false
     The workflow below is kept for future use. Agents MUST ignore it
     unless this flag is switched to true (repo secret or env var).
-->

> **Why disabled?**   Codex CLI currently crashes in GitHub Actions due to Ink’s interactive TTY requirement (issue #1080). Enable when a non‑interactive flag ships or use a self‑hosted runner with pseudo‑TTY.

```yaml
# .github/workflows/agents.yml.disabled
name: Codex‑router
on:
  push:
    branches: ["**"]

env:
  NODE_VERSION: "20"
  PNPM_VERSION: "9"
  EXPERIMENTAL_CI: ${{ secrets.EXPERIMENTAL_CI }}

jobs:
  codex-router:
    if: ${{ env.EXPERIMENTAL_CI == 'true' }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v3
        with: { version: "${{ env.PNPM_VERSION }}" }
      - name: Detect next agent
        run: ./scripts/next-agent.sh  # sets $NEXT_AGENT
      - name: Trigger agent via Codex API
        if: env.NEXT_AGENT != ''
        run: codex run --quiet --agent "$NEXT_AGENT"
```

---

## 7 · Environment Setup

* **Node.js 18.18+** via `nvm` or container.
* Local dev startup:

  ```bash
  nvm install --lts
  npm install
  npm run build
  npx husky install
  ```
* Codespaces/VS Code: devcontainer runs pre-commit on open.
* Playwright browsers are cached in `~/.cache/ms-playwright` to speed up local runs; CI layers cache that directory too.

---

## 8 · Failure‑Recovery Matrix

| Problem                 | Responsible Agent | Remedy                               |
| ----------------------- | ----------------- | ------------------------------------ |
| Lint error              | linter            | Auto‑fix & push                      |
| Type error              | tester → fixer    | Patch types / code                   |
| Unit / property failure | fixer             | Tweak logic or tests                 |
| **E2E failure**         | fixer             | Patch UI / service; rerun Playwright |
| **Mutation drop**       | fixer             | Add or improve tests                 |
| Coverage drop           | builder / tester  | Add tests / mark exceptions          |
| High CVE                | security          | Upgrade dependency or patch          |
| Docs fail               | docwriter         | Regenerate & push                    |

---

## 9 · References

* [Playwright](https://playwright.dev/)
* [fast-check](https://github.com/dubzzz/fast-check)
* [Stryker‑mutator](https://stryker-mutator.io/)
* [Vitest](https://vitest.dev/)
* [TypeScript](https://www.typescriptlang.org/)
* [tsup](https://github.com/egoist/tsup)
* [TypeDoc](https://typedoc.org/)

---

*End of AGENTS.md*
