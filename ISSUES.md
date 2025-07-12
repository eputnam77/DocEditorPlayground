# Known Issues

## Formatting
`npx prettier --check .` reports style issues in multiple files.
Run `npx prettier --write` to fix them.

## Type Checking
`npx tsc --noEmit` fails with numerous `TS2307` module-not-found errors
for packages like `next/router`, `framer-motion`, `@ckeditor/*`,
`react-editor-js`, `@tiptap/*` and others.
See the console output above for details.

## Test Suite
`npx vitest run --coverage` and `npx vitest run -m property` execute a
stubbed `vitest` binary so tests and coverage are skipped. Playwright and
Stryker commands are also stubbed.

Dependencies need to be installed or configuration adjusted before these
commands can succeed.
