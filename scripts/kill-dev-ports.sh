#!/usr/bin/env bash
# Kill any processes LISTENING on MoSJE dev server ports.
# Only targets server processes (TCP LISTEN state) — safe for browsers/clients connected to those ports.

set -euo pipefail

PORTS=(3000 3001 3002 4123 4124 4125 4126 6006)
KILLED=0

for port in "${PORTS[@]}"; do
  # -sTCP:LISTEN ensures we only get processes actually binding the port,
  # not client processes (browsers, Claude, etc.) that have connections TO it.
  pids=$(lsof -iTCP:"$port" -sTCP:LISTEN -t 2>/dev/null || true)
  if [ -n "$pids" ]; then
    echo "  → Freeing port $port (PID $pids)"
    echo "$pids" | xargs kill -SIGTERM 2>/dev/null || true
    sleep 0.4
    # Force-kill any survivors
    remaining=$(lsof -iTCP:"$port" -sTCP:LISTEN -t 2>/dev/null || true)
    if [ -n "$remaining" ]; then
      echo "    Force-killing $remaining"
      echo "$remaining" | xargs kill -9 2>/dev/null || true
    fi
    KILLED=$((KILLED + 1))
  fi
done

if [ "$KILLED" -gt 0 ]; then
  echo "Freed $KILLED port(s). Starting dev servers..."
else
  echo "All dev ports are clear. Starting dev servers..."
fi
