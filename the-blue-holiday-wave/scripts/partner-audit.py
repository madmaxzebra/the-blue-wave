#!/usr/bin/env python3
"""Audit partner profiles: file existence, MD5 dupes across partners, path/name mismatches."""
import hashlib
import json
import re
from collections import defaultdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PUBLIC = ROOT / "public"
DATA = ROOT / "src" / "data"

DATA_FILES = [
    "fashionStores.ts",
    "fashionStoresMore.ts",
    "tastePartners.ts",
    "tastePartnersMore.ts",
    "homesPartners.ts",
    "homesPartnersMore.ts",
    "magazinePartners.ts",
    "morePartners.ts",
]

# Strip query string from URL paths in TS
def normalize_path(url: str) -> str:
    p = url.strip()
    p = re.sub(r"\$\{base\}", "", p)
    p = p.split("?")[0]
    return p.lstrip("/")

def extract_partners(text: str, source: str) -> list[dict]:
    partners = []
    # Split on id: at object start (heuristic)
    blocks = re.split(r"\n\s*\{\s*\n", text)
    for block in blocks:
        m_id = re.search(r"id:\s*['\"]([^'\"]+)['\"]", block)
        if not m_id:
            continue
        pid = m_id.group(1)
        m_name = re.search(r"name:\s*['\"]([^'\"]+)['\"]", block)
        name = m_name.group(1) if m_name else pid
        imgs = []
        for pattern in [
            r"logoImg:\s*`([^`]+)`",
            r"highlightImg:\s*`([^`]+)`",
            r"heroImg:\s*`([^`]+)`",
            r"lifestyleImg:\s*`([^`]+)`",
            r"visitBannerImg:\s*`([^`]+)`",
            r"lifestyleMarkImg:\s*`([^`]+)`",
            r"img:\s*`([^`]+)`",
        ]:
            imgs.extend(re.findall(pattern, block))
        # dedupe preserving order
        seen = set()
        unique = []
        for im in imgs:
            np = normalize_path(im)
            if np not in seen:
                seen.add(np)
                unique.append((im, np))
        partners.append({"id": pid, "name": name, "source": source, "images": unique})
    return partners

def md5_file(path: Path) -> str | None:
    if not path.is_file():
        return None
    h = hashlib.md5()
    with open(path, "rb") as f:
        for chunk in iter(lambda: f.read(65536), b""):
            h.update(chunk)
    return h.hexdigest()

def slug_tokens(s: str) -> set[str]:
    s = re.sub(r"[-_./]", " ", s.lower())
    return {w for w in s.split() if len(w) > 2}

def path_partner_mismatch(partner_id: str, partner_name: str, rel_path: str) -> str | None:
    """Flag when image filename strongly suggests another brand."""
    low = rel_path.lower()
    id_tok = slug_tokens(partner_id.replace("-", " "))
    name_tok = slug_tokens(partner_name)
    allowed = id_tok | name_tok
    # known cross-folder borrow patterns
    foreign_brands = [
        ("remax", {"remax-bonbini"}),
        ("sotheby", {"sothebys-curacao"}),
        ("c21-", {"century21-curacao"}),
        ("century21", {"century21-curacao"}),
        ("palmstone", {"palmstone-real-estate"}),
        ("gs-real-estate", {"gs-real-estate"}),
        ("real-estate-caribe", {"real-estate-caribe"}),
        ("sambil-mall", set()),  # generic mall - warn if sole hero
        ("mambo", set()),
        ("zara", {"zara-sambil"}),
        ("only-", {"only-curacao"}),
        ("vs/", {"victorias-secret-sambil"}),
    ]
    for needle, owners in foreign_brands:
        if needle in low and partner_id not in owners:
            if needle == "sambil-mall":
                continue  # handled separately
            return f"Path contains '{needle}' but partner is {partner_id}"
    # Generic stock filenames
    generic = ["villa-2.jpg", "interior.jpg", "terrace.jpg", "placeholder"]
    for g in generic:
        if g in low:
            return f"Generic/stock filename: {g}"
    return None

all_partners: list[dict] = []
for fname in DATA_FILES:
    path = DATA / fname
    if not path.exists():
        continue
    text = path.read_text(encoding="utf-8")
    all_partners.extend(extract_partners(text, fname))

# Per-partner issues
issues: list[dict] = []
path_to_partners: dict[str, set[str]] = defaultdict(set)
md5_to_paths: dict[str, set[str]] = defaultdict(set)
md5_to_partners: dict[str, set[str]] = defaultdict(set)

