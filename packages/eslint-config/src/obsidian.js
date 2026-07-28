import { defineConfig, globalIgnores } from "eslint/config";
import obsidianmd from "eslint-plugin-obsidianmd";

import browser from "./browser.js";

/**
 * Files an Obsidian plugin repo generates or vendors: the bundled output, the
 * esbuild and release scripts, and the manifest bookkeeping.
 */
export const obsidianIgnores = ["main.js", "versions.json", "esbuild.config.mjs", "version-bump.mjs"];

/**
 * Configuration for Obsidian plugin development.
 *
 * Requires `eslint-plugin-obsidianmd`, which is an optional peer dependency so
 * that it is not installed for every other kind of project.
 *
 * `projectService` turns on type-aware linting, which the plugin's rules need.
 * It resolves each file against the nearest `tsconfig.json`, using the working
 * directory ESLint was started from as the root. If you run ESLint from
 * somewhere else, append an override setting
 * `languageOptions.parserOptions.tsconfigRootDir`.
 */
export default defineConfig(
  globalIgnores(obsidianIgnores),
  // The plugin's preset bundles typescript-eslint's recommended rules, which
  // restate `no-unused-vars` with its stock options. It therefore has to come
  // before the base config, so that the underscore escape hatch survives.
  obsidianmd.configs.recommended,
  browser,
  {
    languageOptions: {
      parserOptions: {
        projectService: {
          // Config and manifest files sit outside the tsconfig `include`, so
          // give them an inferred project rather than failing to resolve.
          allowDefaultProject: ["eslint.config.js", "eslint.config.mjs", "eslint.config.mts", "manifest.json"],
        },
        extraFileExtensions: [".json"],
      },
    },
  },
);
