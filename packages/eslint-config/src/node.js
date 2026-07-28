import { defineConfig } from "eslint/config";
import globals from "globals";

import base from "./base.js";

/** The base config with Node.js globals (`process`, `__dirname`, `Buffer`, ...). */
export default defineConfig(base, {
  languageOptions: {
    globals: {
      ...globals.node,
    },
  },
});
