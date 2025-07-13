import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: {
    alias: {},
  },
  test: {
    globals: true,
    environment: "jsdom",
    include: ["tests/utils/**/*.test.ts", "tests/components/**/*.test.tsx"],
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "dist/",
        "tests/",
        "**/*.d.ts",
        "**/*.test.ts",
        "**/*.spec.ts",
      ],
    },
  },
});
