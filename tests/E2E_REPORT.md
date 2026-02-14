# End-to-End Test Report

**Status:** Passing

## Current result

- Playwright suite: `38` tests passed
- Browser: Chromium (`playwright install chromium`)
- Configuration: dedicated local server on port `3101`

## Covered areas

- Home and route availability
- Cross-page navigation between all editor routes
- Dark mode behavior on home and editor pages
- Editor typing and validation workflows for each editor
- Plugin/feature toggles, including TipTap sidebar controls
- Cross-editor workflow transition scenarios
- Shared cross-editor contract checks (navigation, theme persistence, workspace shell)

## Run command

```bash
npx playwright install chromium
npm run test:e2e
```
