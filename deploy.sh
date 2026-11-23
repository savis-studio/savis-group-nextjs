#!/usr/bin/env bash
# Deploys one image tag on the VPS: back up, pull, migrate, restart.
# Usage:   ./deploy.sh <git-sha>      (the 7-character tag GitHub Actions pushed to GHCR)
# Rollback: ./deploy.sh "$(cat .deploy-previous)"   (code only; see DEPLOY.md if a migration must be undone)
set -euo pipefail
cd "$(dirname "$0")"

TAG="${1:?usage: ./deploy.sh <git-sha>}"
[[ "$TAG" =~ ^[A-Za-z0-9._-]+$ ]] || { echo "Invalid tag: $TAG" >&2; exit 1; }
[[ -f .env ]] || { echo ".env is missing. Copy .env.example and fill it in." >&2; exit 1; }

CURRENT="$(cat .deploy-current 2>/dev/null || true)"
STAMP="$(date +%Y%m%d-%H%M%S)"
mkdir -p backups

set_tag() {
  if grep -q '^SAVIS_IMAGE_TAG=' .env; then
    sed -i "s|^SAVIS_IMAGE_TAG=.*|SAVIS_IMAGE_TAG=$1|" .env
  else
    printf '\nSAVIS_IMAGE_TAG=%s\n' "$1" >> .env
  fi
}

wait_healthy() { # service, seconds
  local service="$1" limit="$2" waited=0 state
  while (( waited < limit )); do
    state="$(docker inspect --format '{{if .State.Health}}{{.State.Health.Status}}{{else}}{{.State.Status}}{{end}}' "$(docker compose ps -q "$service")" 2>/dev/null || true)"
    [[ "$state" == "healthy" || "$state" == "running" ]] && return 0
    sleep 3; waited=$((waited + 3))
  done
  echo "$service did not become healthy within ${limit}s" >&2
  return 1
}

# 1. Back up the database before anything changes (skipped on the very first deploy).
if [[ -n "$(docker compose ps -q postgres 2>/dev/null)" ]]; then
  echo "Backing up the database..."
  docker compose exec -T postgres pg_dump -U savis -Fc savis > "backups/pre-${TAG}-${STAMP}.dump"
fi

# 2. Pull the new images.
set_tag "$TAG"
docker compose pull app tools cloudflared postgres

# 3. Database up, then migrate.
docker compose up -d postgres
wait_healthy postgres 90
echo "Running migrations..."
docker compose run --rm tools npx payload migrate

# 4. Start the new version.
docker compose up -d app cloudflared
if ! wait_healthy app 120; then
  echo "The new version is not healthy. Roll back with: ./deploy.sh ${CURRENT:-<previous-tag>}" >&2
  exit 1
fi

# 5. Record what runs now and what to roll back to.
[[ -n "$CURRENT" && "$CURRENT" != "$TAG" ]] && echo "$CURRENT" > .deploy-previous
echo "$TAG" > .deploy-current

# 6. Housekeeping: keep the last 14 backups, drop dangling images.
ls -1t backups/*.dump 2>/dev/null | tail -n +15 | xargs -r rm --
docker image prune -f >/dev/null

echo "Deployed ${TAG}."
