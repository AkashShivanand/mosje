#!/usr/bin/env bash
# Print the branch / worktree inventory that the branch-continuity rule requires
# before the first edit of any session. TOOL-AGNOSTIC BY DESIGN.
#
#   npm run branches                 # any agent, any tool, any human
#   bash scripts/branch-inventory.sh --text
#   bash scripts/branch-inventory.sh          # JSON, for Claude Code's SessionStart hook
#
# It lives in scripts/ rather than .claude/ on purpose: the rule binds every tool,
# so the tooling that serves it must not be branded for one of them. Claude Code
# calls it automatically via .claude/settings.json; Codex, Antigravity, Cursor and
# humans run `npm run branches`. One script, one behaviour, no second copy to drift.
#
# It only REPORTS — it never switches, stashes, creates, or deletes anything.
# The decision belongs to whoever is working; the hazards this surfaces are exactly
# the ones an automatic switch would trigger.
#
# Contract: always exit 0 and never block. A missing inventory is a nuisance; a
# session or commit that cannot start is a defect.

set -uo pipefail

# --text prints markdown for a human or a non-Claude agent; default emits the JSON
# envelope Claude Code's SessionStart hook consumes.
FORMAT=json
case "${1:-}" in
  --text|-t) FORMAT=text ;;
  --json)    FORMAT=json ;;
esac

root="${CLAUDE_PROJECT_DIR:-$(pwd)}"
cd "$root" 2>/dev/null || exit 0
git rev-parse --git-dir >/dev/null 2>&1 || exit 0

# Never let a slow or hung git/gh call delay session start.
run() {
  if command -v timeout >/dev/null 2>&1; then timeout 5 "$@" 2>/dev/null
  elif command -v gtimeout >/dev/null 2>&1; then gtimeout 5 "$@" 2>/dev/null
  else "$@" 2>/dev/null
  fi
}

current=$(run git branch --show-current)
[ -z "$current" ] && current="(detached HEAD)"
dirty=$(run git status --porcelain | wc -l | tr -d ' ')

out="## Branch inventory

Per \`AGENTS.md\` and \`.claude/rules/branch-continuity.md\`: before the first edit, work out whether
this task already has a branch and continue there. State the branch and the
evidence in your first response. Never work on \`main\`.

**Here:** \`$current\` — $dirty uncommitted file(s)"

if [ "$dirty" -gt 0 ]; then
  out="$out
> Dirty tree. Changes follow a \`git switch\` onto the wrong branch, and they may
> belong to another session. Do not stash, commit, or switch them away — if you
> need a different branch, take a worktree instead."
fi

wt=$(run git worktree list | sed 's/^/  /')
if [ "$(printf '%s\n' "$wt" | wc -l | tr -d ' ')" -gt 1 ]; then
  out="$out

**Worktrees** — a branch checked out below CANNOT be checked out again; do not
force it and do not delete it (it may hold uncommitted work):
\`\`\`
$wt
\`\`\`"
fi

branches=$(run git for-each-ref --sort=-committerdate --count=15 \
  --format='  %(refname:short) — %(contents:subject)' refs/heads/)
[ -n "$branches" ] && out="$out

**Local branches**, most recent first:
\`\`\`
$branches
\`\`\`"

if command -v gh >/dev/null 2>&1; then
  prs=$(run gh pr list --state all --limit 20 \
    --json number,state,headRefName \
    --jq '.[] | "  #\(.number) \(.state) \(.headRefName)"')
  [ -n "$prs" ] && out="$out

**PR state** — a branch whose PR is MERGED or CLOSED is branched FROM, never
continued:
\`\`\`
$prs
\`\`\`"
fi

# Is main's CI green? A gate that is red and unwatched is not a gate — it is
# noise everyone has learned to ignore. Found on 2026-08-22: Apps CI had failed on
# EVERY run for three days (20 consecutive) and nothing surfaced it, because
# .husky/pre-push only typechecks LOCAL pushes to main and PR merges happen
# server-side, while CI can report but not block (branch protection needs GitHub
# Pro on a private repo). So main can rot silently. This is the cheap fix: say so,
# every session, to every tool.
if command -v gh >/dev/null 2>&1; then
  ci=$(run gh run list --branch main --workflow "Apps CI" --limit 10 \
    --json conclusion --jq '[.[].conclusion]|@tsv')
  if [ -n "$ci" ]; then
    latest=$(printf '%s' "$ci" | cut -f1)
    streak=0
    for c in $ci; do
      [ "$c" = "failure" ] || break
      streak=$((streak + 1))
    done
    if [ "$latest" = "failure" ]; then
      # Only 10 runs are sampled, so a full streak is a floor, not a total.
      [ "$streak" -ge 10 ] && streak="10+"
      out="$out

**main CI is FAILING** — $streak consecutive run(s). Nothing blocks a red \`main\`
here (pre-push only guards LOCAL pushes; PR merges land server-side), so it stays
red until someone acts. Check before assuming a red PR is your fault:
\`\`\`
gh run list --branch main --workflow \"Apps CI\" --limit 5
\`\`\`"
    fi
  fi
fi

# Cost-heavy plugins that are meant to be OFF by default and switched on only
# for a task (see ~/.claude/bin/claude-with). If `claude-with` is killed hard,
# its cleanup never runs and the plugin silently stays on, costing tokens in
# every later session. Report it; never toggle anything from a hook.
if command -v claude >/dev/null 2>&1; then
  left_on=$(timeout 5 claude plugin list 2>/dev/null | awk '
    /^  ❯ (vercel|blog-suite|seo-suite|omni-suite|cli-suite)@/ { id=$2; inblock=1; next }
    inblock && /^  ❯ / { inblock=0 }
    inblock && /Status:/ { if (!/disabled/) print "  " id; inblock=0 }')
  [ -n "$left_on" ] && out="$out

**Left switched on** — these are meant to be off by default; a \`claude-with\`
session probably exited abnormally. Switch off with \`claude plugin disable <id>\`:
\`\`\`
$left_on
\`\`\`"
fi

if [ "$FORMAT" = "text" ]; then
  printf '%s\n' "$out"
  exit 0
fi

# JSON-encode. python3, else jq, else plain stdout — the inventory still reaches
# the session in every case.
if command -v python3 >/dev/null 2>&1; then
  CTX="$out" python3 -c 'import json,os;print(json.dumps({"hookSpecificOutput":{"hookEventName":"SessionStart","additionalContext":os.environ["CTX"]}}))'
elif command -v jq >/dev/null 2>&1; then
  printf '%s' "$out" | jq -Rs '{hookSpecificOutput:{hookEventName:"SessionStart",additionalContext:.}}'
else
  printf '%s\n' "$out"
fi
exit 0
