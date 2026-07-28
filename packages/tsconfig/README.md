# @andrewmcodes/tsconfig

[![npm](https://img.shields.io/npm/v/@andrewmcodes/tsconfig)](https://www.npmjs.com/package/@andrewmcodes/tsconfig) [![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

This is a set of shareable [TypeScript](https://www.typescriptlang.org/) configurations. They turn on the strict checks that catch real bugs, then get out of the way — each one is a base to extend, not a finished project config.

This package is part of the [`js-configs`](https://github.com/andrewmcodes/js-configs) monorepo.

## Installation

```shell
# npm
npm install --save-dev @andrewmcodes/tsconfig
# pnpm
pnpm add -D @andrewmcodes/tsconfig
# yarn
yarn add -D @andrewmcodes/tsconfig
```

## Usage

Pick the config that matches where your code runs and extend it from your `tsconfig.json`:

```json
{
  "extends": "@andrewmcodes/tsconfig/base.json",
  "include": ["src"]
}
```

Each config sets compiler options only. You always supply your own `include`/`exclude`, and your own output options if you emit.

### Available configs

| Config                              | Extends     | Use it for                                               |
| ----------------------------------- | ----------- | -------------------------------------------------------- |
| `@andrewmcodes/tsconfig/base.json`  | —           | Bundled code with no DOM or Node assumptions.            |
| `@andrewmcodes/tsconfig/dom.json`   | `base.json` | Browser code, editor plugins, anything touching the DOM. |
| `@andrewmcodes/tsconfig/node.json`  | `base.json` | Node.js CLIs, scripts, and servers.                      |
| `@andrewmcodes/tsconfig/react.json` | `dom.json`  | React apps, via the automatic JSX runtime.               |

`@andrewmcodes/tsconfig` on its own is an alias for `base.json`.

### Emitting output

Every config sets `noEmit` because most projects here are bundled by esbuild or Vite and use `tsc` purely as a type checker. If you do emit with `tsc`, turn it back on and say where output goes:

```json
{
  "extends": "@andrewmcodes/tsconfig/node.json",
  "compilerOptions": {
    "noEmit": false,
    "outDir": "dist",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src"]
}
```

### Overriding

Anything you set in `compilerOptions` wins over the inherited value:

```json
{
  "extends": "@andrewmcodes/tsconfig/base.json",
  "compilerOptions": {
    "exactOptionalPropertyTypes": false
  }
}
```

To combine configs, `extends` also accepts an array, where later entries win:

```json
{
  "extends": ["@andrewmcodes/tsconfig/node.json", "./tsconfig.paths.json"]
}
```

## Configuration

### base.json

| Option | Value | Why |
| --- | --- | --- |
| `target` | `"ES2023"` | Supported by current Node.js and every evergreen browser. A fixed year rather than `esnext`, so upgrading TypeScript never silently changes the output. |
| `lib` | `["ES2023"]` | Matches `target`. No DOM — see `dom.json`. |
| `module` | `"preserve"` | Leaves import syntax alone for the bundler to handle, and implies `moduleResolution: "bundler"`. |
| `moduleDetection` | `"force"` | Treats every file as a module, so top-level declarations never leak into global scope. |
| `verbatimModuleSyntax` | `true` | Imports and exports are emitted as written, which keeps type-only imports explicit. |
| `isolatedModules` | `true` | Guarantees each file can be transpiled on its own, which is what bundlers actually do. |
| `resolveJsonModule` | `true` | Allows importing `.json` files. |
| `esModuleInterop` | `true` | Sane interop with CommonJS packages. |
| `allowSyntheticDefaultImports` | `true` | Default imports from modules without a default export. |
| `forceConsistentCasingInFileNames` | `true` | Stops case-only import mistakes from passing on macOS and failing in CI. |
| `strict` | `true` | The whole strict family. |
| `noUncheckedIndexedAccess` | `true` | Indexing into an array or record yields `T \| undefined`. |
| `exactOptionalPropertyTypes` | `true` | Distinguishes a missing property from one explicitly set to `undefined`. |
| `noImplicitOverride` | `true` | Overriding a base member requires the `override` keyword. |
| `noImplicitReturns` | `true` | Every code path in a returning function must return. |
| `noFallthroughCasesInSwitch` | `true` | Catches missing `break` statements. |
| `noUncheckedSideEffectImports` | `true` | Typos in side-effect-only imports become errors. |
| `skipLibCheck` | `true` | Skips type checking of `.d.ts` files, which is a large build-time win and rarely finds your bugs. |
| `noEmit` | `true` | Type check only. See [Emitting output](#emitting-output). |

`noUnusedLocals` and `noUnusedParameters` are deliberately left off. ESLint already reports unused variables, with an escape hatch for names prefixed with `_`, and having both tools flag the same thing is just noise.

### dom.json

| Option | Value                               |
| ------ | ----------------------------------- |
| `lib`  | `["ES2023", "DOM", "DOM.Iterable"]` |

### node.json

| Option | Value | Why |
| --- | --- | --- |
| `module` | `"nodenext"` | Node's own module resolution, rather than a bundler's. |
| `moduleResolution` | `"nodenext"` | Follows `module`. |
| `types` | `["node"]` | Requires `@types/node` as a dev dependency. |
| `erasableSyntaxOnly` | `true` | Rejects `enum`, `namespace`, and parameter properties, so Node can run the TypeScript directly by stripping types. |

Because `nodenext` and `verbatimModuleSyntax` are used together, your `package.json` must declare its module system explicitly:

```json
{
  "type": "module"
}
```

Without it, Node and TypeScript treat `.ts` files as CommonJS and `export` statements will error. Use the `.mts`/`.cts` extensions if you need to mix both.

### react.json

| Option | Value         |
| ------ | ------------- |
| `jsx`  | `"react-jsx"` |

## Compatibility

Requires TypeScript 5.8 or later, which is when `erasableSyntaxOnly` landed. Tested against TypeScript 7.

## Contributing

I'd love your help refining this package. Please don't hesitate to send a pull request to the [`js-configs`](https://github.com/andrewmcodes/js-configs) monorepo.

### Commit Messages

This project uses [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/). Please make sure your commit messages follow this format.

## License

Available as open source under the terms of the [MIT License](./LICENSE.md).
