// This package lints itself with its own config, which keeps the config honest:
// if it fails to load or contradicts itself, `pnpm lint` says so.
import { defineConfig, globalIgnores } from "eslint/config";

import node from "./src/node.js";

export default defineConfig(
  // The fixtures contain deliberate rule violations and are linted by the test
  // suite with the config they are meant to exercise.
  globalIgnores(["fixtures/**"]),
  node,
);
