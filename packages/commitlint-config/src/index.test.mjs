import test from "node:test";
import assert from "node:assert/strict";
import load from "@commitlint/load";
import lint from "@commitlint/lint";
import config from "./index.js";

// Resolve the config exactly as commitlint would, including `extends`.
const { rules, parserPreset } = await load(config);
const opts = { parserOpts: parserPreset?.parserOpts };

test("accepts a valid commit", async () => {
  const { valid } = await lint("feat: a valid commit message", rules, opts);
  assert.equal(valid, true);
});

test("rejects a commit with an invalid type", async () => {
  const { valid } = await lint("invalid: an invalid commit message", rules, opts);
  assert.equal(valid, false);
});

test("rejects a commit with an invalid type case", async () => {
  const { valid } = await lint("FIX: an invalid commit message", rules, opts);
  assert.equal(valid, false);
});

test("accepts a commit with a long body", async () => {
  const { valid } = await lint(
    "feat: a valid commit message\n\nThis is a long body that exceeds the 100 character limit",
    rules,
    opts,
  );
  assert.equal(valid, true);
});

test("accepts a commit with a long footer", async () => {
  const { valid } = await lint(
    "feat: a valid commit message\n\nThis is a long body that exceeds the 100 character limit\n\nFooter: This is a long footer that exceeds the 100 character limit",
    rules,
    opts,
  );
  assert.equal(valid, true);
});
