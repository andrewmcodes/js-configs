const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { execFileSync, spawnSync } = require("node:child_process");

const pkg = require("./package.json");

/** Every config this package ships. Keep in sync with `files` and `exports`. */
const CONFIGS = ["base.json", "dom.json", "node.json", "react.json"];

// TypeScript does not expose its CLI through `exports`, so go via package.json
// (which it does export) and read the `bin` entry. Running the shim through
// `process.execPath` avoids depending on the node_modules/.bin layout.
const typescriptDir = path.dirname(require.resolve("typescript/package.json"));
const TSC = path.join(typescriptDir, require("typescript/package.json").bin.tsc);

/**
 * Build a throwaway project that extends one of our configs and hand it to the
 * real compiler.
 *
 * The fixture is created inside this package rather than the OS temp directory
 * so that `types` entries such as `node` resolve through the usual node_modules
 * lookup, exactly as they would in a consuming project.
 */
function withFixture(configFile, run) {
  const dir = fs.mkdtempSync(path.join(__dirname, ".fixture-"));

  try {
    // `node.json` pairs `nodenext` with `verbatimModuleSyntax`, which requires
    // the nearest package.json to state its module system outright. Every
    // config is exercised against the ESM layout we expect consumers to use.
    fs.writeFileSync(path.join(dir, "package.json"), JSON.stringify({ name: "fixture", type: "module" }));
    fs.writeFileSync(path.join(dir, "index.ts"), "export const answer: number = 42;\n");
    fs.writeFileSync(
      path.join(dir, "tsconfig.json"),
      JSON.stringify({ extends: path.join(__dirname, configFile), include: ["index.ts"] }),
    );
    return run(path.join(dir, "tsconfig.json"));
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
}

/**
 * Type-check the fixture. Unlike `--showConfig`, a real compile rejects unknown
 * or misspelled compiler options (TS5023/TS5024), so this is what proves the
 * configs are actually valid rather than merely well-formed JSON.
 */
function typeCheck(configFile) {
  return withFixture(configFile, (fixture) =>
    spawnSync(process.execPath, [TSC, "--project", fixture], { encoding: "utf8" }),
  );
}

/** Resolve a config to its effective compiler options. */
function resolveConfig(configFile) {
  return withFixture(configFile, (fixture) => {
    const stdout = execFileSync(process.execPath, [TSC, "--project", fixture, "--showConfig"], { encoding: "utf8" });
    return JSON.parse(stdout).compilerOptions;
  });
}

test("every shipped config is valid JSON", () => {
  for (const config of CONFIGS) {
    const contents = fs.readFileSync(path.join(__dirname, config), "utf8");
    assert.doesNotThrow(() => JSON.parse(contents), `${config} should be parseable`);
  }
});

test("package.json publishes and exports every config", () => {
  for (const config of CONFIGS) {
    assert.ok(pkg.files.includes(config), `${config} should be listed in "files"`);
    assert.equal(pkg.exports[`./${config}`], `./${config}`, `${config} should be listed in "exports"`);
  }

  // The bare specifier is a convenience alias for the base config.
  assert.equal(pkg.exports["."], "./base.json");
});

test("every config type-checks a project without compiler errors", () => {
  for (const config of CONFIGS) {
    const result = typeCheck(config);
    assert.equal(result.status, 0, `${config} should compile cleanly:\n${result.stdout}${result.stderr}`);
  }
});

test("an unknown compiler option would be caught", () => {
  // Guards the check above: if `tsc` ever stops rejecting bad options, this
  // fails and tells us the suite has lost its teeth.
  const dir = fs.mkdtempSync(path.join(__dirname, ".fixture-"));

  try {
    fs.writeFileSync(path.join(dir, "index.ts"), "export const answer = 42;\n");
    fs.writeFileSync(
      path.join(dir, "tsconfig.json"),
      JSON.stringify({ compilerOptions: { notARealOption: true }, include: ["index.ts"] }),
    );

    const result = spawnSync(process.execPath, [TSC, "--project", path.join(dir, "tsconfig.json")], {
      encoding: "utf8",
    });

    assert.notEqual(result.status, 0, "tsc should reject an unknown compiler option");
    assert.match(result.stdout + result.stderr, /notARealOption/);
  } finally {
    fs.rmSync(dir, { recursive: true, force: true });
  }
});

test("base enables strict type checking and does not emit", () => {
  const options = resolveConfig("base.json");

  assert.equal(options.strict, true);
  assert.equal(options.noUncheckedIndexedAccess, true);
  assert.equal(options.exactOptionalPropertyTypes, true);
  assert.equal(options.noImplicitOverride, true);
  assert.equal(options.noImplicitReturns, true);
  assert.equal(options.noFallthroughCasesInSwitch, true);
  assert.equal(options.noEmit, true);
});

test("base targets ES2023 without assuming a DOM", () => {
  const options = resolveConfig("base.json");

  assert.equal(options.target, "es2023");
  assert.deepEqual(options.lib, ["es2023"]);
  assert.equal(options.module, "preserve");
  assert.equal(options.moduleDetection, "force");
  assert.equal(options.verbatimModuleSyntax, true);
  assert.equal(options.isolatedModules, true);
});

test("dom adds browser libs to the base config", () => {
  const options = resolveConfig("dom.json");

  assert.deepEqual(options.lib, ["es2023", "dom", "dom.iterable"]);
  assert.equal(options.strict, true, "should inherit base strictness");
  assert.equal(options.module, "preserve", "should inherit base module setting");
});

test("node switches to nodenext resolution and node types", () => {
  const options = resolveConfig("node.json");

  assert.equal(options.module, "nodenext");
  assert.equal(options.moduleResolution, "nodenext");
  assert.deepEqual(options.types, ["node"]);
  assert.equal(options.erasableSyntaxOnly, true);
  assert.equal(options.strict, true, "should inherit base strictness");
  assert.ok(!options.lib.includes("dom"), "node should not pull in DOM libs");
});

test("react adds the automatic JSX runtime on top of dom", () => {
  const options = resolveConfig("react.json");

  assert.equal(options.jsx, "react-jsx");
  assert.deepEqual(options.lib, ["es2023", "dom", "dom.iterable"], "should inherit dom libs");
  assert.equal(options.strict, true, "should inherit base strictness");
});
