---
"@andrewmcodes/tsconfig": major
---

Add `@andrewmcodes/tsconfig`, a set of shareable TypeScript configurations.

Four configs are published: `base.json` for bundled code, `dom.json` for browser code, `node.json` for Node.js, and `react.json` for React apps. Each enables the strict checks worth having (`strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, `noImplicitOverride`, `noImplicitReturns`, `noFallthroughCasesInSwitch`, `noUncheckedSideEffectImports`) and leaves `include`/`exclude` and output options to the consuming project.

Requires TypeScript 5.8 or later.
