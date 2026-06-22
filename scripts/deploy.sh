#!/usr/bin/env bash
#
# Server-side deploy. Pulls the pre-built image from GHCR and restarts the stack.
# The server does NOT build — that already happened in GitHub Actions.
# Invoked by .github/workflows/deploy.yml over SSH; also safe to run by hand.
#
#   cd /var/www/html/Career-Coaching && ./scripts/deploy.sh
#
set -euo pipefail

cd "$(dirname "$0")/.."

echo "==> Pulling latest image from registry"
# `docker compose pull` exits 0 even when the pull is DENIED (it falls back to the
# build: section with a warning). Pull the image ref directly so a real registry
# failure aborts the deploy instead of silently running a stale image.
#
# NOTE: `docker compose config --images app` does NOT honor the service-name filter
# on Compose v5 — it lists every service image, so `head -1` used to grab
# postgres:16-alpine and we'd pull the DB instead of the app, leaving the running
# app image stale on a "green" deploy. Match the GHCR ref explicitly instead.
APP_IMAGE="$(docker compose config --images 2>/dev/null | grep '^ghcr.io/' | head -1)"
if [ -n "$APP_IMAGE" ]; then
  docker pull "$APP_IMAGE"
else
  docker compose pull app
fi

echo "==> Recreating containers (no build)"
# --no-build guarantees we use the pulled image even though compose has a build: section.
docker compose up -d --no-build --remove-orphans

echo "==> Waiting for app health"
for i in $(seq 1 30); do
  if curl -fsS -o /dev/null http://127.0.0.1:3000/; then
    echo "==> App is up"
    break
  fi
  if [ "$i" -eq 30 ]; then
    echo "!! App did not respond on :3000 within 30s — check 'docker compose logs app'" >&2
    exit 1
  fi
  sleep 1
done

echo "==> Pruning dangling images"
docker image prune -f >/dev/null

echo "==> Deploy complete: $(docker compose images app --format '{{.Repository}}:{{.Tag}}' 2>/dev/null | head -1)"
