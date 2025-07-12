#!/bin/bash
# Setup script for Document Editor Playground
# Installs Node LTS, dependencies, builds, and configures Git hooks.

set -euo pipefail

if ! command -v nvm >/dev/null 2>&1; then
  echo "nvm not found. Please install nvm and rerun this script." >&2
  exit 1
fi

echo "Installing Node LTS..."
nvm install --lts

echo "Installing dependencies..."
npm install

echo "Building project..."
npm run build

echo "Installing Husky hooks..."
npx husky install

echo "Setup complete!"
