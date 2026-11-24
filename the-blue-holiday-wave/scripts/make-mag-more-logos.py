from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path(r"G:\projects-2026\the-blue-holiday-wave\public")
FONT_BOLD = [
    r"C:\Windows\Fonts\georgiab.ttf",
    r"C:\Windows\Fonts\segoeuib.ttf",
    r"C:\Windows\Fonts\arialbd.ttf",
]
FONT_REG = [
    r"C:\Windows\Fonts\georgia.ttf",
    r"C:\Windows\Fonts\segoeui.ttf",
    r"C:\Windows\Fonts\arial.ttf",
]


def font(size, bold=False):
    for p in FONT_BOLD if bold else FONT_REG:
        if Path(p).exists():
            return ImageFont.truetype(p, size)
    return ImageFont.load_default()


def hex_rgb(h):
    h = h.lstrip("#")
    return tuple(int(h[i : i + 2], 16) for i in (0, 2, 4))


def draw_book(draw, cx, cy, s, color):
    w = max(2, int(3 * s))
    draw.rectangle(
        [cx - 32 * s, cy - 36 * s, cx + 32 * s, cy + 36 * s], outline=color, width=w
    )
    draw.line([(cx, cy - 36 * s), (cx, cy + 36 * s)], fill=color, width=w)
    draw.arc(
        [cx - 18 * s, cy - 10 * s, cx + 18 * s, cy + 20 * s], 200, 340, fill=color, width=w
    )


def draw_star(draw, cx, cy, s, color):
    # simple 4-point spark / sponsor mark
    w = max(2, int(3 * s))
    draw.line([(cx, cy - 40 * s), (cx, cy + 40 * s)], fill=color, width=w)
    draw.line([(cx - 40 * s, cy), (cx + 40 * s, cy)], fill=color, width=w)
    draw.line(
        [(cx - 28 * s, cy - 28 * s), (cx + 28 * s, cy + 28 * s)], fill=color, width=w
    )
    draw.line(
        [(cx + 28 * s, cy - 28 * s), (cx - 28 * s, cy + 28 * s)], fill=color, width=w
    )
    draw.ellipse([cx - 8 * s, cy - 8 * s, cx + 8 * s, cy + 8 * s], outline=color, width=w)


def make_logo(path, name, color, kind):
    path.parent.mkdir(parents=True, exist_ok=True)
    W = H = 640
    img = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    d = ImageDraw.Draw(img)
    fg = hex_rgb(color) + (255,)
    ink = (247, 243, 236, 255)
    cx, cy = W // 2, 200
    if kind == "magazine":
        draw_book(d, cx, cy, 2.0, fg)
    else:
        draw_star(d, cx, cy, 1.8, fg)

    parts = name.replace("&", "&").split()
    if len(parts) >= 3:
        line1, line2 = " ".join(parts[:2]), " ".join(parts[2:])
    elif len(parts) == 2:
        line1, line2 = parts[0], parts[1]
    else:
        line1, line2 = parts[0], ""

    def center(text, y, fnt, fill):
        if not text:
            return
        bbox = d.textbbox((0, 0), text, font=fnt)
        tw = bbox[2] - bbox[0]
        d.text(((W - tw) / 2, y), text, font=fnt, fill=fill)

    center(line1.upper(), 340, font(52 if len(line1) > 10 else 58, True), ink)
    if line2:
        center(line2.upper(), 400, font(44 if len(line2) > 10 else 50, True), ink)
    d.rectangle([W // 2 - 48, 470, W // 2 + 48, 475], fill=fg)
    sub = "MAGAZINE" if kind == "magazine" else "SPONSOR"
    bbox = d.textbbox((0, 0), sub, font=font(22, True))
    tw = bbox[2] - bbox[0]
    d.text(((W - tw) / 2, 492), sub, font=font(22, True), fill=fg)

    bbox = img.getbbox()
    if bbox:
        pad = 24
        img = img.crop(
            (
                max(0, bbox[0] - pad),
                max(0, bbox[1] - pad),
                min(W, bbox[2] + pad),
                min(H, bbox[3] + pad),
            )
        )
    img.save(path, "PNG")
    print("wrote", path.name, img.size)


logos = [
    ("magazine-media/logos/island-ink.png", "Island Ink", "#c9a227", "magazine"),
    ("magazine-media/logos/gold-page.png", "Gold Page", "#5aa0c8", "magazine"),
    ("magazine-media/logos/wave-press.png", "Wave Press", "#e06b8a", "magazine"),
    ("more-media/logos/coral-bay.png", "Coral Bay", "#5aa0c8", "more"),
    ("more-media/logos/trade-wind.png", "Trade Wind", "#d4a84b", "more"),
    ("more-media/logos/plaza-lights.png", "Plaza Lights", "#e06b8a", "more"),
]
for rel, name, color, kind in logos:
    make_logo(ROOT / rel, name, color, kind)
print("DONE")
