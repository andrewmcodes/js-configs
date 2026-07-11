# @andrewmcodes/commitlint-config

[![npm](https://img.shields.io/npm/v/@andrewmcodes/commitlint-config)](https://www.npmjs.com/package/@andrewmcodes/commitlint-config)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Conventional Commits](https://img.shields.io/badge/Conventional%20Commits-1.0.0-%23FE5196?logo=conventionalcommits&logoColor=white)](https://conventionalcommits.org)

This is a shareable [commitlint](https://commitlint.js.org/) configuration, which extends [`@commitlint/config-conventional`](https://www.npmjs.com/package/@commitlint/config-conventional) and disables the body and footer max line length rules.

This package is part of the [`js-configs`](https://github.com/andrewmcodes/js-configs) monorepo.

## Installation

```shell
# npm
npm install --save-dev @andrewmcodes/commitlint-config
# pnpm
pnpm add -D @andrewmcodes/commitlint-config
# yarn
yarn add -D @andrewmcodes/commitlint-config
```

## Usage

Add the following to your `commitlint.config.js`:

```js
// commitlint.config.js
module.exports = {
  extends: ["@andrewmcodes"], // => @andrewmcodes/commitlint-config
};
```

## Configuration

This config extends `@commitlint/config-conventional`. The full effective rule set is listed below.

| Rule                     | Value                                                                                                           |
| ------------------------ | --------------------------------------------------------------------------------------------------------------- |
| `body-leading-blank`     | `[1, "always"]`                                                                                                 |
| `body-max-line-length`   | `[0]`                                                                                                           |
| `footer-leading-blank`   | `[1, "always"]`                                                                                                 |
| `footer-max-line-length` | `[0]`                                                                                                           |
| `header-max-length`      | `[2, "always", 100]`                                                                                            |
| `header-trim`            | `[2, "always"]`                                                                                                 |
| `subject-case`           | `[2, "never", ["sentence-case", "start-case", "pascal-case", "upper-case"]]`                                    |
| `subject-empty`          | `[2, "never"]`                                                                                                  |
| `subject-full-stop`      | `[2, "never", "."]`                                                                                             |
| `type-case`              | `[2, "always", "lower-case"]`                                                                                   |
| `type-empty`             | `[2, "never"]`                                                                                                  |
| `type-enum`              | `[2, "always", ["build", "chore", "ci", "docs", "feat", "fix", "perf", "refactor", "revert", "style", "test"]]` |

## Compatibility

Compatible with commitlint 19+ and `@commitlint/config-conventional` 21. Requires Node.js >= 22.12.0.

## Contributing

I'd love your help refining this package. Please don't hesitate to send a pull request to the [`js-configs`](https://github.com/andrewmcodes/js-configs) monorepo.

### Commit Messages

This project uses [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). Please make sure your commit messages follow this format.

## License

Available as open source under the terms of the [MIT License](./LICENSE.md).
