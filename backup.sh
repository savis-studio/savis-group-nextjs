#!/usr/bin/env bash
# Scheduled backup of the SAVIS stack on the VPS: database dump, uploaded media, and .env.
# Cron runs it daily (see DEPLOY.md). Output: ~/savis/backups/scheduled/<stamp>/.
# Off-site copy: set BACKUP_REMOTE in ~/savis/.backup.conf (an rclone path such as "gdrive_backup:savis-backups").
set -euo pipefail
cd "$(dirname "$0")"
exec 9>.backup.lock
flock -n 9 || { echo "A backup is already running." >&2; exit 1; }

KEEP_LOCAL="${KEEP_LOCAL:-7}"
KEEP_REMOTE="${KEEP_REMOTE:-14}"
BACKUP_REMOTE=""
[[ -f .backup.conf ]] && source .backup.conf

STAMP="$(date +%Y%m%d-%H%M%S)"
ROOT="$PWD/backups/scheduled"
OUT="$ROOT/$STAMP"
mkdir -p "$OUT"
umask 077
log() { echo "$(date '+%F %T') $*"; }

log "database dump"
docker compose exec -T postgres pg_dump -U savis -Fc savis > "$OUT/db.dump"
docker compose exec -T postgres pg_restore -l < "$OUT/db.dump" > /dev/null   # fails if the dump is unreadable

log "media volume"
VOL="$(docker volume ls -q | grep -E '(^|_)media$' | head -1)"
docker run --rm -v "$VOL":/data:ro -v "$OUT":/out postgres:16-alpine tar -C /data -czf /out/media.tar.gz .

log "env and compose files"
cp .env "$OUT/env"
cp docker-compose.yml "$OUT/docker-compose.yml"
(cd "$OUT" && sha256sum db.dump media.tar.gz env > SHA256SUMS)

if [[ -n "$BACKUP_REMOTE" ]]; then
  log "uploading to $BACKUP_REMOTE"
  # env holds secrets: it is encrypted before leaving the server (passphrase in ~/savis/.backup-pass, keep a copy elsewhere).
  if [[ -f .backup-pass ]]; then
    gpg --batch --yes --pinentry-mode loopback --passphrase-file .backup-pass -c -o "$OUT/env.gpg" "$OUT/env"
    UPLOAD_EXCLUDE=(--exclude env)
  else
    log "no .backup-pass: env is NOT uploaded"; UPLOAD_EXCLUDE=(--exclude env)
  fi
  rclone copy "$OUT" "$BACKUP_REMOTE/$STAMP" "${UPLOAD_EXCLUDE[@]}"
  # Keep the newest KEEP_REMOTE remote copies.
  rclone lsf --dirs-only "$BACKUP_REMOTE" | sed 's#/$##' | sort | head -n -"$KEEP_REMOTE" | while read -r old; do
    [[ -n "$old" ]] && rclone purge "$BACKUP_REMOTE/$old"
  done
fi

ls -1d "$ROOT"/*/ | sort | head -n -"$KEEP_LOCAL" | xargs -r rm -rf
log "done: $(du -sh "$OUT" | cut -f1) in $OUT"
