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
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      // Ignore type declarations and test fixtures but include source under test
      exclude: [
        "node_modules/",
        "dist/",
        "**/*.d.ts",
      ],
    },
  },
});
