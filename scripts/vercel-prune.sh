#!/usr/bin/env bash
# Delete every Vercel deployment that no longer holds an alias.
#
# The free tier caps Deployment Storage and Function Storage at 10 GB each,
# counted across every RETAINED deployment, and its retention is a fixed 30 days
# with no API to shorten it (both documented endpoints 404 on this plan, and
# PATCH /v9/projects rejects `deploymentExpiration`). So the tidying a Pro plan
# does on a schedule has to be done here instead.
#
# `--safe` skips anything with an active alias: the live production deployment
# and each branch's current preview URL survive; superseded builds do not.
#
# Run it weekly, or whenever Vercel emails about the limits.
set -euo pipefail

PROJECTS=("mosje-samavesh" "sewa-management" "srv-memorial-trust")

for project in "${PROJECTS[@]}"; do
  echo "==> pruning $project"
  vercel remove "$project" --safe --yes || echo "    (nothing to remove, or the project is gone)"
done

echo
echo "Done. Deleting a deployment frees its storage immediately; the usage figure"
echo "on the dashboard can lag by a few minutes."
