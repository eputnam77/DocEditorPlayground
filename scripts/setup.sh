#!/bin/bash
# Setup script for Document Editor Playground
# Installs Node LTS, dependencies, builds, and configures Git hooks.

set -euo pipefail

if command -v nvm >/dev/null 2>&1; then
  echo "Installing Node LTS via nvm..."
  nvm install --lts
else
  if ! command -v node >/dev/null 2>&1; then
    echo "Node.js not found. Install Node.js or nvm before running this script." >&2
    exit 1
  fi
  echo "nvm not found. Using system Node $(node -v)"
fi

echo "Installing Semgrep..."
python3 -m pip install semgrep

echo "Installing dependencies..."
npm install

echo "Building project..."
npm run build

echo "Installing Husky hooks..."
npx husky install

if ! npx vitest --version >/dev/null 2>&1; then
  echo "Warning: vitest is not available. Tests may fail to run." >&2
fi

echo "Setup complete!"
