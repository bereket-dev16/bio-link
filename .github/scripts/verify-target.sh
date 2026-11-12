#!/bin/sh
set -eu

reject() {
  echo "Yayın durduruldu. $1" >&2
  exit 1
}

account_root=$(cd -P "$HOME" && pwd -P)
cd -P "$DEPLOY_DIR" || reject "Hedef dizin bulunamadı."
target=$(pwd -P)
[ "$target" = "$DEPLOY_DIR" ] || reject "Sembolik veya dolaylı hedef yolu."
case "$target" in
  "$account_root"/*) ;;
  *) reject "Hedef, hesabın alt dizinlerinden biri olmalı." ;;
esac
for primary in "$account_root/public_html" "$account_root/www"; do
  if [ "$target" -ef "$primary" ]; then reject "Ana web kökü seçilmiş."; fi
done

for item in wp-config.php wp-admin wp-includes wp-content; do
  if [ -e "$item" ] || [ -L "$item" ]; then reject "Hedefte WordPress bulundu."; fi
done
marker=.bio-link-target
if [ -L "$marker" ] || [ ! -f "$marker" ] || [ "$(cat "$marker")" != 'bio.mncilac.com' ]; then
  reject "Bu dizin bio.mncilac.com için işaretlenmemiş."
fi
