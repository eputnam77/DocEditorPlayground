# AGENTS.md

*Authoritative playbook for the OpenAI Codex multi‑agent workflow in this repository*

---

## 0 · Global Settings

| Key                      | Value                                                                 |
| ------------------------ | --------------------------------------------------------------------- |
| Default shell            | `bash` (Linux)                                                        |
| Python version           | **3.12**                                                              |
| Virtual‑env manager      | **uv** (falls back to `python -m venv`)                               |
| Package manager          | **poetry** (`poetry install`)                                         |
| Test runner              | **pytest**                                                            |
| E2E framework            | **Playwright + pytest‑playwright**                                    |
| Property‑based tests     | **Hypothesis**                                                        |
| Mutation testing         | **mutmut** (`mutmut run --use-coverage`)                              |
| Coverage thresholds      | **75 %** on feature branches → **90 %** on `main` (**branch + line**) |
| Mutation score           | **≥60 %** on feature branches → **≥80 %** on `main`                   |
| Code formatter           | **black**                                                             |
| Linter                   | **ruff** (includes import‑sorting)                                    |
| Static‑type checker      | **mypy --strict**                                                     |
| Security scanners        | **bandit -r src**, **pip‑audit -r requirements.txt**                  |
| Docs generator           | **MkDocs Material** (`mkdocs build`)                                  |
| Commit message style     | **Conventional Commits**                                              |
| CI provider              | **GitHub Actions** *(experimental – see §5)*                          |

> **Data flow**   Every agent works from the latest commit on its branch and communicates only via GitHub Issues/PRs.

---

## 1 · Agents & Execution Order

| #  | Agent ID       | Purpose (summary)                                                                          | Auto‑trigger condition                    |
| -- | -------------- | ------------------------------------------------------------------------------------------ | ----------------------------------------- |
| 0  | `planner`      | Parse **PRD.md** → create **TASKS.md** (epics → issues with acceptance criteria & labels). | manual                                    |
| 1  | `architect`    | Design folder layout, write ADRs, initialise `pyproject.toml`, and CI skeleton.            | `planner` PR merged                       |
| 2  | `scaffolder`   | Generate skeleton code *and tests* for each open issue.                                    | `architect` PR merged                     |
| 3  | `scenario‑gen` | Convert acceptance criteria to Gherkin *.feature* files & Hypothesis strategies.           | new **ready** issue                       |
| 4  | `builder`      | Implement code for issues marked **ready**; keep unit/integration tests ≥75 % coverage.    | after `scenario‑gen`                      |
| 5  | `verifier`     | Cross‑reference **PRD.md** → **TASKS.md** → implemented code; emit completeness report.    | after `builder`                           |
| 6  | `linter`       | Run `ruff --fix` & `black`; open PR if diff.                                               | after `verifier` green                    |
| 7  | `tester`       | Execute **dev gate** (unit + property tests, type‑check, coverage ≥75 %).                  | after `linter` green                      |
| 8  | `e2e‑tester`   | Run Playwright E2E suite (headless) against disposable container.                          | after `tester` green                      |
| 9  | `mutation`     | Run `mutmut`; fails if mutation score < threshold.                                         | after `e2e‑tester` green                  |
| 10 | `fixer`        | Patch any failing files, re‑run gates until all green.                                     | on test / lint / mutation failure         |
| 11 | `security`     | Run Bandit & pip‑audit; open CVE issues.                                                   | nightly · before merge→`main`             |
| 12 | `docwriter`    | Update `README.md`, API refs, examples, changelog.                                         | branch green & cov ≥90 % & mutation ≥80 % |
| 13 | `reviewer`     | Human‑style review; request approvals.                                                     | after `docwriter`                         |
| 14 | `releasebot`   | Bump semver, tag, build & push Docker image, draft release notes.                          | PR merged→`main` |

### Agent Handoff Conventions

