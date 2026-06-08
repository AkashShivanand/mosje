---
name: "source-command-review"
description: "Review the current diff for correctness, security, and design-system consistency using the specialist agents."
---

# source-command-review

Use this skill when the user asks to run the migrated source command `review`.

## Command Template

Review the uncommitted (and last-commit) changes in **${1:-the current app}**.

1. Determine the target app dir from the argument (default: infer from the changed files). Run `git -C <app> diff` and `git -C <app> diff --staged` to see what changed. If nothing changed, say so and stop.
2. Dispatch the **code-reviewer** agent on the diff (correctness + security + conventions).
3. Dispatch the **design-system-guardian** agent on the same changed files (token/typography/primitive drift).
4. Merge both reports into one prioritized list: **CRITICAL → WARNING → SUGGESTION**, each as `file:line — problem — fix`.
5. End with a single verdict: **APPROVE** or **CHANGES REQUIRED**, and the top 3 things to fix first.

Do not modify files — this is review only.
