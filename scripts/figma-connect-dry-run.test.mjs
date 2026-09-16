import { test } from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const script = fileURLToPath(new URL("./figma-connect-dry-run.mjs", import.meta.url));

/** Drive the wrapper with a fake CLI, so neither path calls Figma. */
function run(cmd, { timeoutMs = 20_000 } = {}) {
  const r = spawnSync(process.execPath, [script], {
    encoding: "utf8",
    timeout: timeoutMs,
    env: { ...process.env, FIGMA_CONNECT_DRY_RUN_CMD: cmd },
  });
  return { code: r.status, out: `${r.stdout ?? ""}${r.stderr ?? ""}` };
}

test("a valid dry run passes straight through", () => {
  const { code, out } = run("echo 'All Code Connect files are valid'");
  assert.equal(code, 0);
  assert.match(out, /All Code Connect files are valid/);
});

test("a real Code Connect failure still fails the build", () => {
  const { code } = run("echo 'error: template reads a property the master does not have' && exit 1");
  assert.equal(code, 1, "a validation failure must not be softened into a warning");
});

test("a rate limit exits 2, the code the workflow warns on", () => {
  // Three attempts with two backoffs would take minutes; the test only needs the
  // classifier and the exit code, so it runs with the waits cut to nothing.
  const r = spawnSync(process.execPath, [script], {
    encoding: "utf8",
    timeout: 20_000,
    env: {
      ...process.env,
      FIGMA_CONNECT_DRY_RUN_CMD: "echo 'Failed to to fetch node info (429): 429 Rate limit exceeded' && exit 1",
      FIGMA_CONNECT_DRY_RUN_BACKOFF_MS: "1,1",
    },
  });
  assert.match(`${r.stdout}${r.stderr}`, /attempt 2 of 3/, "it retries before giving up");
  assert.equal(r.status, 2, "a rate limit is the tool, not the change — exit 2");
  assert.match(`${r.stdout}${r.stderr}`, /Still rate-limited after every attempt/);
});

test("the classifier does not mistake prose for a rate limit", async () => {
  const { isRateLimited } = await import("./figma-connect-dry-run.mjs");
  assert.equal(isRateLimited("Failed to to fetch node info (429): 429 Rate limit exceeded"), true);
  assert.equal(isRateLimited("Too Many Requests"), true);
  assert.equal(isRateLimited("error: unreadable template"), false);
  assert.equal(isRateLimited("Cannot find module '@mosje/design-system'"), false);
  assert.equal(isRateLimited("All Code Connect files are valid"), false);
});
