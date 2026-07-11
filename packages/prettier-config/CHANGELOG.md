# Changelog

## 3.0.0

### Major Changes

- 82e9a9d: feat: set `proseWrap` to `"never"` to prevent prose wrapping in Markdown

### Patch Changes

- 7de4e47: docs: add a Configuration section to each package README documenting the options/rules that override upstream defaults

## 2.1.0

### Minor Changes

- d1a04d0: Migrate into the `js-configs` monorepo. Add an `exports` field and declare `prettier` (`>=3.0.0`) as a peer dependency to follow Prettier's shareable-config best practices. The config behavior is unchanged (`printWidth: 120`, `endOfLine: "auto"`).

## [2.0.0](https://github.com/andrewmcodes/prettier-config/compare/v1.0.0...v2.0.0) (2023-05-25)

### ⚠ BREAKING CHANGES

- update config and rearchitect repo ([#6](https://github.com/andrewmcodes/prettier-config/issues/6))

### Code Refactoring

- update config and rearchitect repo ([#6](https://github.com/andrewmcodes/prettier-config/issues/6)) ([9d55b9d](https://github.com/andrewmcodes/prettier-config/commit/9d55b9dd634fd2e2a02160d8a8a0997b83059977))
