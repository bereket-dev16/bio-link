#!/usr/bin/env bash
set -euo pipefail

missing=()
for name in SSH_HOST SSH_USER DEPLOY_DIR SSH_PRIVATE_KEY SSH_KNOWN_HOSTS; do
  [[ -n "${!name:-}" ]] || missing+=("$name")
done
if (( ${#missing[@]} )); then
  echo "::notice::Build tamamlandı. Yayın ayarları eksik olduğu için dosya aktarımı atlandı (${missing[*]})."
  exit 0
fi

SSH_PORT=${SSH_PORT:-22}
if ! [[ $SSH_HOST =~ ^[a-zA-Z0-9][a-zA-Z0-9.-]*$ &&
        $SSH_USER =~ ^[a-zA-Z0-9_][a-zA-Z0-9_-]*$ &&
        $SSH_PORT =~ ^[1-9][0-9]{0,4}$ && $SSH_PORT -le 65535 &&
        $DEPLOY_DIR =~ ^(/[a-zA-Z0-9_][a-zA-Z0-9._-]*)+$ ]]; then
  echo "::error::SSH adresi, kullanıcı, port veya fiziksel hedef yolu geçersiz."
  exit 1
fi
[[ -s dist/index.html ]]

umask 077
credentials=$(mktemp -d)
trap 'rm -rf -- "$credentials"' EXIT
printf '%s\n' "$SSH_PRIVATE_KEY" | tr -d '\r' > "$credentials/key"
printf '%s\n' "$SSH_KNOWN_HOSTS" | tr -d '\r' > "$credentials/known_hosts"
unset SSH_PRIVATE_KEY SSH_KNOWN_HOSTS

cat > "$credentials/config" <<CONFIG
Host cpanel-bio
  HostName $SSH_HOST
  Port $SSH_PORT
  User $SSH_USER
  IdentityFile "$credentials/key"
  UserKnownHostsFile "$credentials/known_hosts"
  GlobalKnownHostsFile /dev/null
  StrictHostKeyChecking yes
  IdentitiesOnly yes
  BatchMode yes
  ConnectTimeout 15
CONFIG

export SSH_CONFIG_FILE="$credentials/config"
sync=(rsync --recursive --checksum --omit-dir-times --exclude='.*'
      --rsh="bash .github/scripts/cpanel-ssh.sh")

# Mevcut sayfayı, yeni sürümün kaynakları yüklenene kadar sunmaya devam et.
"${sync[@]}" --exclude='/index.html' dist/ cpanel-bio:./
"${sync[@]}" dist/index.html cpanel-bio:./
