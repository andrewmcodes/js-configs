---
"@andrewmcodes/commitlint-config": major
---

Migrate into the `js-configs` monorepo and update `@commitlint/config-conventional` to v21. The shareable rules are unchanged (extends `@commitlint/config-conventional` and disables `body-max-line-length` and `footer-max-line-length`), but the updated dependency is ESM-only and requires Node.js >= 22.12 and commitlint 19+, so this is released as a breaking change for consumers on older toolchains.
