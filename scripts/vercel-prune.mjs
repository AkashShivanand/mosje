#!/usr/bin/env node
/**
 * Delete superseded Vercel deployments.
 *
 * The free tier caps Deployment Storage and Function Storage at 10 GB each,
 * counted across every RETAINED deployment, and its retention is a fixed 30 days
 * with no way to shorten it: `PATCH /v9/projects` rejects `deploymentExpiration`
 * as an unknown property, and no retention endpoint exists in the public API
 * spec. So the tidying a Pro plan does on a schedule has to be run by hand here.
 *
 * `vercel remove --safe` is NOT that tidying, which is the trap this script
 * exists to avoid. Vercel assigns every deployment its own `-<hash>-` alias, so
 * `--safe` treats almost all of them as aliased: run against 1,174 deployments on
 * 2026-09-08 it removed 213 and then found nothing more to do, twice.
 *
 * So the keep-list is built explicitly, and everything else goes:
 *
 *   - the live production deployment (never touched)
 *   - the N production builds before it, so a rollback is still possible
 *   - the newest preview for each branch that still exists in the repository
 *     THAT project deploys from — per project, not per checkout
 *
 * A preview whose branch has been merged and deleted is kept by nothing, which
 * is the point: its URL leads to a branch that no longer exists.
 *
 * Auth comes from the Vercel CLI, so no token is read, written or stored here.
 *
 *   node scripts/vercel-prune.mjs            # delete
 *   node scripts/vercel-prune.mjs --dry-run  # list what would go
 *   node scripts/vercel-prune.mjs --keep-production 20
 *   node scripts/vercel-prune.mjs --allow-modified   # run an edited copy
 */
import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const PROJECTS = ["mosje-samavesh", "sewa-management", "srv-memorial-trust"];
const DRY_RUN = process.argv.includes("--dry-run");
const keepFlag = process.argv.indexOf("--keep-production");
const KEEP_PRODUCTION =
  keepFlag === -1 ? 5 : Number(process.argv[keepFlag + 1]) || 5;
const BATCH = 10;
const ALLOW_MODIFIED = process.argv.includes("--allow-modified");

/**
 * Refuse to delete anything if this file is not the version on `origin/main`.
 *
 * This script deletes deployments permanently, and a stale copy of it deletes
 * the WRONG ones. That is not hypothetical: the version before 2026-09-08 read
 * branches from the current checkout and applied them to every project, which
 * would have removed 17 previews for branches still open in another repository.
 * The fix is on main — and a session sitting on a feature branch that predates
 * it still has the broken copy on disk, one `npm run vercel:prune` away.
 *
 * Compared by CONTENT, not by branch, so running main's copy from anywhere (a
 * temporary directory, another worktree) passes, and only a genuinely different
 * script is stopped.
 *
 * When the comparison itself cannot be made — no git, no origin/main, no network
 * — it warns and continues. An unverifiable check is not evidence of a stale
 * script, and blocking there would strand the tool exactly when it is needed.
 *
 * WHAT IT CANNOT DO, and this is inherent rather than an oversight: a checkout
 * whose copy of this file PREDATES the guard has no guard in it, so it runs
 * unchecked. Nothing written here can reach backwards into a copy that never
 * contained it. The protection therefore starts now and covers drift from this
 * version onward; the pre-guard copies on branches open on 2026-09-08 stop
 * existing as those branches merge or take main. Until then the only defence for
 * those is the one that caught it the first time — run a dry run and read it.
 */
