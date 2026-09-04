/**
 * Run the estate's CI locally, derived FROM the workflow files.
 *
 * WHY IT PARSES THE WORKFLOWS INSTEAD OF LISTING THE STEPS. A hand-written local mirror
 * of CI is wrong the first time somebody adds a gate, and nobody notices, because a local
 * runner that skips a gate still says "green". `npm run verify` was already that: it runs
 * lint, lint:css, check and the hub build — while the two workflows between them run
 * twenty-eight steps, including the token drift gate, three package test suites, four
 * Storybook gates, the a11y suite and the production audit. Nine tenths of the estate's
 * enforcement had no local equivalent at all.
 *
 * So this reads `.github/workflows/*.yml` and executes the same `run:` commands, in the
 * same order. Add a step to CI and it runs here on the next invocation, with no second
 * list to update.
 *
 * WHAT IT CANNOT REPLACE, AND WHY THAT MATTERS. Three gaps, none of them closeable by
 * running harder on this machine. They are printed at the end of every run rather than
 * buried here, because a runner that quietly implies full parity is the failure mode this
 * file exists to avoid:
 *
 *   1. A CLEAN INSTALL. CI runs `npm ci` from the lockfile into an empty tree; you have
 *      whatever npm has hoisted here over months. The repo has already been bitten:
 *      apps-ci.yml records a consolidation that "kept passing locally purely on stale
 *      hoisted node_modules — a state `npm ci` would never reproduce". `--clean` closes
 *      this by building a throwaway worktree and installing from the lockfile; it is slow
 *      and therefore opt-in.
 *   2. LINUX. CI is ubuntu-latest; this is macOS, whose filesystem is CASE-INSENSITIVE.
 *      An import of `../Components/Button` resolves here and fails there, and CLAUDE.md
 *      already names case-collisions as a hazard that has bitten this repo. The case audit
 *      runs on EVERY invocation and closes that one class; the rest of the platform gap —
 *      line endings, native builds, locale-dependent ordering — only a Linux run proves.
 *   3. NON-BYPASSABILITY. A hook is advisory: `git push --no-verify` skips it. Only a
 *      server-side required check is a gate. Now that the repository is public, branch
 *      protection is free — AGENTS.md notes it was unavailable before because it "needs
 *      GitHub Pro on a private repo", and that `main` once stayed red for three days
 *      across twenty runs unnoticed as a result.
 */
