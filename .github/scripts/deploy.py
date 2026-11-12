"""Publish dist/ to the dedicated cPanel FTP account root over explicit FTPS."""

import os
from pathlib import Path
import re
import subprocess
import sys
from urllib.parse import quote
from uuid import uuid4


def deploy():
    missing = [key for key in ("FTP_HOST", "FTP_USERNAME", "FTP_PASSWORD") if not os.getenv(key)]
    if missing:
        print(f"::notice::Build tamamlandı. Eksik ayarlar nedeniyle yayın atlandı ({', '.join(missing)}).")
        return

    host = os.environ["FTP_HOST"]
    port = os.getenv("FTP_PORT") or "21"
    if not re.fullmatch(r"[A-Za-z0-9][A-Za-z0-9.-]*", host):
        sys.exit("FTP_HOST için yalnızca sunucu adını veya IPv4 adresini girin.")
    if not re.fullmatch(r"[0-9]{1,5}", port) or not 1 <= int(port) <= 65535:
        sys.exit("FTP_PORT 1 ile 65535 arasında olmalı.")

    dist = Path("dist")
    index = dist / "index.html"
    if not index.is_file() or not index.stat().st_size:
        sys.exit("dist/index.html bulunamadı veya boş.")
    entries = sorted(dist.rglob("*"))
    if dist.is_symlink() or any(p.is_symlink() for p in entries):
        sys.exit("dist/ içinde sembolik bağlantı var. Yayın durduruldu.")
    files = [p for p in entries if p.is_file() and p != index] + [index]
    if (dist / ".bio-link-target").exists() or any(
        re.search(r"[\x00-\x1f\x7f]", str(path)) for path in files
    ):
        sys.exit("dist/ içinde hedef işareti veya FTP için geçersiz bir dosya adı var.")

    # ftp:// plus --ssl-reqd upgrades the control connection before login and protects data.
    # curl expands credentials from the environment, keeping the password out of argv and logs.
    client = [
        "curl", "--disable", "--silent", "--show-error", "--noproxy", "*",
        "--ssl-reqd", "--tlsv1.2", "--ftp-pasv", "--globoff",
        "--connect-timeout", "15", "--max-time", "120",
        "--variable", "%FTP_USERNAME", "--variable", "%FTP_PASSWORD",
        "--expand-user", "{{FTP_USERNAME}}:{{FTP_PASSWORD}}",
    ]
    # The second slash selects the absolute root in the FTP account's namespace.
    root = f"ftp://{host}:{port}//"
    print("FTP kökü ve /.bio-link-target doğrulanıyor.", flush=True)
    marker = subprocess.check_output([*client, "--max-filesize", "128", root + ".bio-link-target"])
    if marker.splitlines() != [b"bio.mncilac.com"]:
        sys.exit("FTP kökündeki .bio-link-target dosyası bio.mncilac.com için doğrulanamadı.")
    listing = subprocess.check_output([*client, "--list-only", root])
    names = {name.rstrip(b"/").rsplit(b"/", 1)[-1] for name in listing.splitlines()}
    if names & {b"wp-config.php", b"wp-admin", b"wp-content", b"wp-includes", b"public_html"}:
        sys.exit("FTP kökünde WordPress veya ana hosting dizini bulundu. Yayın durduruldu.")

    for path in files:
        target = path.relative_to(dist)
        staging = target.with_name(f".bio-link-{uuid4().hex}.part")
        # RNFR/RNTO run only after a successful upload ('-' prefix). Publish index.html last.
        subprocess.run([
            *client, "--ftp-create-dirs", "--upload-file", str(path),
            "--quote", f"-RNFR /{staging.as_posix()}", "--quote", f"-RNTO /{target.as_posix()}",
            root + quote(staging.as_posix()),
        ], check=True)
    print(f"FTPS yayını tamamlandı. {len(files)} dosya hesap köküne yüklendi.")


if __name__ == "__main__":
    try:
        deploy()
    except subprocess.CalledProcessError as error:
        sys.exit(f"FTPS işlemi başarısız (curl {error.returncode}). Yayın durduruldu.")
