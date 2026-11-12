#!/usr/bin/env bash
set -euo pipefail

# Deploy do visiteaquiraz.com.br com BUILD NO PC DO ALLAN
# A imagem é construída localmente a partir do commit, vai pro VPS via zstd/ssh
# e o Coolify apenas orquestra os containers pulando o rebuild.

DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT_DIR="$(dirname "$DIR")"
APP_UUID="fvow4mkzkecnv6ioe0vnqlt1"
VPS="root@188.245.70.109"

echo "==> [1/5] Enviando commits para origin main..."
git -C "$ROOT_DIR" push origin main
SHA="$(git -C "$ROOT_DIR" rev-parse HEAD)"
REMOTE_SHA="$(git -C "$ROOT_DIR" ls-remote origin refs/heads/main | cut -f1)"
if [ "$SHA" != "$REMOTE_SHA" ]; then
  echo "❌ HEAD local ($SHA) difere de origin/main ($REMOTE_SHA)."; exit 1
fi
IMAGE="$APP_UUID:$SHA"

echo "==> [2/5] Build local da imagem $IMAGE (a partir do commit)..."
git -C "$ROOT_DIR" archive --format=tar HEAD | docker build --network=host -t "$IMAGE" -

echo "==> [3/5] Enviando imagem para o VPS (rsync com zstd)..."
TMP_IMG="/tmp/visiteaquiraz-img.tar.zst"
docker save "$IMAGE" | zstd -T0 -3 > "$TMP_IMG"
rsync -P -e "ssh -o ServerAliveInterval=15 -o ServerAliveCountMax=3" "$TMP_IMG" "$VPS:$TMP_IMG"
ssh "$VPS" "zstd -dc '$TMP_IMG' | docker load && rm -f '$TMP_IMG'"
rm -f "$TMP_IMG"

echo "==> [4/5] Disparando deploy no Coolify SEM rebuild..."
DISPATCH_OUTPUT=$(ssh -o ConnectTimeout=10 "$VPS" "docker exec coolify php artisan tinker --execute='
\$app = App\Models\Application::where(\"uuid\", \"$APP_UUID\")->first();
\$dep = App\Models\ApplicationDeploymentQueue::create([
    \"application_id\" => \$app->id,
    \"deployment_uuid\" => (string) Illuminate\Support\Str::uuid(),
    \"pull_request_id\" => 0,
    \"force_rebuild\" => false,
    \"commit\" => \"$SHA\",
    \"status\" => \"queued\",
    \"is_webhook\" => false,
    \"is_api\" => true,
    \"server_id\" => \$app->destination->server->id,
    \"destination_id\" => \$app->destination->id,
    \"only_this_server\" => false,
    \"rollback\" => false,
    \"application_name\" => \$app->name,
    \"server_name\" => \$app->destination->server->name,
    \"deployment_url\" => \"\",
]);
App\Jobs\ApplicationDeploymentJob::dispatch(\$dep->id);
echo \"DEP_ID:\" . \$dep->id;
'")
DEP_ID=$(echo "$DISPATCH_OUTPUT" | grep -o 'DEP_ID:[0-9]*' | cut -d: -f2)
echo "    Deploy ID: $DEP_ID"

FINISHED=false
for i in {1..120}; do
  STATUS=$(timeout 25 ssh -o ConnectTimeout=10 "$VPS" "docker exec coolify php artisan tinker --execute='
  \$d = App\Models\ApplicationDeploymentQueue::find($DEP_ID);
  echo \"STATUS:\" . (\$d ? \$d->status : \"unknown\");
  '" 2>/dev/null | (grep -o 'STATUS:[a-z_-]*' || true) | cut -d: -f2 || true)
  STATUS="${STATUS:-waiting}"
  echo "    Progresso ($i/120): $STATUS"
  if [ "$STATUS" = "finished" ]; then FINISHED=true; break; fi
  if [ "$STATUS" = "failed" ] || [ "$STATUS" = "cancelled" ]; then echo "❌ Deploy falhou no Coolify!"; exit 1; fi
  sleep 4
done
[ "$FINISHED" = "true" ] || { echo "❌ Timeout aguardando o Coolify."; exit 1; }

echo "==> [5/5] Limpando imagens antigas..."
ssh "$VPS" "docker images '$APP_UUID' --format '{{.Repository}}:{{.Tag}}' | grep -v ':$SHA\\$' | xargs -r docker rmi > /dev/null 2>&1 || true"
echo "✅ Visite Aquiraz implantado com sucesso no VPS via Coolify!"
