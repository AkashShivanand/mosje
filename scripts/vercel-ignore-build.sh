#!/usr/bin/env bash
# Vercel "Ignored Build Step" — decides whether a push is worth a deployment.
#
# Exit 0 = SKIP the build. Exit 1 = BUILD. (Vercel's convention, inverted from
# the usual shell one, which is why every branch below says which it takes.)
#
# It exists because the free tier's 10 GB Deployment Storage and 10 GB Function
# Storage are shared across every RETAINED deployment, and retention is 30 days
# and not configurable below Pro. On 2026-09-08 this project held 1,174 retained
# deployments — up to 105 in a single day — which is an 8.7 MB budget each for a
# Next.js app whose public/ alone is 140 MB. Both limits hit 100% the same night.
#
# Two rules, both about deployments that could never have been looked at:
#
#   1. A preview with no open pull request. 54 of the last 56 previews carried a
#      PR; the two that did not were pushes to a branch before its PR existed.
#      Those previews are built, stored for 30 days, and read by nobody.
#   2. A commit that changes only files the deployment cannot see. .vercelignore
#      already keeps docs/, Assets/, tools/, specs/ and e2e/ out of the upload,
#      so a commit touching only those produces a byte-identical build. 340 of
#      920 commits in the fortnight to 2026-09-08 were exactly that.
#
# Production (main) is never skipped for rule 1 — only for rule 2, and only when
# nothing that reaches the build has changed.
set -uo pipefail

# Vercel runs this from the project's Root Directory (apps/hub). Move to the
# repo root so `git diff` prints paths the patterns below can match, whichever
# directory the command is invoked from.
cd "$(git rev-parse --show-toplevel 2>/dev/null || echo .)" || true

say() { echo "[ignore-build] $*"; }

BUILD=1
SKIP=0

REF="${VERCEL_GIT_COMMIT_REF:-unknown}"
ENVIRONMENT="${VERCEL_ENV:-preview}"
PR="${VERCEL_GIT_PULL_REQUEST_ID:-}"

# Rule 1 — a preview branch with no pull request open against it.
if [ "$ENVIRONMENT" != "production" ] && [ -z "$PR" ]; then
  say "SKIP: '$REF' has no open pull request. Open one and the next push deploys."
  exit $SKIP
fi

# Rule 2 — did this push touch anything the deployment can actually see?
#
# Compare against the previous head where Vercel tells us what it was and the
# shallow clone still contains it; fall back to the parent commit. If neither
# resolves we BUILD, because a wrong skip is a stale site and a wrong build only
# costs storage.
BASE=""
if [ -n "${VERCEL_GIT_PREVIOUS_SHA:-}" ] && git cat-file -e "${VERCEL_GIT_PREVIOUS_SHA}^{commit}" 2>/dev/null; then
  BASE="$VERCEL_GIT_PREVIOUS_SHA"
elif git rev-parse --verify --quiet HEAD^ >/dev/null 2>&1; then
  BASE="HEAD^"
fi

if [ -z "$BASE" ]; then
  say "BUILD: no comparable previous commit in this clone."
  exit $BUILD
fi

CHANGED="$(git diff --name-only "$BASE" HEAD 2>/dev/null)"
if [ -z "$CHANGED" ]; then
  say "BUILD: could not read the changed files."
  exit $BUILD
fi

# Paths that cannot change the deployed output. Kept deliberately in step with
# .vercelignore — a path added there belongs here too, and vice versa.
IGNORED_RE='^(docs/|Assets/|Incoming/|Designs/|_backups/|specs/|e2e/|tools/|test-results/|playwright-report/|blob-report/|\.claude/|\.github/|\.husky/|\.vscode/|\.cursor/)|(^|/)[^/]+\.md$|^(AGENTS|CLAUDE|GEMINI|MOSJE-ARCHITECTURE|README)[^/]*$'

RELEVANT="$(echo "$CHANGED" | grep -Ev "$IGNORED_RE" || true)"

if [ -z "$RELEVANT" ]; then
  COUNT="$(echo "$CHANGED" | wc -l | tr -d ' ')"
  say "SKIP: all $COUNT changed file(s) are outside the deployment (docs, assets, agent config)."
  exit $SKIP
fi

say "BUILD: $(echo "$RELEVANT" | wc -l | tr -d ' ') changed file(s) reach the build."
exit $BUILD
