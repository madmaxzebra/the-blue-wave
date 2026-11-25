"""One-off FTP upload of dist/ to holidayseason/. Do not commit."""
from __future__ import annotations

import os
import sys
from ftplib import FTP
from pathlib import Path

HOST = "thebluewavefans.com"
PORT = 21
USER = "BlueHoliday@thebluewavefans.com"
REMOTE_ROOT = "website_cba6a5f5/holidayseason"

DIST = Path(__file__).resolve().parent.parent / "the-blue-holiday-wave" / "dist"


def ensure_remote_dir(ftp: FTP, remote_dir: str) -> None:
    parts = [p for p in remote_dir.replace("\\", "/").split("/") if p]
    for part in parts:
        try:
            ftp.cwd(part)
        except Exception:
            try:
                ftp.mkd(part)
            except Exception:
                pass
            ftp.cwd(part)


def upload_tree(ftp: FTP, local: Path, remote_prefix: str) -> int:
    count = 0
    for entry in sorted(local.iterdir()):
        rel = f"{remote_prefix}/{entry.name}".replace("\\", "/")
        if entry.is_dir():
            try:
                ftp.mkd(entry.name)
            except Exception:
                pass
            ftp.cwd(entry.name)
            count += upload_tree(ftp, entry, rel)
            ftp.cwd("..")
        else:
            with open(entry, "rb") as f:
                ftp.storbinary(f"STOR {entry.name}", f)
            count += 1
            print(f"STOR {rel}")
    return count


def main() -> int:
    password = os.environ.get("FTP_PASS")
    if not password:
        print("FTP_PASS not set", file=sys.stderr)
        return 1
    if not DIST.is_dir():
        print(f"Missing dist: {DIST}", file=sys.stderr)
        return 1

    ftp = FTP()
    ftp.connect(HOST, PORT, timeout=120)
    ftp.login(USER, password)
    ftp.set_pasv(True)

    ensure_remote_dir(ftp, REMOTE_ROOT)
    # Now cwd is at holidayseason/
    uploaded = upload_tree(ftp, DIST, REMOTE_ROOT)

    ftp.quit()
    print(f"UPLOADED_FILES={uploaded}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