import { spawnSync, execFileSync } from "node:child_process";
import { readFileSync, readdirSync, existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const WORKFLOWS = join(ROOT, ".github/workflows");

const argv = process.argv.slice(2);
const flag = (n) => argv.includes(`--${n}`);
const value = (n) => (argv.find((a) => a.startsWith(`--${n}=`)) ?? "").split("=").slice(1).join("=");

const LIST = flag("list");
const FAST = flag("fast");
const KEEP_GOING = flag("keep-going");
const CLEAN = flag("clean");
/** Set by the parent when this process IS the run inside the clean checkout. */
const IN_CLEAN = process.env.MOSJE_LOCAL_CI_CLEAN === "1";
const ONLY = value("only");
const SKIP = value("skip");
const WHICH = value("workflow") || "all";

/**
 * Steps that cost minutes and prove things a feature-branch push rarely needs. `--fast`
 * drops them; a push to main does not.
 *
 * IT HAS TO COVER THE WHOLE CHAIN, NOT THE EXPENSIVE STEP. The first version listed the
 * hub build and the Playwright install but not `playwright test`, so `--fast` removed a
 * step's prerequisites and left the step. The clean run failed with
 * `.bin/next: No such file or directory` — a failure invented entirely by the skipping,
 * which is worse than a slow run: it teaches people that --fast reports false alarms, and
 * a runner nobody believes is not a runner.
 *
 * So a chain is slow or it is not. Anything that needs a built app or a browser belongs
 * here together.
 */
const SLOW = [
  /playwright install/i,
  /playwright test/i,      // needs the build AND the browser above
  /smoke-storybook/i,
  /apps\/hub run build/i,
  /check:build/i,
];

/** Steps a local machine must not run, with the reason shown rather than a silent skip. */
function localSkip(cmd) {
  if (/^\s*npm ci\b/m.test(cmd)) {
    return CLEAN
      ? "already done — the clean checkout was installed from the lockfile"
      : "npm ci wipes node_modules — use --clean, which does it in a throwaway worktree";
  }
  return null;
}

/**
 * GitHub expressions, evaluated only as far as is honest. Anything naming `github.` is
 * about the event that triggered CI and has no local meaning, so the step is reported as
 * CI-only rather than guessed at.
 */
function evaluateIf(expr, outcomes) {
  if (!expr) return { run: true };
  const body = String(expr).replace(/^\s*\$\{\{|\}\}\s*$/g, "").trim();
  if (/\bgithub\./.test(body)) return { run: false, why: "depends on the GitHub event" };
  let e = body.replace(/!\s*cancelled\(\)/g, "true").replace(/\balways\(\)/g, "true");
  e = e.replace(/steps\.([A-Za-z0-9_-]+)\.outcome\s*==\s*'success'/g, (_, id) =>
    outcomes.get(id) === "failure" ? "false" : "true");
  if (/^(true|false)(\s*&&\s*(true|false))*$/.test(e)) return { run: !/\bfalse\b/.test(e) };
  return { run: true, why: `unrecognised condition, running anyway: ${body}` };
}

// ── --clean: the only way to answer "does it work from the lockfile?" ───────
//
// It runs FIRST, before anything that needs a dependency. The whole premise is that
// nothing is installed yet, so the runner cannot parse a workflow to get started — it
// prepares the checkout, installs from the lockfile, and then RE-EXECS itself inside
// that tree, where its own dependencies exist. The first version imported `yaml` at the
// top and died with ERR_MODULE_NOT_FOUND before it could create anything.
let CWD = ROOT;
let cleanDir = null;
function startClean() {
  const dirty = execFileSync("git", ["status", "--porcelain"], { cwd: ROOT, encoding: "utf8" }).trim();
  if (dirty) {
    console.log(
      "⚠  --clean checks out HEAD into a fresh worktree, so it tests the COMMIT, not your\n" +
      "   working tree. You have uncommitted changes; they will not be included.\n",
    );
  }
  cleanDir = mkdtempSync(join(tmpdir(), "mosje-clean-"));
  console.log(`▶ preparing a clean checkout in ${cleanDir}`);
  execFileSync("git", ["worktree", "add", "--detach", cleanDir, "HEAD"], { cwd: ROOT, stdio: "inherit" });
  console.log("▶ npm ci (from the lockfile, into an empty tree — this is the slow part)");
  const r = spawnSync("npm", ["ci"], { cwd: cleanDir, stdio: "inherit" });
  if (r.status !== 0) {
    console.error("✖ npm ci failed in the clean checkout — that IS the finding.");
    stopClean();
    process.exit(1);
  }
  console.log("");
}
function stopClean() {
  if (!cleanDir) return;
  try { execFileSync("git", ["worktree", "remove", "--force", cleanDir], { cwd: ROOT }); } catch {}
  try { rmSync(cleanDir, { recursive: true, force: true }); } catch {}
  cleanDir = null;
}
if (CLEAN) {
  process.on("exit", stopClean);
  startClean();
  // Hand over to the copy inside the clean tree. Everything below this point needs
  // dependencies, and that tree is the only one guaranteed to have them.
  const pass = argv.filter((a) => a !== "--clean");
  console.log(`▶ handing over to the clean checkout${pass.length ? ` (${pass.join(" ")})` : ""}\n`);
  const child = spawnSync("node", ["tools/local-ci/run.mjs", ...pass], {
    cwd: cleanDir,
    stdio: "inherit",
    // Without this the child prints "these gates ran against the node_modules already
    // here", which is exactly what it did NOT do — and the parent then contradicts it two
    // lines later. A runner whose whole premise is honest reporting cannot print a false
    // caveat and correct it afterwards.
    env: { ...process.env, MOSJE_LOCAL_CI_CLEAN: "1" },
  });
  console.log(
    "\n─".repeat(1) + "─".repeat(71) +
    "\nThat run used a CLEAN checkout of HEAD, installed from package-lock.json." +
    "\nIt therefore DID prove the lockfile resolves and the tree builds from it —" +
    "\nthe one thing a run against your own node_modules cannot.",
  );
  stopClean();
  process.exit(child.status ?? 1);
}

const parse = await import("yaml").then((m) => m.parse).catch(() => {
  console.error(
    "✖ local-ci: cannot load `yaml`, which it reads the workflow files with.\n" +
    "  Run `npm install` first — every step below needs node_modules anyway.\n" +
    "  (`--clean` does not need this: it installs from the lockfile before it starts.)",
  );
  process.exit(2);
});

function collect() {
  const files = readdirSync(WORKFLOWS).filter((f) => /\.ya?ml$/.test(f)).sort();
  const out = [];
  for (const file of files) {
    const key = file.replace(/\.ya?ml$/, "");
    if (WHICH !== "all" && !key.includes(WHICH)) continue;
    const doc = parse(readFileSync(join(WORKFLOWS, file), "utf8"));
    for (const [jobId, job] of Object.entries(doc.jobs ?? {})) {
      const jobIf = evaluateIf(job.if, new Map());
      for (const step of job.steps ?? []) {
        if (!step.run) continue; // `uses:` steps are runner setup — checkout, setup-node
        out.push({
          workflow: doc.name ?? key,
          file,
          job: jobId,
          jobSkip: jobIf.run ? null : jobIf.why,
          id: step.id,
          name: step.name ?? step.run.split("\n")[0].trim().slice(0, 60),
          run: step.run,
          if: step.if,
          env: step.env ?? {},
          slow: SLOW.some((r) => r.test(step.run)),
        });
      }
    }
  }
  return out;
}

/**
 * Steps that are NOT in the workflows, and should not be: on ubuntu the compiler already
 * enforces them. They run here precisely BECAUSE this is not ubuntu — a local CI that only
 * mirrors the remote one is blind exactly where the two platforms differ.
 */
const LOCAL_ONLY = [{
  workflow: "Local only (compensating for macOS)",
  file: "tools/local-ci",
  job: "local",
  jobSkip: null,
  name: "Case sensitivity — imports must match the real spelling on disk",
  run: "node tools/local-ci/case-audit.mjs",
  env: {},
  slow: false,
}];

let steps = [...LOCAL_ONLY, ...collect()];
if (ONLY) steps = steps.filter((s) => (s.name + s.run).toLowerCase().includes(ONLY.toLowerCase()));
if (SKIP) steps = steps.filter((s) => !(s.name + s.run).toLowerCase().includes(SKIP.toLowerCase()));

if (!steps.length) {
  console.error("✖ local-ci: no steps matched. Try --list.");
  process.exit(2);
}

const dur = (ms) => (ms < 1000 ? `${ms}ms` : `${(ms / 1000).toFixed(1)}s`);

if (LIST) {
  console.log(`local-ci: ${steps.length} step(s) derived from ${relative(ROOT, WORKFLOWS)}\n`);
  let wf = "";
  for (const s of steps) {
    if (s.workflow !== wf) { wf = s.workflow; console.log(`  ${wf}`); }
    const why = s.jobSkip ?? localSkip(s.run) ?? (FAST && s.slow ? "slow, skipped by --fast" : null);
    console.log(`    ${why ? "skip" : "run "}  ${s.name}${why ? `   — ${why}` : ""}${s.slow ? "  [slow]" : ""}`);
  }
  process.exit(0);
}

// ── Run ─────────────────────────────────────────────────────────────────────
console.log(`local-ci: ${steps.length} step(s), derived from the workflow files${FAST ? " · --fast" : ""}\n`);
const outcomes = new Map();
const results = [];
const started = Date.now();

for (const s of steps) {
  const skip =
    s.jobSkip ??
    localSkip(s.run) ??
    (FAST && s.slow ? "slow, skipped by --fast" : null) ??
    (evaluateIf(s.if, outcomes).run ? null : evaluateIf(s.if, outcomes).why ?? "condition false");

  if (skip) {
    results.push({ ...s, status: "skip", why: skip, ms: 0 });
    if (s.id) outcomes.set(s.id, "skipped");
    console.log(`— SKIP  ${s.name}\n        ${skip}\n`);
    continue;
  }

  console.log(`▶ ${s.name}`);
  const env = { ...process.env };
  for (const [k, v] of Object.entries(s.env)) {
    const m = /^\$\{\{\s*secrets\.([A-Za-z0-9_]+)\s*\}\}$/.exec(String(v));
    env[k] = m ? (process.env[m[1]] ?? "") : String(v);
  }
  const t0 = Date.now();
  const res = spawnSync("bash", ["-eo", "pipefail", "-c", s.run], { cwd: CWD, stdio: "inherit", env });
  const ms = Date.now() - t0;
  const ok = res.status === 0;
  if (s.id) outcomes.set(s.id, ok ? "success" : "failure");
  results.push({ ...s, status: ok ? "pass" : "fail", code: res.status, ms });
  console.log(`${ok ? "✔" : "✖"} ${s.name}  (${dur(ms)})\n`);
  if (!ok && !KEEP_GOING) break;
}

// ── Report ──────────────────────────────────────────────────────────────────
const pass = results.filter((r) => r.status === "pass");
const fail = results.filter((r) => r.status === "fail");
const skipped = results.filter((r) => r.status === "skip");
const notReached = steps.length - results.length;

console.log("─".repeat(72));
console.log(
  `local-ci: ${pass.length} passed · ${fail.length} failed · ${skipped.length} skipped` +
    `${notReached ? ` · ${notReached} not reached` : ""}  in ${dur(Date.now() - started)}`,
);

if (fail.length) {
  console.log("\nFailed:");
  for (const f of fail) console.log(`  ✖ ${f.name}  (exit ${f.code})`);
}

const slowest = [...pass].sort((a, b) => b.ms - a.ms).slice(0, 3);
if (slowest.length) console.log(`\nSlowest: ${slowest.map((s) => `${s.name} ${dur(s.ms)}`).join(" · ")}`);

console.log(
  `\nWhat this run did NOT prove:\n` +
    (IN_CLEAN
      ? "  1. — a clean install IS what this run used: a fresh checkout of HEAD installed\n     from package-lock.json.\n"
      : "  1. A clean install — these gates ran against the node_modules already here,\n     not a fresh `npm ci` from the lockfile. Use --clean.\n") +
    "  2. Linux. The case audit above covers the one class this platform hides, but not\n" +
    "     the rest: line endings, a native module that builds differently, a path length,\n" +
    "     a locale-dependent sort. Only a Linux run proves those.\n" +
    "  3. That it ran at all — a hook is advisory and `--no-verify` skips it. Only a\n" +
    "     required status check is a gate; branch protection is free on a public repo.",
);

process.exit(fail.length ? 1 : 0);
