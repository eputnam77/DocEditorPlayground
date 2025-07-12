# Known Issues

## Type Checking
`npm run typecheck` fails with numerous `TS2307` and other errors for missing modules such as `next/router`, `framer-motion`, various editor packages (e.g., `@ckeditor/*`, `@editorjs/*`, `@tiptap/*`). See `/tmp/typecheck.log` for the full output.

## Test Suite
`npm run test:coverage` executes a stubbed `vitest` binary which prints `vitest stub - tests skipped`, so no tests or coverage are actually run. See `/tmp/testcov.log`.

Dependencies need to be installed or the configuration adjusted before these commands can succeed.