* **Feature branches** enforce the *dev gate* (≥75 % coverage, ≥60 % mutation).
* The **main** branch enforces the *release gate* (≥90 % coverage, ≥80 % mutation, security pass, docs build).
* Each agent finishing successfully applies the label `ready‑for:<next‑agent>`; a GitHub Action (when enabled) reads this label and triggers the next agent via the Codex API.

---

## 2 · Quality Gates

### Dev Gate (feature branches)

```bash
ruff check src tests
black --check src tests
mypy --strict src
autopep8? # (if enabled)
bandit -r src -lll --skip B101          # allow asserts during early dev
pytest -q --cov=src --cov-branch --cov-fail-under=80
pytest -q -m property                   # Hypothesis tests
playwright install --with-deps --dry-run  # ensure browsers cached
pytest -q -m e2e
mutmut run -s src --use-coverage -q --fail-under 60
```

### Release Gate (`main`)

```bash
ruff check src tests
black --check src tests
mypy --strict src
bandit -r src -lll
pip-audit -r requirements.txt
pytest -q --cov=src --cov-branch --cov-fail-under=90
pytest -q -m e2e
mutmut run -s src --use-coverage -q --fail-under 80
mkdocs build --strict
```

Any non‑zero exit hands control to **fixer**.

---

## 3 · Writing Style Guidelines

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
- `templates/API_DOCS.md` - API documentation format
- `templates/CHANGELOG.md` - Release notes template

---

## 4 · Branch & Commit Policy

* **Branches** `plan/<slug>` · `scaffold/<slug>` · `feat/<slug>` · `fix/<issue>` · `docs/<topic>` · `test/<scope>`
* **Commits** follow Conventional Commits, e.g.

  ```
  feat(auth): add OAuth2 login flow
  fix(api): prevent division‑by‑zero in calculator
  chore(ci): raise coverage threshold to 90%
  ```
* Default merge strategy: **squash-merge**, with required-status checks on `main`.

---

## 5 · Automation Workflow (GitHub Actions - Experimental)

