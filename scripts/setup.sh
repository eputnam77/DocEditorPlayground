#!/usr/bin/env bash
set -euo pipefail

# Use correct Node.js version if nvm is available
if command -v nvm >/dev/null 2>&1; then
  nvm install
  nvm use
fi

# Install all project dependencies
npm install

# Install Playwright browsers if Playwright is present
if grep -q '"@playwright/test"' package.json; then
  npx playwright install --with-deps
fi
