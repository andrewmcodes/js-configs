import { defineConfig } from "eslint/config";
import globals from "globals";

import base from "./base.js";

/** The base config with browser globals (`window`, `document`, `fetch`, ...). */
export default defineConfig(base, {
  languageOptions: {
    globals: {
      ...globals.browser,
    },
  },
});
