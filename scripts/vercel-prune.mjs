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
 *   - the newest preview for each branch that still exists on origin
 *
 * A preview whose branch has been merged and deleted is kept by nothing, which
 * is the point: its URL leads to a branch that no longer exists.
 *
 * Auth comes from the Vercel CLI, so no token is read, written or stored here.
 *
 *   node scripts/vercel-prune.mjs            # delete
 *   node scripts/vercel-prune.mjs --dry-run  # list what would go
 *   node scripts/vercel-prune.mjs --keep-production 20
 */
import { execFileSync } from "node:child_process";

const PROJECTS = ["mosje-samavesh", "sewa-management", "srv-memorial-trust"];
const DRY_RUN = process.argv.includes("--dry-run");
const keepFlag = process.argv.indexOf("--keep-production");
const KEEP_PRODUCTION =
  keepFlag === -1 ? 5 : Number(process.argv[keepFlag + 1]) || 5;
const BATCH = 20;

function api(path) {
  const out = execFileSync("vercel", ["api", path], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024,
  });
  return JSON.parse(out);
}

/** Branches that still exist on the remote. A preview for anything else is dead. */
function liveBranches() {
  const out = execFileSync("git", ["ls-remote", "--heads", "origin"], {
    encoding: "utf8",
    maxBuffer: 16 * 1024 * 1024,
  });
  return new Set(
    out
      .split("\n")
      .filter((l) => l.includes("refs/heads/"))
      .map((l) => l.split("refs/heads/")[1]),
  );
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

function prune(projectName, teamId, branches) {
  let project;
  try {
    project = api(`/v9/projects/${projectName}?teamId=${teamId}`);
  } catch {
    console.log(`  ${projectName}: not found, skipping`);
    return;
  }

  const liveProduction = project?.targets?.production?.id ?? null;
  const rows = allDeployments(teamId, project.id);
  const keep = new Set(liveProduction ? [liveProduction] : []);

  const production = rows.filter((d) => (d.target ?? "preview") === "production");
  for (const d of production.slice(0, KEEP_PRODUCTION)) keep.add(d.uid);

  const branchSeen = new Set();
  for (const d of rows) {
    if ((d.target ?? "preview") !== "preview") continue;
    const ref = d.meta?.githubCommitRef;
    if (!ref || branchSeen.has(ref) || !branches.has(ref)) continue;
    branchSeen.add(ref);
    keep.add(d.uid);
  }

  const doomed = rows.filter((d) => !keep.has(d.uid)).map((d) => d.uid);
  const priorProduction = Math.max(
    0,
    Math.min(KEEP_PRODUCTION, production.length) - (liveProduction ? 1 : 0),
  );
  console.log(
    `  ${projectName}: ${rows.length} retained · keeping ${keep.size} ` +
      `(${liveProduction ? "live production + " : ""}${priorProduction} prior + ` +
      `${branchSeen.size} branch previews) · deleting ${doomed.length}`,
  );
  if (DRY_RUN || doomed.length === 0) return;

  for (let i = 0; i < doomed.length; i += BATCH) {
    const batch = doomed.slice(i, i + BATCH);
    try {
      execFileSync("vercel", ["remove", ...batch, "--yes"], { stdio: "ignore" });
    } catch {
      console.log(`    a batch failed at ${i}; continuing`);
    }
  }
  console.log(`    removed ${doomed.length}`);
}

const teamId = JSON.parse(
  execFileSync("cat", [".vercel/project.json"], { encoding: "utf8" }),
).orgId;
const branches = liveBranches();
console.log(
  `${DRY_RUN ? "Dry run — " : ""}pruning ${PROJECTS.length} project(s); ` +
    `${branches.size} branch(es) still on origin`,
);
for (const name of PROJECTS) prune(name, teamId, branches);
console.log(
  "\nDeleting a deployment frees its storage immediately; the dashboard figure can lag a few minutes.",
);
