#!/usr/bin/env python3
"""Download partner logos and hero images from official sites (og:image, linked assets)."""
from __future__ import annotations

import re
import ssl
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "the-blue-holiday-wave" / "public"
ORIGINALS = Path(__file__).resolve().parent / "logo-originals"

UA = "Mozilla/5.0 (compatible; BlueHolidayWave/1.0)"
CTX = ssl.create_default_context()


def fetch(url: str, dest: Path, min_bytes: int = 800) -> bool:
    dest.parent.mkdir(parents=True, exist_ok=True)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=45, context=CTX) as r:
            data = r.read()
    except Exception as e:
        print(f"FAIL fetch {url}: {e}")
        return False
    if len(data) < min_bytes:
        print(f"SKIP tiny {url} ({len(data)} bytes)")
        return False
    dest.write_bytes(data)
    print(f"OK {dest.name} ({len(data)} bytes)")
    return True


def page_og_image(url: str) -> str | None:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=45, context=CTX) as r:
            html = r.read().decode("utf-8", errors="replace")
    except Exception as e:
        print(f"FAIL page {url}: {e}")
        return None
    m = re.search(r'property="og:image" content="([^"]+)"', html)
    if m:
        return m.group(1)
    m = re.search(r"<meta[^>]+content=['\"]([^'\"]+)['\"][^>]+property=['\"]og:image", html, re.I)
    return m.group(1) if m else None


# slug -> (site, section folder, logo_url or None, extra image pages for gallery)
PARTNERS = [
    # taste
    ("gouverneur-de-rouville", "https://de-gouverneur.com", "taste", None),
    ("kome", "https://www.komecuracao.com", "taste", None),
    ("oliva", "https://www.olivacuracao.com", "taste", None),
    ("fort-nassau", "https://fortnassau.com", "taste", None),
    ("bijblauw", "https://www.bijblauw.com/oceanview-restaurant/", "taste", None),
    ("mosa-cana", "https://www.mosacana.com", "taste", None),
    ("karakter", "https://karaktercuracao.com", "taste", None),
    ("brakkeput-ariba", "https://brakkeputariba.com", "taste", None),
    ("pops-place", "https://www.popsplacecuracao.com", "taste", None),
    # homes
    ("century21-curacao", "https://www.century21numberone.com/en/", "homes", None),
    ("sothebys-curacao", "https://www.sothebysrealty.com/eng/associates/156075033/curacao-sothebys-international-realty", "homes", None),
    ("palmstone", "https://palmstone.realestate", "homes", None),
    ("terreinen-abc", "https://www.terreinen-abc.com", "homes", None),
    # fashion — logo pages on Sambil / own sites
    ("her-and-him", "https://www.sambil.cw/store/her-him", "fashion", None),
    ("lc-waikiki", "https://www.sambil.cw/store/lc-waikiki", "fashion", None),
    ("brandys", "https://www.sambil.cw/store/brandy%E2%80%99s", "fashion", None),
    ("affaire-de-femmes", "https://www.affairedefemmes.net/", "fashion", None),
    ("korswill", "https://www.sambil.cw/store/korswill", "fashion", None),
]


def try_logo_from_page(url: str, slug: str) -> str | None:
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=45, context=CTX) as r:
            html = r.read().decode("utf-8", errors="replace")
    except Exception:
        return None
    for pat in (
        r'src="([^"]+logo[^"]+\.(?:png|svg|jpg|webp))"',
        r"href='([^']+logo[^']+\.(?:png|svg))'",
        r'content="([^"]+\.(?:png|svg|jpg))"[^>]+property="og:image"',
    ):
        m = re.search(pat, html, re.I)
        if m:
            link = m.group(1)
            if link.startswith("//"):
                link = "https:" + link
            elif link.startswith("/"):
                from urllib.parse import urljoin

                link = urljoin(url, link)
            return link
    return None


def main() -> None:
    for slug, site, section, logo_url in PARTNERS:
        media = PUBLIC / f"{section}-media"
        og = page_og_image(site)
        if og:
            fetch(og, media / f"{slug}-hero.jpg")
        if not logo_url:
            logo_url = try_logo_from_page(site, slug)
        if logo_url:
            ext = ".png"
            if ".svg" in logo_url.lower():
                ext = ".svg"
            elif ".jpg" in logo_url.lower() or ".jpeg" in logo_url.lower():
                ext = ".jpg"
            fetch(logo_url, ORIGINALS / f"{slug}{ext}", min_bytes=200)
        elif og:
            # use og as fallback source for gold pass
            fetch(og, ORIGINALS / f"{slug}.jpg", min_bytes=200)


if __name__ == "__main__":
    main()