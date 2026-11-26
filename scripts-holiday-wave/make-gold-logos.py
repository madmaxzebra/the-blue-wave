"""Turn original partner logos into 3D gold PNGs with a transparent background.

Usage (from the repo root):
    pip install pillow numpy cairosvg
    python scripts-holiday-wave/make-gold-logos.py

The shape of each logo comes from the company's own logo file; only the colour
becomes gold. Output goes to the-blue-holiday-wave/public/*-media/logos/*-gold.png.
"""
from __future__ import annotations

import io
from pathlib import Path

import numpy as np
from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parent.parent
ORIGINALS = ROOT / "scripts-holiday-wave" / "logo-originals"
PUBLIC = ROOT / "the-blue-holiday-wave" / "public"

# (source file, output file[, mask mode]). Mask mode "colour" is for light or
# coloured logos on white, where darkness alone would lose the shape.
LOGOS = [
    (ORIGINALS / "mayas-clothing.png", PUBLIC / "fashion-media/logos/mayas-clothing-gold.png", "colour"),
    (ORIGINALS / "emilia.jpg", PUBLIC / "fashion-media/logos/emilia-boutique-gold.png"),
    (ORIGINALS / "soho-boutique.png", PUBLIC / "fashion-media/logos/soho-boutique-gold.png"),
    (ORIGINALS / "victorias-secret.svg", PUBLIC / "fashion-media/logos/victorias-secret-gold.png"),
    (PUBLIC / "taste-media/logos/the-pen-logo.png", PUBLIC / "taste-media/logos/the-pen-gold.png"),
    (PUBLIC / "taste-media/logos/blues-logo.png", PUBLIC / "taste-media/logos/blues-gold.png"),
    (PUBLIC / "taste-media/logos/schooner-logo.png", PUBLIC / "taste-media/logos/schooner-bar-gold.png"),
    (PUBLIC / "homes-media/logos/remax-logo.png", PUBLIC / "homes-media/logos/remax-gold.png"),
    (PUBLIC / "homes-media/logos/global-re.svg", PUBLIC / "homes-media/logos/global-re-gold.png"),
    (PUBLIC / "homes-media/logos/caribbean-park.svg", PUBLIC / "homes-media/logos/caribbean-park-gold.png"),
]

WORK_WIDTH = 1400
OUT_MAX_WIDTH = 1000
GOLD_STOPS = [
    (0.00, (122, 88, 22)),
    (0.22, (250, 226, 128)),
    (0.42, (214, 166, 58)),
    (0.55, (160, 116, 32)),
    (0.72, (246, 214, 112)),
    (1.00, (140, 100, 26)),
]


def load(path: Path) -> Image.Image:
    if path.suffix.lower() == ".svg":
        import cairosvg

        png = cairosvg.svg2png(url=str(path), output_width=WORK_WIDTH)
        return Image.open(io.BytesIO(png)).convert("RGBA")
    im = Image.open(path).convert("RGBA")
    scale = WORK_WIDTH / im.width
    return im.resize((WORK_WIDTH, max(1, round(im.height * scale))), Image.LANCZOS)


def logo_mask(im: Image.Image, mode: str = "dark") -> tuple[np.ndarray, np.ndarray]:
    """Return (mask 0..1, luminance 0..1). Uses alpha when the file is transparent,
    otherwise treats a white background as empty."""
    rgba = np.asarray(im).astype(np.float32) / 255.0
    lum = 0.299 * rgba[..., 0] + 0.587 * rgba[..., 1] + 0.114 * rgba[..., 2]
    alpha = rgba[..., 3]
    if alpha.min() < 0.98:
        mask = alpha
    elif mode == "colour":
        mask = np.clip((1.0 - rgba[..., :3].min(axis=-1) - 0.08) / 0.3, 0.0, 1.0)
    else:
        mask = np.clip((0.9 - lum) / 0.55, 0.0, 1.0)
    if alpha.min() >= 0.98:
        # Scanned/JPEG logos often have a faint frame line at the very edge.
        edge = max(3, int(0.004 * mask.shape[1]))
        mask[:edge, :] = mask[-edge:, :] = 0
        mask[:, :edge] = mask[:, -edge:] = 0
    return mask, lum


