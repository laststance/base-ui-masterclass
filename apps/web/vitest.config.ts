import { defineConfig } from "vitest/config";
import react from "@vitejs/plugin-react";
import path from "node:path";

/**
 * Vitest configuration for the web app.
 * Maps `@/*` alias to the apps/web root, matching tsconfig.json paths.
 *
 * @example
 * // Run all integration tests:
 * pnpm --filter @base-ui-masterclass/web test
 */
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "."),
    },
  },
  test: {
    environment: "node",
    include: ["**/*.test.ts"],
    setupFiles: ["./test/setup.ts"],
    mockReset: true,
  },
});
