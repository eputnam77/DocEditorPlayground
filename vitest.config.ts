import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {},
  },
  test: {
    globals: true,
    environment: "jsdom",
    // Run every test file under the tests directory
    include: ["tests/**/*.test.ts?(x)"],
    exclude: ["tests/e2e/**"],
    threads: false,
  },
});
