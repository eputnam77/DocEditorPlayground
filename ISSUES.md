# Known Issues

## Formatting
`npx prettier --check .` reports style issues in multiple files.
Run `npx prettier --write` to fix them.


## Test Suite
Running `vitest` with coverage fails because project dependencies aren't
installed in this environment. Property tests, Playwright E2E tests and
Stryker mutation tests also cannot execute.

Install `node_modules` or adjust the CI setup to run these commands
successfully.
