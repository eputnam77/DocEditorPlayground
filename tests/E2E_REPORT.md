# End-to-End Test Report

**Status:** Passing

## Current result

- Playwright smoke suite: `5` tests passed
- Browser: Chromium (`playwright install chromium`)
- Configuration: dedicated local server on port `3101`

## Covered areas

- LTR typing behavior for each editor page
- Bold, heading, bullet list, and numbered list formatting per editor
- Editor-specific output checks for list/heading markup structure
- Smoke-level confidence for the current production-aligned integrations

## Run command

```bash
npx playwright install chromium
npm run test:e2e:smoke
```
