# @andrewmcodes/eslint-config

[![npm](https://img.shields.io/npm/v/@andrewmcodes/eslint-config)](https://www.npmjs.com/package/@andrewmcodes/eslint-config) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

This is a set of shareable [ESLint](https://eslint.org/) [flat configurations](https://eslint.org/docs/latest/use/configure/configuration-files) for JavaScript and TypeScript. ESLint's recommended rules plus [typescript-eslint](https://typescript-eslint.io/)'s, with a small number of deliberate adjustments.

This package is part of the [`js-configs`](https://github.com/andrewmcodes/js-configs) monorepo.

## Installation

```shell
# npm
npm install --save-dev @andrewmcodes/eslint-config eslint
# pnpm
pnpm add -D @andrewmcodes/eslint-config eslint
# yarn
yarn add -D @andrewmcodes/eslint-config eslint
```

## Usage

Pick the entry point that matches where your code runs and re-export it from `eslint.config.js`:

```js
// eslint.config.js
import config from "@andrewmcodes/eslint-config/node";

export default config;
```

### Available configs

| Entry point                            | Adds                                                     |
| -------------------------------------- | -------------------------------------------------------- |
| `@andrewmcodes/eslint-config`          | The base rules. No environment globals.                  |
| `@andrewmcodes/eslint-config/browser`  | Browser globals (`window`, `document`, `fetch`, ...).    |
| `@andrewmcodes/eslint-config/node`     | Node.js globals (`process`, `Buffer`, `__dirname`, ...). |
| `@andrewmcodes/eslint-config/obsidian` | Obsidian plugin rules, on top of the browser config.     |

The base config deliberately sets no environment globals. TypeScript already knows which globals exist, so for a TypeScript-only project the base is usually what you want; reach for `browser` or `node` when you also lint plain JavaScript, where ESLint's `no-undef` is active.

### Extending

Add your own config objects after the import — later entries win:

```js
// eslint.config.js
import { defineConfig } from "eslint/config";
import config from "@andrewmcodes/eslint-config/browser";

export default defineConfig(config, {
  rules: {
    "@typescript-eslint/no-explicit-any": "error",
  },
});
```

The default ignore list is exported separately if you want to build on it:

```js
import { defaultIgnores } from "@andrewmcodes/eslint-config";
```

### Type-aware linting

The base config uses typescript-eslint's `recommended` preset, which does not require type information and therefore needs no setup. To opt into the rules that do use types, turn on the project service:

```js
// eslint.config.js
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";
import config from "@andrewmcodes/eslint-config/node";

export default defineConfig(config, tseslint.configs.recommendedTypeChecked, {
  languageOptions: {
    parserOptions: {
      projectService: true,
      tsconfigRootDir: import.meta.dirname,
    },
  },
});
```

### Obsidian plugins

The `obsidian` entry point requires [`eslint-plugin-obsidianmd`](https://www.npmjs.com/package/eslint-plugin-obsidianmd), which is an optional peer dependency so it is not installed for every other kind of project:

```shell
pnpm add -D @andrewmcodes/eslint-config eslint eslint-plugin-obsidianmd
```

```js
// eslint.config.js
import config from "@andrewmcodes/eslint-config/obsidian";

export default config;
```

It turns on type-aware linting, which the plugin's rules need, and resolves each file against the nearest `tsconfig.json`. If you run ESLint from somewhere other than the plugin root, append an override setting `languageOptions.parserOptions.tsconfigRootDir`.

Two things to know about the plugin itself. It reads `manifest.json` from the working directory as soon as it loads, so ESLint has to be run from the plugin root or it will log a file-not-found error. It also declares peer dependencies on `@eslint/js` 9 and an exact `obsidian` version; with ESLint 10 you will see a peer warning at install time, which is cosmetic — the rules work.

## Configuration

Beyond `eslint:recommended` and `typescript-eslint/recommended`:

| Rule | Setting | Why |
| --- | --- | --- |
| `no-unused-vars` / `@typescript-eslint/no-unused-vars` | `warn`, ignoring names matching `^_` | A leading underscore is the conventional way to say "unused on purpose" — for a parameter kept for its position, or a destructured key being omitted. |
| `@typescript-eslint/no-explicit-any` | `warn` | `any` is sometimes the honest answer at a boundary. Worth a nudge, not a failed build. |

Ignored by default: `**/dist/**`, `**/build/**`, `**/coverage/**`, `**/*.min.js`.

`noUnusedLocals` and `noUnusedParameters` are intentionally left out of [`@andrewmcodes/tsconfig`](../tsconfig) so that unused variables are reported here, once, with the underscore escape hatch.

## Compatibility

Requires ESLint 10 and flat config.

**TypeScript 6 only, for now.** typescript-eslint does not yet support TypeScript 7 — it throws on import when it can resolve it — so the `typescript` peer range is `>=5.0.0 <6.1.0`. This is tracked in [typescript-eslint#10940](https://github.com/typescript-eslint/typescript-eslint/issues/10940), and the range will widen once support lands. `@andrewmcodes/tsconfig` has no such limit and works with TypeScript 7.

## Contributing

I'd love your help refining this package. Please don't hesitate to send a pull request to the [`js-configs`](https://github.com/andrewmcodes/js-configs) monorepo.

### Commit Messages

This project uses [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). Please make sure your commit messages follow this format.

## License

Available as open source under the terms of the [MIT License](./LICENSE.md).
