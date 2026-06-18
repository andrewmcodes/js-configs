const test = require("node:test");
const assert = require("node:assert/strict");
const prettier = require("prettier");
const config = require("./index");

test("config object has printWidth property set to 120", () => {
  assert.equal(config.printWidth, 120);
});

test("config object sets endOfLine to auto", () => {
  assert.equal(config.endOfLine, "auto");
});

test("configuration formats code correctly", async () => {
  const sourceCode = "const x = { a:1, b:2, }";
  const formattedCode = await prettier.format(sourceCode, { ...config, parser: "babel" });
  assert.equal(formattedCode, "const x = { a: 1, b: 2 };\n");
});
