# Partner profile audit report

**Repository:** `the-blue-holiday-wave`  
**Audited:** 2026-11-26  
**Scope:** 42 partners across Fashion (12), Taste (12), Homes (12), Magazine (3), More (3)  
**Data sources:** `src/data/fashionStores.ts`, `fashionStoresMore.ts`, `tastePartners.ts`, `tastePartnersMore.ts`, `homesPartners.ts`, `homesPartnersMore.ts`, `magazinePartners.ts`, `morePartners.ts`  
**Methods:** Parsed all image URLs; verified `public/**` file existence; `md5sum` cross-partner duplicate detection; visual spot-check of flagged logos and watermarked listing photos; grep for `Mambo`, `placeholder`, `remax`/`sotheby` patterns.

---

## Summary counts

| Severity | Count | Meaning |
|----------|------:|---------|
| **critical** | 6 | Wrong brand, missing assets, or another brokerage’s listing photos |
| **warn** | 8 | Generic mall/stock photos, weak carousel variety, shared venue shots |
| **ok** | 28 | No material issues found in this pass |
| **Total** | **42** | |

**Copy / metadata (non-partner):** `src/data/fashionStores.ts` line 76 still says *"Sample advertisers — replace with real logos, photos, and copy later"* — remove before a business demo.

**Logos:** All 42 `logoImg` paths resolve to existing files under `public/`. One logo file is the **wrong brand** (Affaire).

**Grep:** No `placeholder` strings in partner data. `Mambo` appears only in legitimate venue copy (Out of the Blue / ONLY locations). Cross-broker misattribution is concentrated in **Homes** (`homesPartnersMore.ts`).

---

## Partner inventory

