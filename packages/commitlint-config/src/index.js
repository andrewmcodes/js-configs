// @ts-check

/** @typedef {import("@commitlint/types").QualifiedRules} QualifiedRules */

/** @type {QualifiedRules} */
const rules = {
  "body-max-line-length": [0],
  "footer-max-line-length": [0],
};

/** @typedef {import("@commitlint/types").UserConfig & { rules: QualifiedRules }} UserConfig */

/** @type {UserConfig} */
const config = {
  extends: ["@commitlint/config-conventional"],
  rules: rules,
  // Skip merge commits with custom subjects (e.g. "Merge origin/main and
  // resolve conflicts") that don't match commitlint's built-in merge patterns.
  ignores: [(message) => message.startsWith("Merge ")],
};

module.exports = config;
