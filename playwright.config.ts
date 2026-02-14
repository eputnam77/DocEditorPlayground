import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/e2e",
  timeout: 60 * 1000,
  workers: 1,
  webServer: {
    command: "node ./node_modules/next/dist/bin/next dev -p 3101",
    port: 3101,
    timeout: 120 * 1000,
    reuseExistingServer: false,
  },
  use: {
    baseURL: "http://localhost:3101",
    headless: true,
  },
});