| Partner id | Severity | Problem | Suggested fix |
|------------|----------|---------|---------------|
| `affaire-de-femmes` | **critical** | Logo `public/fashion-media/logos/affaire-de-femmes-gold.png` is **Mambo Beach Boulevard** mark (not Affaire). Hero/interior photos are on-brand. | Replace logo PNG with Affaire de Femmes wordmark from `affairedefemmes.net` or brand kit. |
| `sothebys-curacao` | **critical** | All listing/hero/lifestyle images are **Century 21** stock (`public/homes-media/c21-property-1.jpg` … `c21-property-4.jpg`) with **visible C21 watermarks**; Sotheby’s logo is correct. Copy/address in `homesPartnersMore.ts` looks plausible. | Add Sotheby’s Curaçao listing photography; update paths in `src/data/homesPartnersMore.ts`. |
| `caribbean-island-living` | **critical** | **Missing** `public/homes-media/caribbean-island-living-hero.jpg` (4 refs in `homesPartnersMore.ts`). Carousel uses `public/homes-media/remax-villa-1.jpg` and `public/homes-media/real-estate-caribe-garden-pool.jpg`. Logo file is correct. | Scrape/export hero from `caribbeanislandliving.com`; replace borrowed RE/MAX & Caribe JPEGs. |
| `palmstone-real-estate` | **critical** | Item slot uses `public/homes-media/gs-real-estate-seru-coral-pool.jpg` (GS Real Estate). `palmstone-hero.jpg` repeated 5×. | Remove GS asset; add distinct Palmstone listings from `palmstone.realestate`. |
| `girasol-rentals` | **critical** | Items use `public/homes-media/remax-jan-sofat-villa.jpg` and `public/homes-media/c21-property-4.jpg`. | Replace with Girasol / Curacao Rentals unit photos. |
| `curacao-realestate-nl` | **critical** | Items use `public/homes-media/real-estate-caribe-grote-berg-home.jpg` and `…-pool.jpg`. | Use `curacao-realestate.nl` listing images. |
| `brandys` | warn | `highlightImg` = Sambil mall exterior (`public/fashion-media/sambil-mall-hero.jpg`); same MD5 shared with Her & Him and Korswill. Store photo `brandys-store-1.jpg` exists but is secondary. | Promote `public/fashion-media/brandys-store-1.jpg` to highlight/hero. |
| `her-and-him` | warn | Same as Brandy's — mall hero as primary visual (`sambil-mall-hero.jpg`). | Use `public/fashion-media/her-and-him-store.jpg` for highlight/hero. |
| `korswill` | warn | Same — `sambil-mall-hero.jpg` as `highlightImg`. | Use `public/fashion-media/korswill-store.jpg` for highlight/hero. |
| `island-living-collective` | warn | Entire profile uses generic filenames `public/homes-media/villa-2.jpg`, `interior.jpg`, `terrace.jpg` (non–partner-specific; visually generic luxury stock). | Replace with Island Living Collective portfolio shots. |
| `terreinen-abc` | warn | `public/homes-media/terreinen-abc-hero.jpg` repeated 3× in items/hero. | Add land/plot photography from `terreinen-abc.com`. |
| `blue-bay-curacao` | warn | `public/homes-media/blue-bay-beach-club.jpg` duplicated in items carousel. | Add second beach/golf image. |
| `blues-caribbean-kitchen` | warn | Shares several `taste-media/avila-*.jpg` with The Pen and Schooner (correct hotel; low outlet distinctiveness). | Optional: Blues-specific pier/food shots. |
| `schooner-bar` | warn | Same Avila venue photo sharing as above. | Optional: tiki-bar close-ups. |
| `zara-sambil` | ok | — | — |
| `out-of-the-blue` | ok | — | — |
| `only-curacao` | ok | — | — |
| `mayas-clothing` | ok | — | — |
| `emilia-boutique` | ok | — | — |
| `soho-boutique` | ok | — | — |
| `victorias-secret-sambil` | ok | — | — |
| `lc-waikiki` | ok | — | — |
| `the-pen-restaurant` | ok | — | — |
| `gouverneur-de-rouville` | ok | — | — |
| `kome` | ok | — | — |
| `oliva` | ok | — | — |
| `fort-nassau` | ok | — | — |
| `bijblauw` | ok | — | — |
| `mosa-cana` | ok | — | — |
| `karakter-beach-bar` | ok | — | — |
| `brakkeput-ariba` | ok | — | — |
| `brisa-do-mar-pops` | ok | — | — |
| `remax-bonbini` | ok | — | — |
| `real-estate-caribe` | ok | — | — |
| `gs-real-estate` | ok | — | — |
| `century21-curacao` | ok | — | — |
| `amigoe-nieuws` | ok | — | — |
| `mammoet-printing` | ok | — | — |
| `bo-printer` | ok | — | — |
| `harbor-hotel-curacao` | ok | — | — |
| `maduro-curiels-bank` | ok | — | — |
| `curacao-north-sea-jazz` | ok | — | — |

---

## Partners with no issues found (28)

`amigoe-nieuws`, `bijblauw`, `bo-printer`, `brakkeput-ariba`, `brisa-do-mar-pops`, `century21-curacao`, `curacao-north-sea-jazz`, `emilia-boutique`, `fort-nassau`, `gouverneur-de-rouville`, `gs-real-estate`, `harbor-hotel-curacao`, `karakter-beach-bar`, `kome`, `lc-waikiki`, `maduro-curiels-bank`, `mammoet-printing`, `mayas-clothing`, `mosa-cana`, `oliva`, `only-curacao`, `out-of-the-blue`, `real-estate-caribe`, `remax-bonbini`, `soho-boutique`, `the-pen-restaurant`, `victorias-secret-sambil`, `zara-sambil`

---

## Cross-partner identical files (MD5)

Different partner ids referencing the same bytes:

