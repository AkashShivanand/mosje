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
 * WHAT THIS DOES NOT DO. It does not weaken the audit. `|| true` would have "fixed" the
 * outage and also swallowed every real advisory forever, which is worse than no gate at
 * all — a security gate that cannot fail is a false assurance. So:
 *
 *   • A REPORT that comes back is always obeyed. High or critical → exit 1, listed.
 *   • Only a registry failure is forgiven, and it is forgiven loudly, as a warning that
 *     names the audit as SKIPPED rather than passed.
 *
 * The residual risk is real and bounded: during an npm outage a PR can merge without a
 * production audit. The next run on `main` audits the same tree, so an advisory is
 * caught within a commit or two rather than never.
 *
 * It also fails FAST. npm's default retry ladder spends seven minutes before admitting
 * defeat; this asks for two retries and takes its own three attempts with a short
 * backoff, so a genuine outage is established in well under a minute.
 */
import { spawnSync } from "node:child_process";

const LEVEL = "high";
const ATTEMPTS = 3;
const BACKOFF_MS = 4000;

/** npm's code for "the audit endpoint did not answer" — the case we forgive. */
const OUTAGE = /ENOAUDIT|audit endpoint returned an error|503 Service Unavailable|ECONNRESET|ETIMEDOUT|EAI_AGAIN|socket hang up/i;

const sleep = (ms) => Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, ms);

function runAudit() {
  const res = spawnSync(
    "npm",
    ["audit", "--omit=dev", "--json", "--fetch-retries=2", "--fetch-retry-maxtimeout=20000"],
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
  console.log(`::warning::Production audit SKIPPED — the npm registry audit endpoint is unavailable (${detail}). This is NOT a pass: no advisories were checked. The next run on main audits the same tree.`);
  console.log(`  · audit endpoint unavailable after ${ATTEMPTS} attempts — skipped, not passed.`);
  process.exit(0);
}

// Anything else — a broken invocation, an unparseable payload — is a real failure. A
// security gate that cannot explain itself must not report success.
console.error(`\n✖ production audit could not run, and the cause is not a known registry outage.\n`);
console.error(last.raw.split("\n").slice(-25).join("\n"));
process.exit(2);