function refuseIfStale() {
  if (ALLOW_MODIFIED) {
    console.log("⚠️  --allow-modified: running this copy without checking it against main.\n");
    return;
  }

  const PATH_ON_MAIN = "scripts/vercel-prune.mjs";
  let mine;
  try {
    mine = readFileSync(fileURLToPath(import.meta.url), "utf8");
  } catch {
    return; // cannot read ourselves; nothing to compare
  }

  // Refresh the ref cheaply. Failure here is fine — the local origin/main is
  // still a far better comparison than none.
  try {
    execFileSync("git", ["fetch", "--quiet", "origin", "main"], {
      stdio: "ignore",
      timeout: 20_000,
    });
  } catch {
    /* offline, or no such remote */
  }

  let onMain;
  try {
    onMain = execFileSync("git", ["show", `origin/main:${PATH_ON_MAIN}`], {
      encoding: "utf8",
      maxBuffer: 8 * 1024 * 1024,
    });
  } catch {
    console.log(
      "⚠️  Could not read origin/main's copy of this script, so it has not been " +
        "checked for staleness. Continuing.\n",
    );
    return;
  }

  if (mine.trim() === onMain.trim()) return;

  console.error(
    [
      "",
      "🛑 This copy of vercel-prune differs from the one on origin/main.",
      "",
      "   Nothing has been deleted. A stale copy of this script deletes the wrong",
      "   deployments — the version before 2026-09-08 would have removed previews",
      "   for branches that were still open.",
      "",
      "   If your checkout is simply behind:",
      "       git fetch origin && git merge origin/main",
      "",
      "   To run main's copy without changing your checkout:",
      `       git show origin/main:${PATH_ON_MAIN} > /tmp/prune.mjs && node /tmp/prune.mjs`,
      "",
      "   If you are deliberately editing this script, say so:",
      "       node scripts/vercel-prune.mjs --allow-modified --dry-run",
      "",
    ].join("\n"),
  );
  process.exit(1);
}

