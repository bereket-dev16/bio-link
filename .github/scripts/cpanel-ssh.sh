#!/usr/bin/env bash
set -euo pipefail

# rsync'in ürettiği alıcı komutunu doğrulanan dizinde, aynı SSH oturumunda çalıştır.
host=$1
shift
printf -v receiver ' %q' "$@"
guard=$(cat .github/scripts/verify-target.sh)
exec ssh -F "$SSH_CONFIG_FILE" "$host" "DEPLOY_DIR='$DEPLOY_DIR'
$guard
exec$receiver"
