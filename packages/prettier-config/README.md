# @andrewmcodes/prettier-config

[![npm](https://img.shields.io/npm/v/@andrewmcodes/prettier-config)](https://www.npmjs.com/package/@andrewmcodes/prettier-config)

This is a shareable [Prettier](https://prettier.io/) configuration, which includes a set of preferred styling rules that can be easily extended.

This package is part of the [`js-configs`](https://github.com/andrewmcodes/js-configs) monorepo.

## Installation

```shell
# npm
npm install --save-dev @andrewmcodes/prettier-config
# pnpm
pnpm add -D @andrewmcodes/prettier-config
# yarn
yarn add -D @andrewmcodes/prettier-config
```

## Usage

You can use this a few different ways, but the recommended approach is to add it to your `package.json`:

```json
"prettier": "@andrewmcodes/prettier-config"
```

If you don't want to use package.json, you can use any of the supported extensions to export a string, e.g. `.prettierrc.json`:

```json
"@andrewmcodes/prettier-config"
```

If you need to extend the configuration, you can use the `.js` extension and export an object:

```javascript
module.exports = {
  ...require("@andrewmcodes/prettier-config"),
  semi: false,
};
```

## Configuration

| Option       | Value    |
| ------------ | -------- |
| `printWidth` | `120`    |
| `endOfLine`  | `"auto"` |

## Compatibility

Compatible with Prettier 3.

## Contributing

I'd love your help refining this package. Please don't hesitate to send a pull request to the [`js-configs`](https://github.com/andrewmcodes/js-configs) monorepo.

### Commit Messages

This project uses [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). Please make sure your commit messages follow this format.

## License

Available as open source under the terms of the [MIT License](./LICENSE).
