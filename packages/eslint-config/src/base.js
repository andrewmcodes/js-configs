import js from "@eslint/js";
import { defineConfig, globalIgnores } from "eslint/config";
import tseslint from "typescript-eslint";

/**
 * Paths that are generated, vendored, or otherwise not worth linting.
 *
 * Exported so the environment-specific configs can extend it rather than
 * restate it, and so consumers can reuse it when they add ignores of their own.
 */
export const defaultIgnores = ["**/dist/**", "**/build/**", "**/coverage/**", "**/*.min.js"];

/**
 * The shared base: ESLint's recommended rules plus typescript-eslint's, with a
 * couple of long-standing personal adjustments.
 *
 * No environment globals are set here. TypeScript already knows which globals
 * exist, and guessing wrong is worse than leaving it to the caller — use the
 * `browser` or `node` entry points, or set `languageOptions.globals` yourself.
 */
export default defineConfig(
  globalIgnores(defaultIgnores),
  js.configs.recommended,
  tseslint.configs.recommended,
  {
    rules: {
      // A leading underscore is the conventional way to say "I know this is
      // unused, I want it for its position or for documentation".
      "@typescript-eslint/no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      // `any` is sometimes the honest answer, especially at a boundary. Worth
      // a nudge, not a failed build.
      "@typescript-eslint/no-explicit-any": "warn",
    },
  },
  {
    // Plain JavaScript never gets the TypeScript-aware rules, so the base
    // `no-unused-vars` needs the same underscore escape hatch.
    files: ["**/*.{js,mjs,cjs}"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "no-unused-vars": [
        "warn",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
    },
  },
);