def gold_gradient(height: int, top: int, bottom: int) -> np.ndarray:
    ys = np.clip((np.arange(height) - top) / max(1, bottom - top), 0, 1)
    pos = [p for p, _ in GOLD_STOPS]
    cols = np.stack([np.interp(ys, pos, [c[i] for _, c in GOLD_STOPS]) for i in range(3)], axis=-1)
    return cols / 255.0


def blur(arr: np.ndarray, radius: float) -> np.ndarray:
    img = Image.fromarray(np.clip(arr * 255, 0, 255).astype(np.uint8), "L")
    return np.asarray(img.filter(ImageFilter.GaussianBlur(radius))).astype(np.float32) / 255.0


def make_gold(src: Path, dst: Path, mode: str = "dark") -> None:
    im = load(src)
    mask, lum = logo_mask(im, mode)
    ys, xs = np.nonzero(mask > 0.05)
    if len(ys) == 0:
        raise SystemExit(f"Empty logo: {src}")
    top, bottom = ys.min(), ys.max()
    h, w = mask.shape

    # Bevel: height map from the blurred shape, lit from the top-left.
    radius = max(2.0, 0.004 * w)
    height_map = blur(mask, radius)
    gy, gx = np.gradient(height_map)
    strength = 6.0 / radius
    nx, ny, nz = -gx * strength * radius, -gy * strength * radius, np.ones_like(gx)
    norm = np.sqrt(nx**2 + ny**2 + nz**2)
    light = np.array([-0.55, -0.65, 0.75])
    light /= np.linalg.norm(light)
    shade = (nx * light[0] + ny * light[1] + nz * light[2]) / norm

    # Keep some of the original's inner detail (e.g. stripes) as tone changes.
    inside = mask > 0.5
    detail = (lum - (lum[inside].mean() if inside.any() else 0.5)) * 0.35

    base = gold_gradient(h, top, bottom)[:, None, :].repeat(w, axis=1)
    light_factor = np.clip(0.55 + 0.6 * shade + detail, 0.25, 1.4)[..., None]
    rgb = base * light_factor
    spec = np.clip(shade - 0.86, 0, 1) ** 1.5 * 4.0
    rgb = np.clip(rgb + spec[..., None] * np.array([1.0, 0.96, 0.82]), 0, 1)

    # Soft drop shadow for depth on dark backgrounds.
    offset = max(2, int(0.006 * w))
    shadow = blur(np.roll(np.roll(mask, offset, axis=0), offset, axis=1), radius * 1.6) * 0.55

    out_a = mask + shadow * (1 - mask)
    out_rgb = (rgb * mask[..., None]) / np.maximum(out_a[..., None], 1e-6)
    result = np.dstack([out_rgb, out_a])
    img = Image.fromarray(np.clip(result * 255, 0, 255).astype(np.uint8), "RGBA")

    bbox = img.getchannel("A").point(lambda v: 255 if v > 8 else 0).getbbox()
    pad = int(0.02 * w)
    img = img.crop((max(0, bbox[0] - pad), max(0, bbox[1] - pad), min(w, bbox[2] + pad), min(h, bbox[3] + pad)))
    if img.width > OUT_MAX_WIDTH:
        img = img.resize((OUT_MAX_WIDTH, round(img.height * OUT_MAX_WIDTH / img.width)), Image.LANCZOS)
    dst.parent.mkdir(parents=True, exist_ok=True)
    img.save(dst, optimize=True)
    print(f"{dst.relative_to(ROOT)}  {img.size[0]}x{img.size[1]}")


if __name__ == "__main__":
    for source, target, *mode in LOGOS:
        make_gold(source, target, *mode)
