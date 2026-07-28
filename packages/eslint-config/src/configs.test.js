import test from "node:test";
import assert from "node:assert/strict";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { spawnSync } from "node:child_process";

import { ESLint } from "eslint";

import base from "./base.js";
import browser from "./browser.js";
import nodeConfig from "./node.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const pkg = require("../package.json");

// The obsidian entry is deliberately not imported here. `eslint-plugin-obsidianmd`
// reads `manifest.json` from the working directory the moment it is loaded, so
// importing it outside a plugin project prints a spurious error. It is exercised
// through the fixture below instead, which is a truer test anyway.
const OBSIDIAN_FIXTURE = path.join(here, "..", "fixtures", "obsidian-plugin");

const ENTRY_POINTS = {
  ".": { file: "base.js", config: base },
  "./browser": { file: "browser.js", config: browser },
  "./node": { file: "node.js", config: nodeConfig },
  "./obsidian": { file: "obsidian.js", config: null },
};

// ESLint does not expose its CLI through `exports`, so locate it via the `bin`
// entry in its package.json, which is exported.
const eslintPkgPath = require.resolve("eslint/package.json");
const ESLINT_BIN = path.join(path.dirname(eslintPkgPath), require(eslintPkgPath).bin.eslint);

/** Run the ESLint CLI inside the Obsidian plugin fixture. */
function runInFixture(args) {
  return spawnSync(process.execPath, [ESLINT_BIN, ...args], {
    cwd: OBSIDIAN_FIXTURE,
    encoding: "utf8",
  });
}

/**
 * Lint a snippet with one of our configs and return the resulting messages.
 *
 * `cwd` is pinned to the package directory so ESLint never walks up and picks
 * up the repository's own config instead of the one under test.
 */
async function lint(configFile, code, filename) {
  const eslint = new ESLint({
    cwd: here,
    overrideConfigFile: path.join(here, configFile),
  });

  const [result] = await eslint.lintText(code, { filePath: path.join(here, filename) });
  return result.messages;
}

test("every entry point resolves to a flat config array", () => {
  for (const [specifier, { config }] of Object.entries(ENTRY_POINTS)) {
    if (config === null) continue;

    assert.ok(Array.isArray(config), `${specifier} should export an array`);
    assert.ok(config.length > 0, `${specifier} should not be empty`);
  }
});

test("package.json publishes and exports every entry point", () => {
  for (const [specifier, { file }] of Object.entries(ENTRY_POINTS)) {
    assert.equal(pkg.exports[specifier], `./src/${file}`, `${specifier} should be exported`);
    assert.ok(pkg.files.includes(`src/${file}`), `src/${file} should be listed in "files"`);
  }
});

test("base reports unused variables as warnings", async () => {
  const messages = await lint("base.js", "const unused = 1;\n", "sample.ts");
  const unused = messages.find((m) => m.ruleId?.endsWith("no-unused-vars"));

  assert.ok(unused, `expected an unused-vars message, got ${JSON.stringify(messages)}`);
  assert.equal(unused.severity, 1, "should warn rather than error");
});

test("base allows unused names prefixed with an underscore", async () => {
  const messages = await lint("base.js", "const _unused = 1;\n", "sample.ts");
  const unused = messages.filter((m) => m.ruleId?.endsWith("no-unused-vars"));

  assert.deepEqual(unused, [], "underscore-prefixed names are the documented escape hatch");
});

test("base applies the underscore escape hatch to plain JavaScript too", async () => {
  const reported = await lint("base.js", "const unused = 1;\n", "sample.js");
  assert.ok(
    reported.some((m) => m.ruleId === "no-unused-vars"),
    "core rule should cover .js files",
  );

  const ignored = await lint("base.js", "const _unused = 1;\n", "sample.js");
  assert.deepEqual(
    ignored.filter((m) => m.ruleId === "no-unused-vars"),
    [],
  );
});

test("base treats explicit any as a warning, not an error", async () => {
  const messages = await lint("base.js", "export function f(x: any) {\n  return x;\n}\n", "sample.ts");
  const explicitAny = messages.find((m) => m.ruleId === "@typescript-eslint/no-explicit-any");

  assert.ok(explicitAny, "should flag explicit any");
  assert.equal(explicitAny.severity, 1);
});

test("base still catches genuine errors", async () => {
  const messages = await lint("base.js", "debugger;\n", "sample.js");

  assert.ok(
    messages.some((m) => m.ruleId === "no-debugger" && m.severity === 2),
    "eslint:recommended should still be in force",
  );
});

test("base does not assume any environment globals", async () => {
  const messages = await lint("base.js", "window.setTimeout(() => {});\n", "sample.js");

  assert.ok(
    messages.some((m) => m.ruleId === "no-undef"),
    "base intentionally leaves globals to the environment configs",
  );
});

test("browser adds browser globals", async () => {
  const messages = await lint("browser.js", "window.setTimeout(() => document.title);\n", "sample.js");

  assert.deepEqual(
    messages.filter((m) => m.ruleId === "no-undef"),
    [],
  );
});

test("node adds Node.js globals", async () => {
  const messages = await lint("node.js", "process.exitCode = Buffer.from('a').length;\n", "sample.js");

  assert.deepEqual(
    messages.filter((m) => m.ruleId === "no-undef"),
    [],
  );
});

test("node does not leak browser globals", async () => {
  const messages = await lint("node.js", "window.setTimeout(() => {});\n", "sample.js");

  assert.ok(
    messages.some((m) => m.ruleId === "no-undef"),
    "a Node config should not define window",
  );
});

test("obsidian config loads and lints a real plugin layout", () => {
  const result = runInFixture(["src", "--format", "json"]);

  assert.equal(result.stderr, "", `eslint should not report a load failure:\n${result.stderr}`);

  const [file] = JSON.parse(result.stdout);
  const unused = file.messages.filter((m) => m.ruleId?.endsWith("no-unused-vars"));

  assert.equal(unused.length, 1, `expected exactly one unused-vars warning, got ${JSON.stringify(file.messages)}`);
  assert.match(unused[0].message, /unusedValue/, "underscore-prefixed names should stay exempt");
  assert.equal(file.errorCount, 0, "the fixture should produce warnings only");
});

test("obsidian enables the plugin rules and browser globals", () => {
  const result = runInFixture(["--print-config", "src/main.ts"]);

  assert.equal(result.status, 0, `--print-config should succeed:\n${result.stderr}`);

  const config = JSON.parse(result.stdout);

  assert.ok(
    Object.keys(config.rules).some((id) => id.startsWith("obsidianmd/")),
    "should enable eslint-plugin-obsidianmd rules",
  );
  assert.ok(config.languageOptions.globals.window !== undefined, "should inherit browser globals");
});