for p in all_partners:
    pid = p["id"]
    partner_issues = []
    missing = []
    mismatch = []
    sambil_only_hero = False

    for raw, rel in p["images"]:
        full = PUBLIC / rel
        path_to_partners[rel].add(pid)
        if not full.is_file():
            missing.append(rel)
            continue
        digest = md5_file(full)
        if digest:
            md5_to_paths[digest].add(rel)
            md5_to_partners[digest].add(pid)
        mm = path_partner_mismatch(pid, p["name"], rel)
        if mm:
            mismatch.append(f"{rel}: {mm}")

    for m in missing:
        partner_issues.append(("critical", f"Missing file: public/{m}"))

    for m in mismatch:
        sev = "critical" if any(x in m for x in ("remax", "sotheby", "c21-", "palmstone", "mambo", "gs-real-estate")) else "warn"
        partner_issues.append((sev, m))

    # Logo path should mention partner or known alias
    logo_paths = [rel for raw, rel in p["images"] if "logos/" in rel]
    if logo_paths:
        logo = logo_paths[0]
        base_name = Path(logo).stem.split("?")[0]
        id_short = partner_id_slug = pid.replace("-sambil", "").replace("-curacao", "")
        if "gold" in base_name:
            base_name = base_name.replace("-gold", "").replace("-3d", "")
        if base_name.endswith("gold"):
            base_name = base_name[:-4]
        # loose check: logo filename should relate to id
        id_parts = set(pid.split("-")) - {"sambil", "curacao", "nl", "the"}
        logo_parts = set(re.sub(r"[^a-z]", " ", base_name.lower()).split())
        if not (id_parts & logo_parts) and pid not in ("victorias-secret-sambil",):
            if "out-of-the-blue" in pid and "out-of-the-blue" not in logo:
                partner_issues.append(("warn", f"Logo path may not match id: {logo}"))
            elif pid == "bo-printer" and "bo-printer" in logo:
                pass
            elif not any(part in logo for part in id_parts if len(part) > 3):
                partner_issues.append(("warn", f"Logo filename weak match to id '{pid}': {logo}"))

    hero = next((rel for raw, rel in p["images"] if any(x in raw for x in ("heroImg", "highlightImg")) or rel.endswith("hero")), None)
    # check if hero is only sambil mall for fashion
    hero_rels = [rel for key in ["hero"] for raw, rel in p["images"]]
    image_rels = [rel for _, rel in p["images"]]
    if "fashion" in p["source"] or "Fashion" in p["source"]:
        heros = [rel for _, rel in p["images"]][:3]  # first images usually highlight/hero from order in file - skip

    for _, rel in p["images"]:
        if rel == "fashion-media/sambil-mall-hero.jpg":
            # count non-logo uses
            non_logo = [r for _, r in p["images"] if "logos" not in r and r == rel]
            if len(non_logo) >= 2:
                partner_issues.append(("warn", "Uses generic sambil-mall-hero.jpg for multiple slots"))

    if not partner_issues:
        issues.append({"id": pid, "name": p["name"], "severity": "ok", "problem": "", "fix": "", "source": p["source"]})
    else:
        max_sev = "ok"
        for sev, prob in partner_issues:
            if sev == "critical":
                max_sev = "critical"
            elif sev == "warn" and max_sev != "critical":
                max_sev = "warn"
        prob_text = "; ".join(f"[{s}] {pr}" for s, pr in partner_issues)
        fixes = []
        if missing:
            fixes.append("Add or correct asset under public/")
        if mismatch:
            fixes.append("Replace with partner-specific photography")
        issues.append({
            "id": pid,
            "name": p["name"],
            "severity": max_sev,
            "problem": prob_text,
            "fix": "; ".join(fixes) or "Review assets",
            "source": p["source"],
        })

# Cross-partner duplicate MD5 (different partner ids)
dupe_issues: dict[str, list[str]] = defaultdict(list)
for digest, pids in md5_to_partners.items():
    if len(pids) < 2:
        continue
    paths = sorted(md5_to_paths[digest])
    msg = f"Identical image (MD5 {digest[:8]}…) shared across partners {sorted(pids)}: {', '.join(paths)}"
    for pid in pids:
        dupe_issues[pid].append(msg)

for row in issues:
    if row["severity"] == "ok" and row["id"] in dupe_issues:
        row["severity"] = "warn"
        row["problem"] = "; ".join(dupe_issues[row["id"]])
        row["fix"] = "Use unique photos per partner or document intentional reuse"
    elif row["id"] in dupe_issues:
        row["problem"] += "; " + "; ".join(dupe_issues[row["id"]])
        if row["severity"] == "ok":
            row["severity"] = "warn"

# Known critical cross-brand from manual grep knowledge
KNOWN = {
    "sothebys-curacao": "Uses Century 21 property photos (c21-property-*) instead of Sotheby's-specific assets",
    "caribbean-island-living": "Listing carousel includes remax-villa-1.jpg and real-estate-caribe-garden-pool.jpg",
    "girasol-rentals": "Uses remax-jan-sofat-villa.jpg and c21-property-4.jpg in items",
    "palmstone-real-estate": "Third listing image is gs-real-estate-seru-coral-pool.jpg (GS Real Estate)",
    "curacao-realestate-nl": "Uses real-estate-caribe-grote-berg-* images in carousel",
    "island-living-collective": "Generic stock filenames villa-2.jpg, interior.jpg, terrace.jpg",
}

for row in issues:
    if row["id"] in KNOWN:
        if KNOWN[row["id"]] not in row["problem"]:
            row["problem"] = (row["problem"] + "; " if row["problem"] else "") + KNOWN[row["id"]]
        row["severity"] = "critical" if row["id"] in ("sothebys-curacao", "caribbean-island-living", "girasol-rentals", "palmstone-real-estate") else row["severity"]
        if row["severity"] == "ok":
            row["severity"] = "warn"

# Output JSON for report generator
out = {
    "partners": sorted(issues, key=lambda x: ({"critical": 0, "warn": 1, "ok": 2}[x["severity"]], x["id"])),
    "totals": {
        "critical": sum(1 for i in issues if i["severity"] == "critical"),
        "warn": sum(1 for i in issues if i["severity"] == "warn"),
        "ok": sum(1 for i in issues if i["severity"] == "ok"),
        "total": len(issues),
    },
    "md5_cross_partner": [
        {"md5": d[:12], "partners": sorted(pids), "paths": sorted(md5_to_paths[d])}
        for d, pids in sorted(md5_to_partners.items(), key=lambda x: -len(x[1]))
        if len(pids) > 1
    ],
}
print(json.dumps(out, indent=2))