<!--
⚠️  EXPERIMENTAL_CI: false
     The workflow below is intentionally **disabled**. Agents `planner`,
     `architect`, and `scaffolder` MUST ignore it unless this flag is
     set to `true` via a repository‑level secret or branch environment
     variable.

     When you are ready to try headless Codex in CI:
       1. Rename `.github/workflows/agents.yml.disabled` → `agents.yml`.
       2. Set the secret `EXPERIMENTAL_CI=true`.
       3. Verify that `codex run --quiet` or an upcoming non‑interactive
          flag works in GitHub runners (see Codex issue #1080).
-->

> **Status**   Codex CLI currently crashes inside GitHub Actions because
> its Ink TTY renderer requires an interactive terminal. Until Codex
> ships a true CI mode you can either:
>
> * Use a self‑hosted runner with a pseudo‑TTY (`docker run -it …`).
> * Keep the YAML renamed as `agents.yml.disabled` so GitHub ignores it.

```yaml
# .github/workflows/agents.yml.disabled
# (Rename to .yml when EXPERIMENTAL_CI=true)

name: Codex‑router
on:
  push:
    branches: ["**"]

jobs:
  codex-router:
    if: ${{ env.EXPERIMENTAL_CI == 'true' }}
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Detect last agent & status
        run: |
          ./scripts/next-agent.sh  # sets $NEXT_AGENT env var
      - name: Trigger agent via Codex API
        if: env.NEXT_AGENT != ''
        run: codex run --quiet --agent "$NEXT_AGENT"
```

> **Router additions**  `next-agent.sh` now recognises the new gates:
>
> ```bash
> elif [[ "$LAST_AGENT" == "tester" && "$STATUS" == "success" ]]; then
>   echo "NEXT_AGENT=e2e-tester" >>"$GITHUB_ENV"
> elif [[ "$LAST_AGENT" == "e2e-tester" && "$STATUS" == "success" ]]; then
>   echo "NEXT_AGENT=mutation" >>"$GITHUB_ENV"
> ```

---

## 6 · Environment Setup

* **Python 3.12** via `pyenv` or container.
* Local dev startup:

  ```bash
  uv venv
  uv pip install -r requirements-dev.txt
  pre-commit install
  ```
* Codespaces/VS Code: devcontainer runs pre-commit on open.

---

## 7 · Failure‑Recovery Matrix

| Problem                         | Responsible Agent | Remedy                                |
| ------------------------------- | ----------------- | ------------------------------------- |
| Lint error                      | linter            | Auto‑fix & push                       |
| Type error                      | tester → fixer    | Patch types/code                      |
| Unit / integration test failure | fixer             | Minimal diff fix, ensure green        |
| **E2E failure**                 | fixer             | Patch UI / service, re‑run Playwright |
| **Mutation score drop**         | fixer             | Add tests or refine existing ones     |
| Coverage drop                   | builder / tester  | Add tests or mark exceptions          |
| High CVE                        | security          | Bump dependency or patch code         |
| Docs build failure              | docwriter         | Regenerate & push fix                 |

---

## 8 · References

* [Ruff documentation](https://docs.astral.sh/ruff/)
* [Black documentation](https://black.readthedocs.io/)
* [Pytest documentation](https://docs.pytest.org/)
* [Bandit documentation](https://bandit.readthedocs.io/)
* [pip-audit](https://pypi.org/project/pip-audit/)

---

## 9 · Project Structure & File Organization

### Recommended Repository Structure

To keep development workflow files (AGENTS.md, TASKS.md, PRD.md) out of the distributed package, use this structure:

```
your-project/
├── src/                           # Source code (gets distributed)
│   └── your_package/
│       ├── __init__.py
│       └── main.py
├── tests/                         # Test files
├── docs/                          # Documentation
├── scripts/                       # Development scripts
├── .github/                       # GitHub workflows
│   └── workflows/
│       └── agents.yml
├── .dev/                          # Development-only files (NOT distributed)
│   ├── AGENTS.md                  # Multi-agent workflow guide
│   ├── TASKS.md                   # Task breakdown
│   ├── PRD.md                     # Product requirements
│   ├── ADRs/                      # Architecture decision records
│   │   └── 0001-initial-architecture.md
│   └── templates/                 # Development templates
│       ├── README.md
│       ├── API_DOCS.md
│       └── CHANGELOG.md
├── pyproject.toml                 # Package configuration
├── setup.py                       # Legacy setup
├── requirements.txt               # Runtime dependencies
├── requirements-dev.txt           # Development dependencies
├── .gitignore
├── .pre-commit-config.yaml
└── README.md                      # User-facing documentation
```

### Package Configuration

Add this to your `pyproject.toml` to exclude development files from distribution:

```toml
[build-system]
requires = ["setuptools>=61.0", "wheel"]
build-backend = "setuptools.build_meta"

[project]
name = "your-package"
version = "1.0.0"
# ... other project metadata

[tool.setuptools.packages.find]
where = ["src"]
exclude = ["tests*", ".dev*"]

[tool.setuptools.package-data]
"*" = ["*.txt", "*.md", "*.yaml", "*.yml"]
```

### Git Configuration

Add to your `.gitignore`:

```gitignore
# Build artifacts
dist/
build/
*.egg-info/

# Environment
.env
.venv/
venv/

# IDE
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db
```

### Alternative Structures

If you prefer different organization:

1. **`docs/dev/`** - Development documentation
2. **`scripts/`** - Development scripts and workflows  
3. **`.github/`** - GitHub-specific workflows and templates

### File Placement Guidelines

| File Type | Location | Reason |
|-----------|----------|---------|
| AGENTS.md | `.dev/` | Development workflow, not user-facing |
| TASKS.md | `.dev/` | Internal task tracking |
| PRD.md | `.dev/` | Product requirements for development |
| README.md | Root | User-facing documentation |
| API docs | `docs/` | User-facing API reference |
| Templates | `.dev/templates/` | Development templates |

---

*End of AGENTS.md*
