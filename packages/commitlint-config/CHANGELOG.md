# Changelog

## 1.0.0

### Major Changes

- d1a04d0: Migrate into the `js-configs` monorepo and update `@commitlint/config-conventional` to v21. The shareable rules are unchanged (extends `@commitlint/config-conventional` and disables `body-max-line-length` and `footer-max-line-length`), but the updated dependency is ESM-only and requires Node.js >= 22.12 and commitlint 19+, so this is released as a breaking change for consumers on older toolchains.

## [0.1.2](https://github.com/andrewmcodes/commitlint-config/compare/v0.1.1...v0.1.2) (2023-05-25)

### Bug Fixes

- set access to public ([51906ff](https://github.com/andrewmcodes/commitlint-config/commit/51906ff83a20635e68f59204866b004b255e8644))

## [0.1.1](https://github.com/andrewmcodes/commitlint-config/compare/v0.1.0...v0.1.1) (2023-05-25)

### Bug Fixes

- set correct package name ([b70b02f](https://github.com/andrewmcodes/commitlint-config/commit/b70b02f4d03177957acd2d840cdc9dd8f6194a93))

## 0.1.0 (2023-05-25)

### Features

- add shareable configuration ([6119e33](https://github.com/andrewmcodes/commitlint-config/commit/6119e3336af53e0782ed085eee289eeab36b27c1))