| File | Partner ids |
|------|-------------|
| `public/fashion-media/sambil-mall-hero.jpg` | `brandys`, `her-and-him`, `korswill` |
| `public/homes-media/c21-property-{1,2,3,4}.jpg` | `century21-curacao`, `sothebys-curacao` (+ `girasol-rentals` uses `c21-property-4.jpg`) |
| `public/homes-media/remax-villa-1.jpg` | `remax-bonbini`, `caribbean-island-living` |
| `public/homes-media/remax-jan-sofat-villa.jpg` | `remax-bonbini`, `girasol-rentals` |
| `public/homes-media/real-estate-caribe-garden-pool.jpg` | `real-estate-caribe`, `caribbean-island-living` |
| `public/homes-media/real-estate-caribe-grote-berg-{home,pool}.jpg` | `real-estate-caribe`, `curacao-realestate-nl` |
| `public/homes-media/gs-real-estate-seru-coral-pool.jpg` | `gs-real-estate`, `palmstone-real-estate` |
| `public/taste-media/avila-{pen-terrace,hotel-beach,schooner-bar}.jpg` | `the-pen-restaurant`, `blues-caribbean-kitchen`, `schooner-bar` (expected: same hotel) |

---

## Copy spot-check (where verifiable)

| Partner | Assessment |
|---------|------------|
| Affaire de Femmes | Name, Saliña Galleries / `affairedefemmes.net` URLs align with known boutique; **logo asset wrong**. |
| Sotheby's Curaçao | Name, phone, Caracasbaaiweg address match public brokerage listings; **photos are C21**. |
| Maduro & Curiel's Bank | Founded 1917, Willemstad — consistent with MCB public history. |
| Avila (Pen / Blues / Schooner) | Shared Penstraat 130 address and `avilabeachhotel.com` links — correct compound venue. |
| ZARA / LC Waikiki / VS at Sambil | Mall location (Veeris 27) consistent with Sambil Curaçao tenant set. |

---

## Priority fix list (top 10)

1. **`affaire-de-femmes`** — Replace `public/fashion-media/logos/affaire-de-femmes-gold.png` (currently Mambo logo).
2. **`sothebys-curacao`** — Remove all `public/homes-media/c21-property-*.jpg` references; use Sotheby's listing media.
3. **`caribbean-island-living`** — Add missing `public/homes-media/caribbean-island-living-hero.jpg`; fix carousel borrow from RE/MAX / Caribe.
4. **`palmstone-real-estate`** — Drop `public/homes-media/gs-real-estate-seru-coral-pool.jpg` from items; diversify `palmstone-hero.jpg`.
5. **`girasol-rentals`** — Replace `remax-jan-sofat-villa.jpg` and `c21-property-4.jpg` in `homesPartnersMore.ts`.
6. **`curacao-realestate-nl`** — Replace Real Estate Caribe `grote-berg` images in items.
7. **`island-living-collective`** — Replace `villa-2.jpg` / `interior.jpg` / `terrace.jpg` stock set.
8. **`her-and-him` / `korswill` / `brandys`** — Stop using Sambil mall as `highlightImg`; use each `*-store.jpg`.
9. **`terreinen-abc` / `blue-bay-curacao`** — Add distinct carousel images (duplicate hero/beach slots).
10. **Demo polish** — Remove "Sample advertisers" comment in `src/data/fashionStores.ts`; optional Avila outlet-specific food photos.

---

## Critical asset paths (quick reference)

```
public/fashion-media/logos/affaire-de-femmes-gold.png
public/homes-media/caribbean-island-living-hero.jpg   (MISSING)
public/homes-media/c21-property-1.jpg                 (on sothebys-curacao)
public/homes-media/c21-property-2.jpg                 (on sothebys-curacao)
public/homes-media/c21-property-3.jpg                 (on sothebys-curacao)
public/homes-media/c21-property-4.jpg                 (on sothebys-curacao, girasol-rentals)
public/homes-media/gs-real-estate-seru-coral-pool.jpg (on palmstone-real-estate)
public/homes-media/remax-villa-1.jpg                  (on caribbean-island-living)
public/homes-media/remax-jan-sofat-villa.jpg          (on girasol-rentals)
public/homes-media/real-estate-caribe-garden-pool.jpg (on caribbean-island-living)
public/homes-media/real-estate-caribe-grote-berg-home.jpg  (on curacao-realestate-nl)
public/homes-media/real-estate-caribe-grote-berg-pool.jpg  (on curacao-realestate-nl)
```

---

*Inventory only — no data fixes applied in this audit. Re-run `python3 scripts/partner-audit.py` after asset updates.*