import { configDefaults, defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { tsconfigPaths: true }, // understand `@/...` imports, like Next.js does
  test: {
    globalSetup: "./test/global-setup.ts",
    exclude: [...configDefaults.exclude, "e2e/**"], // Playwright runs those, with `pnpm test:e2e`
    fileParallelism: false, // the test files share one database and each empties it, so run them one at a time
  },
});
