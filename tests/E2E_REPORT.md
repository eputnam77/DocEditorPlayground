# End-to-End Test Report

**Status:** ❌ Tests failed (missing Playwright)

With stub binaries removed, `npx playwright test` attempts to download the real
`playwright` package but this environment blocks network access. Install the
dependencies in a networked environment and run `npx playwright install` before
running the test suite locally. Otherwise the browsers are missing and tests are
ignored.

## Summary

No scenarios were executed.
