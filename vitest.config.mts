import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { tsconfigPaths: true }, // understand `@/...` imports, like Next.js does
  test: {
    globalSetup: "./test/global-setup.ts",
  },
});
