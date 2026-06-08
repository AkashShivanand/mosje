#!/usr/bin/env bash
# Entry point for the PreToolUse(Bash) safety guard.
# Delegates to guard.mjs (robust JSON parsing). Exit 2 = block, exit 0 = allow.
exec node "$(cd "$(dirname "$0")" && pwd)/guard.mjs"
