#!/usr/bin/env bash
# Vercel "Ignored Build Step" — decides whether a push is worth a deployment.
#
# Exit 0 = SKIP the build. Exit 1 = BUILD. (Vercel's convention, inverted from
# the usual shell one, which is why every branch below says which it takes.)
#
# It exists because the free tier's Deployment Storage and Function Storage are
# shared across every RETAINED deployment, and retention is 30 days and not
# configurable below Pro. On 2026-09-08 this project held 1,174 retained
# deployments — up to 105 in a single day — and both limits hit 100% that night.
# Vercel's usage page put the month at 356.27 GB of Deployment Storage and
# 128.93 GB of Functions Storage, so a deployment costs roughly 300 MB and 110 MB
# of the two. Every push avoided here is that much not spent.
#
# Two rules, both about deployments that could never have been looked at:
#
#   1. A preview nobody asked for. Branch previews are OFF by default — say so
#      per push by putting [preview] in the commit message. 798 of the 1,174
#      deployments were previews, and the ones that were opened were opened
#      rarely; storing every one of them for 30 days is what filled the account.
#      Turning them off leaves ~376 deployments in a 30-day window, about a third
#      of the cap, and it costs nothing that matters: review and CI live on the
#      pull request in GitHub Actions, which has never had anything to do with
#      whether Vercel built a preview.
#   2. A commit that changes only files the deployment cannot see. .vercelignore
#      already keeps docs/, Assets/, tools/, specs/ and e2e/ out of the upload,
#      so a commit touching only those produces a byte-identical build. 340 of
#      920 commits in the fortnight to 2026-09-08 were exactly that.
#
# Production (main) is never subject to rule 1 — only to rule 2, and only when
# nothing that reaches the build has changed. An explicit [preview] beats rule 2
# as well: asking for a preview of a docs-only commit is odd, but it is a person
# saying what they want, and a heuristic should not argue with that.
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

# The opt-in. Vercel passes the commit message in; reading it from git is the
# fallback for a local run or a shallow clone that arrived without it.
#
# Only the SUBJECT line counts, and that is not a detail. The commit that
# introduced this rule described the token in its own body, matched itself, and
# built the preview it had just switched off. A body is prose — it discusses the
# token; a subject is the person saying what this push is for.
MESSAGE="${VERCEL_GIT_COMMIT_MESSAGE:-$(git log -1 --format=%B 2>/dev/null)}"
SUBJECT="$(printf '%s\n' "$MESSAGE" | head -1)"
case "$SUBJECT" in
  *"[preview]"*) WANTS_PREVIEW=1 ;;
  *)             WANTS_PREVIEW=0 ;;
esac

# Rule 1 — branch previews are off unless this push asked for one.
if [ "$ENVIRONMENT" != "production" ] && [ "$WANTS_PREVIEW" -eq 0 ]; then
  say "SKIP: previews are off by default. Put the opt-in token in the commit SUBJECT to get one for '$REF'."
  exit $SKIP
fi

# An explicit request wins outright, including over rule 2 below.
if [ "$ENVIRONMENT" != "production" ] && [ "$WANTS_PREVIEW" -eq 1 ]; then
  say "BUILD: '$REF' asked for a preview."
  exit $BUILD
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
