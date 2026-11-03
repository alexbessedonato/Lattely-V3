import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { tsconfigPaths: true }, // understand `@/...` imports, like Next.js does
  test: {
    globalSetup: "./test/global-setup.ts",
    fileParallelism: false, // the test files share one database and each empties it, so run them one at a time
  },
});
