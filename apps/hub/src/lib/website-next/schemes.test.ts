import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import path from "node:path";

const here = path.dirname(fileURLToPath(import.meta.url));
const copy = path.resolve(here, "../../content/website/scheme-master.json");
const source = path.resolve(here, "../../../../../docs/research/dosje-scheme-master-2026-09.json");

test("the app's scheme master is an exact copy of the research source", () => {
  assert.deepEqual(JSON.parse(readFileSync(copy, "utf8")), JSON.parse(readFileSync(source, "utf8")));
});
