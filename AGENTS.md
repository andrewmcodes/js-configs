# AGENTS.md

## Purpose

This repository contains shareable JavaScript and Node.js tooling configuration packages.

Primary rule: migration is not a rewrite.

Preserve existing package behavior before making improvements.

## Repository Rules

- Use pnpm.
- Use pnpm workspaces.
- Use pnpm catalogs for shared dependency versions.
- Use mise for local tooling and tasks.
- Use Changesets for versioning.
- Use npm Trusted Publishing for releases.
- Do not introduce Turborepo, Nx, Lerna, or similar tooling.
- Do not introduce build tooling unless required.
- Prefer plain JavaScript for config packages.
- Keep packages small and directly publishable.

## Temporary Migration Workspace

The `tmp/` directory may contain cloned source repositories:

```txt
tmp/prettier-config
tmp/commitlint-config
```

Rules:

- `tmp/` is reference-only.
- `tmp/` must be gitignored.
- Never commit `tmp/`.
- Do not modify source repos in `tmp/` unless needed for local comparison.
- Use `tmp/` to verify package metadata, exports, README examples, tests, dependencies, and published files.

## Commands

Install:

```bash
mise install
pnpm install
```

Check:

```bash
pnpm lint
pnpm test
pnpm format:check
```

Format:

```bash
pnpm format
```

Create changeset:

```bash
pnpm changeset
```

## Package Standards

Each package must:

- live in `packages/<name>`
- preserve current package name
- preserve current public API
- preserve current consumer behavior
- include `README.md`
- include `CHANGELOG.md`
- define `publishConfig.access = "public"`
- define package files intentionally
- avoid unnecessary build steps
- include validation tests

## Migration Rules

For each migrated package, compare against the source repo:

- package name
- version
- entry points
- exports
- published files
- peer dependencies
- dependencies
- README usage examples
- license
- tests
- release notes or changelog

Do not rename, restructure, modernize, or refactor package behavior unless required for the monorepo.

## Changeset Rules

Add a changeset for user-facing package changes.

Bump policy:

- `patch`: docs, dependencies, internal fixes, non-breaking config refinements
- `minor`: additive options or non-breaking new behavior
- `major`: stricter config defaults, formatting changes, breaking exports, breaking consumer behavior

## Commit Rules

Commit incrementally. Make small, focused commits as work progresses rather than one large commit at the end.

Use the [Conventional Commits](https://www.conventionalcommits.org/) standard for every commit message:

```txt
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

Common types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `build`, `ci`, `chore`, `revert`.

Guidelines:

- Scope commits to a single logical change.
- Use a scope to name the affected package when relevant, e.g. `feat(prettier-config): add tailwind plugin`.
- Use the imperative mood in the description, e.g. "add", not "added".
- Mark breaking changes with `!` after the type/scope, e.g. `feat(commitlint-config)!: ...`, or with a `BREAKING CHANGE:` footer.
- Keep commit conventions consistent with the Changeset bump policy above.

## Prohibited Changes

Do not:

- commit `tmp/`
- commit `node_modules/`
- publish the root package
- hardcode invented package versions
- change package names
- break existing consumer usage
- add build tooling without justification
- replace Changesets with release-please
- add Turborepo, Nx, or Lerna
