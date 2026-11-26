#!/usr/bin/env python3
"""Download verified partner logos and photos into public/{fashion,taste,homes}-media."""
from __future__ import annotations

import ssl
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "the-blue-holiday-wave" / "public"
ORIG = Path(__file__).resolve().parent / "logo-originals"
UA = {"User-Agent": "Mozilla/5.0 (compatible; BlueHolidayWave/1.0)"}
CTX = ssl.create_default_context()


def get(url: str, dest: Path, min_sz: int = 400) -> None:
    dest.parent.mkdir(parents=True, exist_ok=True)
    req = urllib.request.Request(url, headers=UA)
    with urllib.request.urlopen(req, timeout=60, context=CTX) as r:
        data = r.read()
    if len(data) < min_sz:
        raise SystemExit(f"Too small {dest}: {len(data)} from {url}")
    dest.write_bytes(data)
    print(dest.relative_to(ROOT), len(data))


DOWNLOADS: list[tuple[str, Path]] = [
    # —— taste logos (originals) ——
    (
        "https://karaktercuracao.com/wp-content/themes/karakter/images/logo.png",
        ORIG / "karakter.png",
    ),
    (
        "https://diole.odoo.com/web/image/1707-496fe7b1/Gouverneur.webp",
        ORIG / "gouverneur-de-rouville.webp",
    ),
    (
        "https://upload.wikimedia.org/wikipedia/en/4/4a/Century_21_logo.svg",
        ORIG / "century21.svg",
    ),
    (
        "https://upload.wikimedia.org/wikipedia/commons/8/8d/Sotheby%27s_Logo.svg",
        ORIG / "sothebys-curacao.svg",
    ),
    (
        "https://static.wixstatic.com/media/15a47a_7e170fd37c3b471d8f81be278d3be6c0~mv2.png/v1/fill/w_1080,h_1080,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/HER%20%26%20HIM.png",
        ORIG / "her-and-him.png",
    ),
    (
        "https://static.wixstatic.com/media/15a47a_4f8d064521b8493995928e0ba84435cb~mv2.png/v1/fill/w_1254,h_1254,al_c,q_85,usm_0.66_1.00_0.01,enc_avif,quality_auto/KORSWILL.png",
        ORIG / "korswill.png",
    ),
    (
        "https://upload.wikimedia.org/wikipedia/commons/2/20/LC_Waikiki_logo.svg",
        ORIG / "lc-waikiki.svg",
    ),
    # —— taste photos ——
    (
        "https://diole.odoo.com/web/image/1552-cf27f678/home1.webp",
        PUBLIC / "taste-media/gouverneur-de-rouville-terrace.webp",
    ),
    (
        "https://diole.odoo.com/web/image/1556-db85aa4d/Home3.webp",
        PUBLIC / "taste-media/gouverneur-de-rouville-dining.webp",
    ),
    (
        "https://diole.odoo.com/web/image/1693-cff0a830/home2.webp",
        PUBLIC / "taste-media/gouverneur-de-rouville-bar.webp",
    ),
    (
        "https://karaktercuracao.com/wp-content/uploads/2016/07/karakter-restaurant-beach.jpg",
        PUBLIC / "taste-media/karakter-beach.jpg",
    ),
    (
        "https://karaktercuracao.com/wp-content/uploads/2018/03/1-3.png",
        PUBLIC / "taste-media/karakter-plate-1.png",
    ),
    (
        "https://karaktercuracao.com/wp-content/uploads/2018/03/2-1.png",
        PUBLIC / "taste-media/karakter-plate-2.png",
    ),
    (
        "https://karaktercuracao.com/wp-content/uploads/2018/03/3-1.png",
        PUBLIC / "taste-media/karakter-plate-3.png",
    ),
    # Copy fetched heroes if already there
    # brakkeput, fort, bijblauw, mosa, kome, oliva from fetch script
    # —— pops / brisa ——
    (
        "https://images.everyorder.io/cover/brisadomar.jpg",
        PUBLIC / "taste-media/brisa-do-mar-hero.jpg",
    ),
    # —— homes extra listing photos (C21 already in public) ——
    (
        "https://palmstone.realestate/wp-content/uploads/2023/05/Palmstone-Real-Estate-Curacao-1.jpg",
        PUBLIC / "homes-media/palmstone-office.jpg",
    ),
    (
        "https://palmstone.realestate/wp-content/uploads/2023/05/Palmstone-Real-Estate-Curacao-3.jpg",
        PUBLIC / "homes-media/palmstone-listing-1.jpg",
    ),
    (
        "https://www.terreinen-abc.com/wp-content/uploads/2022/09/cover.jpg",
        PUBLIC / "homes-media/terreinen-abc-cover.jpg",
    ),
    (
        "https://www.terreinen-abc.com/wp-content/uploads/2022/07/IMG_8182.jpg",
        PUBLIC / "homes-media/terreinen-abc-home.jpg",
    ),
]

OPTIONAL = [
    # Brandys from sambil — scrape store hero if exists
]


def main() -> None:
    for url, dest in DOWNLOADS:
        try:
            get(url, dest)
        except Exception as e:
            print("WARN", dest.name, e)


if __name__ == "__main__":
    main()