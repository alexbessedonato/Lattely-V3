import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import stylistic from "@stylistic/eslint-plugin";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    // Our own components only: shadcn's files in components/ui stay as shadcn wrote them.
    files: ["app/**/*.tsx", "components/*.tsx"],
    plugins: { "@stylistic": stylistic },
    rules: {
      // A blank line between sibling JSX elements, so blocks don't run together. `pnpm lint --fix` adds them.
      "@stylistic/jsx-newline": "error",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
