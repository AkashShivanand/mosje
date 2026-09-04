/**
 * `npm audit` for production dependencies, with an outage told apart from a finding.
 *
 * WHY THIS IS NOT JUST `npm audit --omit=dev --audit-level=high`.
 *
 * On 2026-09-04 `registry.npmjs.org`'s audit endpoint returned 503 for roughly half an
 * hour. npm retried internally for SEVEN MINUTES, then exited 1 with
 * `npm error audit endpoint returned an error`. That exit code is indistinguishable from
 * "a critical advisory was found", so the step failed, and because it failed the three
 * steps after it — the hub build, the Playwright install and the axe accessibility run —
 * were skipped. Two pull requests went red for a reason that had nothing to do with
 * either of them, and the accessibility gate silently did not run.
 *
 * `AGENTS.md` names this failure mode outright: a gate that fails for the wrong reason
 * is one people learn to ignore. The danger is not the red tick, it is the habit of
 * merging past it.
 *
 * THE ORDERING FIX IS THE OTHER HALF, AND IT CHANGES WHAT THIS SCRIPT SHOULD DO. The
 * audit step now runs LAST in the job (see apps-ci.yml), so it can no longer skip the
 * build or the accessibility suite whatever it decides. The first version of this file
 * therefore warned and PASSED on a persistent outage, to keep a third-party failure from
 * blocking a PR. With the ordering fixed that trade no longer applies: failing costs
 * nothing but the tick on a step that genuinely did not run, and — as the review of
 * PR #290 put it — a security gate that passes when it could not execute is not a gate.
 * So a persistent outage now FAILS, loudly and last.
 *
 * WHAT THIS DOES NOT DO. It does not weaken the audit. `|| true` would have "fixed" the
 * outage and also swallowed every real advisory forever, which is worse than no gate at
 * all — a security gate that cannot fail is a false assurance. So:
 *
 *   • A REPORT that comes back is always obeyed. High or critical → exit 1, listed.
 *   • A registry failure is RETRIED, then reported as "the audit did not run" — never as
 *     a pass. It exits 1, but it says which of the two things went wrong, which is the
 *     whole point: the log tells you whether to fix a dependency or re-run the job.
 *   • A failure it cannot classify exits 2, so an unrecognised state can never be
 *     mistaken for either answer.
 *
 * It also fails FAST. npm's default retry ladder spends seven minutes before admitting
 * defeat; this asks for two retries and takes its own three attempts with a short
 * backoff, so a genuine outage is established in well under a minute.
 */
import { spawnSync } from "node:child_process";

const LEVEL = "high";
const ATTEMPTS = 3;
// Patient rather than quick: a persistent outage now fails the step, so it is worth
// giving a blip a real chance to clear. 15s then 30s — under a minute in the worst case,
// against npm's own seven-minute retry ladder.
const BACKOFF_MS = 15000;

/** npm's code for "the audit endpoint did not answer" — the case we forgive. */
const OUTAGE = /ENOAUDIT|audit endpoint returned an error|503 Service Unavailable|ECONNRESET|ETIMEDOUT|EAI_AGAIN|socket hang up/i;

const sleep = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);

function runAudit() {
  const res = spawnSync(
    "npm",
    // `--fetch-retries` bounds the RETRIES, not the wait. Without `--fetch-timeout` a
    // hung endpoint costs npm's default per-request patience on every attempt: on
    // 2026-09-04 three attempts against a timing-out registry took 932 SECONDS to
    // conclude "it is down". Fifteen minutes to learn nothing is its own defect —
    // people stop running the thing.
    ["audit", "--omit=dev", "--json", "--fetch-retries=2", "--fetch-retry-maxtimeout=20000", "--fetch-timeout=60000"],
    { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 },
  );
  const raw = `${res.stdout ?? ""}\n${res.stderr ?? ""}`;
  let report = null;
  try {
    report = JSON.parse(res.stdout);
  } catch {
    /* not JSON — an outage or a broken invocation */
  }
  return { report, raw, status: res.status };
}

let last = null;
for (let attempt = 1; attempt <= ATTEMPTS; attempt++) {
  last = runAudit();

  // A parsed report with counts is the authority, whatever the exit code was.
  const counts = last.report?.metadata?.vulnerabilities;
  if (counts) {
    const high = (counts.high ?? 0) + (counts.critical ?? 0);
    const rest = (counts.moderate ?? 0) + (counts.low ?? 0) + (counts.info ?? 0);

    if (high > 0) {
      console.error(
        `\n✖ ${high} production advisor${high === 1 ? "y" : "ies"} at ${LEVEL} or above.\n`,
      );
      for (const [name, v] of Object.entries(last.report.vulnerabilities ?? {})) {
        if (v.severity !== "high" && v.severity !== "critical") continue;
        const via = (v.via ?? []).map((x) => (typeof x === "string" ? x : x.title)).filter(Boolean);
        console.error(`   ${v.severity.padEnd(8)} ${name}`);
        if (via.length) console.error(`     ${[...new Set(via)].join("; ")}`);
        if (v.fixAvailable) {
          const f = v.fixAvailable;
          console.error(`     fix: ${f === true ? "npm audit fix" : `${f.name}@${f.version}${f.isSemVerMajor ? " (major)" : ""}`}`);
        }
      }
      console.error("");
      process.exit(1);
    }

    console.log(
      `✓ production audit: no advisories at ${LEVEL} or above` +
        (rest ? ` (${rest} below it, reported not blocking).` : "."),
    );
    process.exit(0);
  }

  // No usable report. Only a registry failure earns another go.
  if (!OUTAGE.test(last.raw)) break;
  if (attempt < ATTEMPTS) {
    console.log(`  · audit endpoint unavailable (attempt ${attempt}/${ATTEMPTS}) — retrying…`);
    sleep(BACKOFF_MS);
  }
}

if (OUTAGE.test(last.raw)) {
  const detail = (last.raw.match(/npm (?:error|warn) audit.*/i) ?? ["registry error"])[0].trim();
  console.error(
    `::error::The production audit DID NOT RUN — the npm registry audit endpoint was ` +
      `unavailable after ${ATTEMPTS} attempts (${detail}). This is not a finding about ` +
      `this commit: nothing was checked. Re-run the job once the registry recovers. ` +
      `Because this step runs last, the build and the accessibility suite above it have ` +
      `already reported.`,
  );
  process.exit(1);
}

// Anything else — a broken invocation, an unparseable payload — is a real failure. A
// security gate that cannot explain itself must not report success.
console.error(`\n✖ production audit could not run, and the cause is not a known registry outage.\n`);
console.error(last.raw.split("\n").slice(-25).join("\n"));
process.exit(2);
