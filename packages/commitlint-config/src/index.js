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
};

module.exports = config;
