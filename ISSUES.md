# Known Issues

## Type Checking
- `npm run typecheck` fails: numerous errors about missing React and testing library types because dependencies are not installed.

## Test Suite
- `npm run test` and `npm run test:coverage` fail because `vitest` executable is not found. Node modules are not installed due to network restrictions.

Resolution requires installing dependencies or adjusting configuration. See logged output in `/tmp/typecheck.log`, `/tmp/test.log`, and `/tmp/testcov.log`.
