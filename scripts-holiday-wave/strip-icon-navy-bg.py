"""Remove baked-in navy square from holiday topic gold icons."""
from __future__ import annotations

from pathlib import Path

from PIL import Image

ICONS_DIR = Path(__file__).resolve().parents[1] / "public" / "holiday-media" / "icons"
NAMES = (
    "fashion-gold.png",
    "realestate-gold.png",
    "culinary-gold.png",
    "sponsors-gold.png",
    "magazine-gold.png",
)


def is_navy_background(r: int, g: int, b: int) -> bool:
    """True for dark navy plate; keep gold/warm foreground."""
    if r > 72 or g > 68:
        return False
    if b >= r + 12 and b >= g + 8 and b > 18:
        return True
    if max(r, g, b) < 42:
        return True
    return False


def is_gold_foreground(r: int, g: int, b: int) -> bool:
    """Warm gold art — never strip to transparent."""
    if r < 70 or max(r, g) < 55:
        return False
    if r >= g * 0.78 and g >= b * 0.95 and r > b + 12:
        return True
    if r > 110 and g > 75 and b < 115 and (r + g) > b * 2:
        return True
    return False


def is_light_plate(r: int, g: int, b: int) -> bool:
    """White / light gray baked-in square behind some icons."""
    if is_gold_foreground(r, g, b):
        return False
    peak = max(r, g, b)
    trough = min(r, g, b)
    if peak >= 130 and (peak - trough) <= 50:
        return True
    return False


def should_strip(r: int, g: int, b: int) -> bool:
    return is_navy_background(r, g, b) or is_light_plate(r, g, b)


def process(path: Path) -> None:
    im = Image.open(path).convert("RGBA")
    px = im.load()
    w, h = im.size
    stripped = 0
    for y in range(h):
        for x in range(w):
            r, g, b, a = px[x, y]
            if a and should_strip(r, g, b):
                px[x, y] = (r, g, b, 0)
                stripped += 1
    im.save(path, optimize=True)
    corners = (
        px[0, 0][3],
        px[w - 1, 0][3],
        px[0, h - 1][3],
        px[w - 1, h - 1][3],
    )
    print(f"Updated {path.name} ({w}x{h}), stripped {stripped}px, corner alpha {corners}")


def main() -> None:
    for name in NAMES:
        process(ICONS_DIR / name)


if __name__ == "__main__":
    main()
