---
"@andrewmcodes/eslint-config": major
---

Add `@andrewmcodes/eslint-config`, a set of shareable ESLint flat configurations.

Four entry points are published: the base config, plus `browser`, `node`, and `obsidian`. All build on `eslint:recommended` and `typescript-eslint`'s `recommended` preset, adding an underscore escape hatch for intentionally unused variables and downgrading `no-explicit-any` to a warning.

Requires ESLint 10. The `typescript` peer range is capped below 6.1 because typescript-eslint does not yet support TypeScript 7, and `eslint-plugin-obsidianmd` is an optional peer dependency needed only for the `obsidian` entry point.
