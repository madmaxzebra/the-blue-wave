from pathlib import Path


def inject(path: str, pairs: list[tuple[str, str]]) -> None:
    p = Path(path)
    t = p.read_text(encoding="utf-8")
    for old, new in pairs:
        if old not in t:
            print("MISS", path, repr(old[:50]))
        else:
            t = t.replace(old, new)
            print("ok", old[:40].replace("\n", " "))
    p.write_text(t, encoding="utf-8")


inject(
    r"G:\projects-2026\the-blue-holiday-wave\src\data\fashionStores.ts",
    [
        (
            "logoLabel: 'CM',\n    logoColor: '#3d7ea6',\n    highlightImg:",
            "logoLabel: 'CM',\n    logoColor: '#3d7ea6',\n    logoImg: `${base}fashion-media/logos/casa-mar.png`,\n    highlightImg:",
        ),
        (
            "logoLabel: 'NO',\n    logoColor: '#8b2344',\n    highlightImg:",
            "logoLabel: 'NO',\n    logoColor: '#8b2344',\n    logoImg: `${base}fashion-media/logos/noir-otro.png`,\n    highlightImg:",
        ),
    ],
)

inject(
    r"G:\projects-2026\the-blue-holiday-wave\src\data\homesPartners.ts",
    [
        (
            "logoLabel: 'HV',\n    logoColor: '#3d7ea6',\n    highlightImg:",
            "logoLabel: 'HV',\n    logoColor: '#3d7ea6',\n    logoImg: `${base}homes-media/logos/harbour-view.png`,\n    highlightImg:",
        ),
        (
            "logoLabel: 'CK',\n    logoColor: '#d4a84b',\n    highlightImg:",
            "logoLabel: 'CK',\n    logoColor: '#d4a84b',\n    logoImg: `${base}homes-media/logos/coral-keys.png`,\n    highlightImg:",
        ),
        (
            "logoLabel: 'BR',\n    logoColor: '#8b2344',\n    highlightImg:",
            "logoLabel: 'BR',\n    logoColor: '#8b2344',\n    logoImg: `${base}homes-media/logos/blue-ridge.png`,\n    highlightImg:",
        ),
    ],
)

inject(
    r"G:\projects-2026\the-blue-holiday-wave\src\data\tastePartners.ts",
    [
        (
            "logoLabel: 'CB',\n    logoColor: '#3d7ea6',\n    highlightImg:",
            "logoLabel: 'CB',\n    logoColor: '#3d7ea6',\n    logoImg: `${base}taste-media/logos/casa-brisa.png`,\n    highlightImg:",
        ),
        (
            "logoLabel: 'OO',\n    logoColor: '#d4a84b',\n    highlightImg:",
            "logoLabel: 'OO',\n    logoColor: '#d4a84b',\n    logoImg: `${base}taste-media/logos/oven-olive.png`,\n    highlightImg:",
        ),
        (
            "logoLabel: 'SS',\n    logoColor: '#8b2344',\n    highlightImg:",
            "logoLabel: 'SS',\n    logoColor: '#8b2344',\n    logoImg: `${base}taste-media/logos/sweet-salt.png`,\n    highlightImg:",
        ),
    ],
)

print("done")
