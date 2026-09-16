#!/usr/bin/env node
/**
 * The Code Connect dry run, with a rate limit told apart from a real failure.
 *
 * WHY. `figma connect publish --dry-run` reads every mapped component from the Figma API —
 * about seventy of them, in one burst — which makes it the heaviest Figma consumer this
 * repo has. On 2026-09-16 it failed a clean PR three times in a row with
 * `Failed to to fetch node info (429): 429 Rate limit exceeded`, while every other check
 * on that PR passed. Nothing was wrong with the change: the account's Figma allowance had
 * been spent by parallel work (`.claude/rules/figma-call-budget.md`).
 *
 * A gate that fails for a reason the author cannot act on is a gate people learn to
 * ignore, so this follows the convention the live Figma checks already use in
 * `.github/workflows/ds-quality.yml`: exit 1 is the gate's own bad news and must fail the
 * PR; **exit 2 is the tool or the network**, and the workflow warns instead.
 *
 * WHAT IT DOES NOT DO. It never swallows a validation failure. An unreadable template, a
 * template naming a property the master does not have, a broken import — all of that still
 * exits 1, because none of it is a rate limit. The classifier looks for the rate-limit
 * signature in the CLI's own output and nothing else.
 *
 * Exit codes: 0 valid · 1 Code Connect rejected something · 2 rate-limited after retries.
 */
import { spawnSync } from "node:child_process";
import { pathToFileURL } from "node:url";

/**
 * Attempts, and how long to wait before each retry.
 *
 * SHORT ON PURPOSE. The `quality` job has a 20-minute ceiling and already runs close to
 * it — five live Figma checks, one of which walks 75 pages. The first version waited 45s
 * then 90s, and on 2026-09-16 that pushed the job to 20m14s: GitHub cancelled it mid-retry,
 * which is a worse failure than the one being handled. 15s then 30s still clears Figma's
 * 60-second burst window across the three attempts, and costs at most 45s.
 */
const BACKOFF_MS = (process.env.FIGMA_CONNECT_DRY_RUN_BACKOFF_MS ?? "15000,30000")
  .split(",")
  .map((n) => Number(n.trim()))
  .filter((n) => Number.isFinite(n) && n >= 0);
/**
 * The exact shapes the Figma CLI and API produce for "you are over the limit". Kept
 * narrow on purpose: a broader match (`/limit/i`) would swallow a template that talks
 * about limits in a code snippet.
 */
const RATE_LIMITED = [/\b429\b/, /rate limit exceeded/i, /too many requests/i];

/** Overridable so the test can drive both paths without calling Figma. */
const command = process.env.FIGMA_CONNECT_DRY_RUN_CMD ?? "npm run figma:connect:check";

export function isRateLimited(output) {
  return RATE_LIMITED.some((re) => re.test(output));
}

function attempt() {
  const run = spawnSync(command, { shell: true, encoding: "utf8" });
  const output = `${run.stdout ?? ""}${run.stderr ?? ""}`;
  process.stdout.write(output);
  return { code: run.status ?? 1, output };
}

/* Run only when executed directly; importing it (the test does) just takes the classifier. */
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  let last = { code: 1, output: "" };
  for (let i = 0; i <= BACKOFF_MS.length; i++) {
    if (i > 0) {
      const wait = BACKOFF_MS[i - 1];
      console.log(`\nFigma rate-limited the dry run — waiting ${wait / 1000}s, then attempt ${i + 1} of ${BACKOFF_MS.length + 1}.`);
      /* A synchronous sleep: this is a CI step whose only job is to wait. */
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, wait);
    }
    last = attempt();
    if (last.code === 0) process.exit(0);
    if (!isRateLimited(last.output)) process.exit(last.code || 1);
  }
  console.log("\nStill rate-limited after every attempt. This is the Figma allowance, not the change under review.");
  process.exit(2);
}