function api(path) {
  const out = execFileSync("vercel", ["api", path], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  return JSON.parse(out);
}

/**
 * Branches that still exist in the repository THIS project deploys from. A
 * preview for anything else is dead.
 *
 * Per project, not per checkout, and that distinction is the whole point. The
 * first version read `git ls-remote origin` once and applied it to all three
 * projects — but only one of them deploys from this repo. Run from here,
 * `sewa-management`'s branches all looked deleted, and a dry run showed it would
 * have removed 38 of its 43 deployments, 17 of them previews for branches that
 * are still open in `shivyog-sewa-management`. Caught before it ran; the tool
 * should not have been able to do it at all.
 *
 * Returns null when the branch list cannot be established, and the caller then
 * keeps every preview for that project. Deleting on a failed lookup is exactly
 * the failure this guards against.
 */
function liveBranches(project) {
  const link = project?.link ?? {};
  const repo = link.org && link.repo ? `${link.org}/${link.repo}` : null;
  if (!repo) return null;

  const parse = (out) =>
    new Set(
      out
        .split("\n")
        .map((l) => (l.includes("refs/heads/") ? l.split("refs/heads/")[1] : l))
        .map((l) => l.trim())
        .filter(Boolean),
    );

  // gh first: it is already authenticated, which matters for a private repo.
  try {
    return parse(
      execFileSync(
        "gh",
        ["api", `repos/${repo}/branches`, "--paginate", "--jq", ".[].name"],
        { encoding: "utf8", maxBuffer: 16 * 1024 * 1024 },
      ),
    );
  } catch {
    /* fall through */
  }
  try {
    return parse(
      execFileSync("git", ["ls-remote", "--heads", `https://github.com/${repo}`], {
        encoding: "utf8",
        maxBuffer: 16 * 1024 * 1024,
      }),
    );
  } catch {
    return null;
  }
}

function allDeployments(teamId, projectId) {
  const rows = [];
  let until = null;
  // Paged rather than fetched in one call: the API caps a page at 100, and this
  // has had to walk more than a thousand.
  for (let page = 0; page < 40; page += 1) {
    const q = `/v6/deployments?teamId=${teamId}&projectId=${projectId}&limit=100${
      until ? `&until=${until}` : ""
    }`;
    const { deployments = [] } = api(q);
    if (deployments.length === 0) break;
    rows.push(...deployments);
    until = deployments[deployments.length - 1].created - 1;
    if (deployments.length < 100) break;
  }
  return rows.sort((a, b) => b.created - a.created);
}

function prune(projectName, teamId) {
  let project;
  try {
    project = api(`/v9/projects/${projectName}?teamId=${teamId}`);
  } catch {
    console.log(`  ${projectName}: not found, skipping`);
    return;
  }

  const branches = liveBranches(project);
  const liveProduction = project?.targets?.production?.id ?? null;
  const rows = allDeployments(teamId, project.id);
  const keep = new Set(liveProduction ? [liveProduction] : []);

  const production = rows.filter((d) => (d.target ?? "preview") === "production");
  for (const d of production.slice(0, KEEP_PRODUCTION)) keep.add(d.uid);

  // With no branch list, every preview is kept: a preview is only dead if its
  // branch is known to be gone, and "we could not ask" is not that.
  const branchSeen = new Set();
  for (const d of rows) {
    if ((d.target ?? "preview") !== "preview") continue;
    const ref = d.meta?.githubCommitRef;
    if (!ref) continue;
    if (branches === null) {
      keep.add(d.uid);
      continue;
    }
    if (branchSeen.has(ref) || !branches.has(ref)) continue;
    branchSeen.add(ref);
    keep.add(d.uid);
  }

  // A deployment still building cannot be removed, and asking hangs the CLI
  // rather than erroring — one such id stalled a ten-deployment batch for three
  // and a half minutes before it was killed. Leave them; the next run takes them.
  const inFlight = new Set(
    rows
      .filter((d) => ["BUILDING", "QUEUED", "INITIALIZING"].includes(d.state))
      .map((d) => d.uid),
  );
  const doomed = rows
    .filter((d) => !keep.has(d.uid) && !inFlight.has(d.uid))
    .map((d) => d.uid);
  const priorProduction = Math.max(
    0,
    Math.min(KEEP_PRODUCTION, production.length) - (liveProduction ? 1 : 0),
  );
  const repo =
    project?.link?.org && project?.link?.repo
      ? `${project.link.org}/${project.link.repo}`
      : "no linked repo";
  console.log(
    `  ${projectName} (${repo}` +
      `${branches === null ? ", branches UNKNOWN — keeping every preview" : `, ${branches.size} live branches`})`,
  );
  console.log(
    `    ${rows.length} retained · keeping ${keep.size} ` +
      `(${liveProduction ? "live production + " : ""}${priorProduction} prior + ` +
      `${branchSeen.size} branch previews) · deleting ${doomed.length}`,
  );
  if (DRY_RUN || doomed.length === 0) return;

  let removed = 0;
  for (let i = 0; i < doomed.length; i += BATCH) {
    const batch = doomed.slice(i, i + BATCH);
    try {
      // Every call is capped: one unremovable id in a batch takes the batch's
      // whole call down with it, and without a timeout that is a stall, not an
      // error.
      execFileSync("vercel", ["remove", ...batch, "--yes"], {
        stdio: "ignore",
        timeout: 60_000,
      });
      removed += batch.length;
    } catch {
      // Retry one at a time so the rest of the batch still goes.
      for (const id of batch) {
        try {
          execFileSync("vercel", ["remove", id, "--yes"], {
            stdio: "ignore",
            timeout: 30_000,
          });
          removed += 1;
        } catch {
          console.log(`    could not remove ${id}`);
        }
      }
    }
  }
  console.log(`    removed ${removed} of ${doomed.length}`);
}

// Before anything else, and before --dry-run too: a stale dry run prints a plan
// that is wrong in exactly the way that matters, and a plan is what a person acts
// on.
refuseIfStale();

// The projects sit under a team, and `vercel api` does not inherit the CLI's
// scope, so every call has to name it. `.vercel/project.json` is written by
// `vercel link` and is gitignored, which is why its absence is explained rather
// than thrown.
let teamId;
try {
  teamId = JSON.parse(readFileSync(".vercel/project.json", "utf8")).orgId;
} catch {
  console.error(
    "No .vercel/project.json here. Run `vercel link` from the repo root first.",
  );
  process.exit(1);
}
console.log(
  `${DRY_RUN ? "Dry run — " : ""}pruning ${PROJECTS.length} project(s); ` +
    `each project's branches are read from the repo IT deploys from`,
);
for (const name of PROJECTS) prune(name, teamId);
console.log(
  "\nDeleting a deployment frees its storage immediately; the dashboard figure can lag a few minutes.",
);
