export type FashionLook = {
  img: string
  tag: string
  title: string
  text: string
}

export type FashionStore = {
  id: string
  name: string
  area: string
  intro: string
  /** Short line under the name on the store page */
  tagline: string
  logoLabel: string
  logoColor: string
  logoImg: string
  highlightImg: string
  highlightCaption: string
  heroImg: string
  heroTitle: string
  heroText: string
  quote: string
  looks: FashionLook[]
  shopNote: string
  lifestyleTitle: string
  lifestyleText: string
  lifestyleImg: string
  /** Small extra mark under the lifestyle box on the detail page */
  lifestyleMarkImg?: string
  /** Light logo wordmark on dark glass UI */
  logoOnDark?: boolean
  /** Wider wordmark — larger on detail + list */
  logoLarge?: boolean
  /** Keep the fashion-list logo in the shared card height */
  listLogoLarge?: boolean
  /** Flat text under the logo image (not baked into the PNG) */
  logoCaption?: string
  /** Mall or venue (real stores) */
  venue?: string
  /** Verified address line */
  address?: string
  /** Published store hours */
  openingHours?: string
  /** Published phone */
  phone?: string
  /** WhatsApp number (digits only, e.g. 59997353131) */
  whatsapp?: string
  /** Google Maps embed src URL */
  mapsEmbed?: string
  /** Google Maps directions URL */
  mapsUrl?: string
  /** Official store or brand URL */
  websiteUrl?: string
  websiteLabel?: string
  /** Overrides “{area} · Fashion partner” on the store page */
  partnerKicker?: string
  /** Short blurb for the fashion list only. Detail page keeps `intro`. */
  listBlurb?: string
  /** Full-width visit banner above store details (no side thumbnail) */
  visitBannerImg?: string
  /** Hide duplicate lifestyle block when visit banner uses the same image */
  hideLifestyleStory?: boolean
  /** Skip the “Visit {name}” heading in the in-store box */
  hideVisitHeading?: boolean
  /** Show the full cut-out person instead of cropping the photo */
  photoFit?: 'contain'
}

const base = import.meta.env.BASE_URL

/** Sample advertisers — replace with real logos, photos, and copy later */
export const fashionStores: FashionStore[] = [
  {
    id: 'zara-sambil',
    name: 'ZARA',
    area: 'Sambil Mall',
    partnerKicker: 'Blue Holiday Wave - Fashion Partner',
    listBlurb: 'Women’s, men’s, and kids’ looks at Sambil Mall.',
    intro:
      'ZARA brings its latest women’s, men’s, and kids’ collections to Sambil Shopping Mall in Willemstad — global trends under one roof. The flagship store sits in the mall at units L-31, L-34, and L-40, a short ride from Punda and the hotel strip.',
    hideVisitHeading: true,
    tagline: 'Woman · Man · Kids',
    logoLabel: 'ZR',
    logoColor: '#2c2e35',
    logoImg: `${base}fashion-media/logos/zara-gold-3d.png?v=20261014b`,
    logoCaption: 'CURAÇAO',
    logoLarge: true,
    venue: 'Sambil Shopping Mall',
    address: 'Veeris 27, Willemstad, Curaçao (units L-31 / L-34 / L-40)',
    openingHours:
      'Mon–Thu 11:00–20:00 · Fri–Sat 11:00–21:00 · Sun 11:00–20:00 (per ZARA store locator)',
    websiteUrl: 'https://www.zara.com/cw/',
    websiteLabel: 'Shop at zara.com/cw',
    highlightImg: `${base}fashion-media/zara-look-white-dress.png`,
    highlightCaption: 'Summer white edit',
    heroImg: `${base}fashion-media/zara-hero-denim.png`,
    heroTitle: 'Fresh denim for warm days',
    heroText:
      'Light washes, clean lines, and easy layers — the kind of pieces that work from Willemstad mornings to holiday evenings.',
    quote: 'Start with one hero piece, layer the rest in store.',
    looks: [
      {
        img: `${base}fashion-media/zara-look-white-dress.png`,
        tag: 'Women',
        title: 'White heat',
        text: 'Crisp summer dress shapes — minimal styling, maximum sun.',
      },
      {
        img: `${base}fashion-media/zara-look-men.png`,
        tag: 'Men',
        title: 'Clean lines',
        text: 'Sharp shirts and tailored basics for warm island days.',
      },
      {
        img: `${base}fashion-media/zara-look-kids.png`,
        tag: 'Kids',
        title: 'Play in color',
        text: 'Easy stripes and soft layers for busy holiday mornings.',
      },
    ],
    visitBannerImg: `${base}fashion-media/zara-look-black-dress.png`,
    shopNote:
      'Hours above are from ZARA’s official store page. Mall-wide hours on sambil.cw may differ — check both before you go.',
    lifestyleTitle: 'Lunch with friends, still dressed up',
    lifestyleText:
      'Holiday on the island is as much about the table as the wardrobe — easy looks that move from shopping to a long, sunny lunch without a change.',
    lifestyleImg: `${base}fashion-media/zara-lifestyle-lunch.jpg`,
  },
  {
    id: 'out-of-the-blue',
    name: 'Out of the Blue',
    area: 'Mambo Beach',
    partnerKicker: 'Blue Holiday Wave - Fashion Partner',
    listBlurb: 'Jewelry, local art, and gifts at Mambo Beach.',
    intro:
      'Out of the Blue is a gift gallery on Mambo Beach Boulevard in Willemstad. Their Facebook page describes the shop as local art, jewelry, and beach wear. Their own Tripadvisor note also names gift galleries at Mambo, Jan Thiel, and the Megapier.',
    hideVisitHeading: true,
    tagline: 'Jewelry · local art · gifts',
    logoLabel: 'OB',
    logoColor: '#1a9aa8',
    logoImg: `${base}fashion-media/logos/out-of-the-blue.png?v=20261014f`,
    logoCaption: 'JEWELRY & GIFT SHOP',
    logoLarge: true,
    listLogoLarge: false,
    venue: 'Mambo Beach Boulevard',
    address: 'Willemstad, Curaçao',
    phone: '+599 9 461 3212',
    openingHours: 'Every day 10:00–19:00 (from their Facebook page)',
    websiteUrl: 'https://www.facebook.com/outofthebluecuracao',
    websiteLabel: 'See Out of the Blue on Facebook',
    highlightImg: `${base}fashion-media/ootb-store.jpg`,
    highlightCaption: 'Jewelry and local art inside the shop',
    heroImg: `${base}fashion-media/ootb-earrings.jpg`,
    heroTitle: 'Earrings from the shop',
    heroText: 'A jewelry photo from their public Facebook page.',
    quote: 'Unique jewelry and locally made products.',
    looks: [
      {
        img: `${base}fashion-media/ootb-bags.jpg`,
        tag: 'Gifts',
        title: 'Handmade bags',
        text: 'From their Facebook post (December 2022): handmade, one-of-a-kind bags, new in store.',
      },
      {
        img: `${base}fashion-media/ootb-bracelet.jpg`,
        tag: 'Jewelry',
        title: 'Pearl and leather',
        text: 'From their Facebook album The Pearl & Leather Collection, which they say is designed by Out of the Blue.',
      },
      {
        img: `${base}fashion-media/ootb-hammock.jpg`,
        tag: 'Gifts',
        title: 'Cotton hammock',
        text: 'Their Facebook post (December 2022) says the two-person hammocks are back, in natural cotton.',
      },
    ],
    visitBannerImg: `${base}fashion-media/ootb-store.jpg`,
    shopNote:
      'Hours and phone are from their Facebook page. A street number on the boulevard was not listed there.',
    lifestyleTitle: 'Beach wear, still in the shop',
    lifestyleText:
      'Their Facebook page also lists beach wear. This dress is one of the looks they share there.',
    lifestyleImg: `${base}fashion-media/ootb-lifestyle.jpg`,
    lifestyleMarkImg: `${base}fashion-media/ootb-teal-logo.png`,
  },
  {
    id: 'only-curacao',
    name: 'ONLY',
    area: 'Willemstad',
    partnerKicker: 'Blue Holiday Wave - Fashion Partner',
    listBlurb: 'Women’s looks at Mambo, Sambil, and Saliña Galleries.',
    intro:
      'ONLY is a clothing store. Sambil’s store page calls it a denim shop for women, at units L-110 and L-112 by the Caracasbaai Entrance. Their Facebook page lists Saliña galleries 102, and their own posts name both Saliña Galleries and Sambil.',
    hideVisitHeading: true,
    tagline: 'Denim · tops · women’s wear',
    logoLabel: 'ONLY',
    logoColor: '#c4a574',
    logoImg: `${base}fashion-media/logos/only-gold-3d.png?v=20261014i`,
    logoLarge: true,
    venue: 'Mambo, Sambil, and Saliña Galleries',
    address:
      'Their posts name Mambo and Sambil. Sambil is at Veeris 27, units L-110 and L-112. Other posts name Saliña Galleries.',
    phone: '+599 9 465 9771',
    websiteUrl: 'https://www.facebook.com/onlycuracao1',
    websiteLabel: 'See ONLY on Facebook',
    highlightImg: `${base}fashion-media/only-person-pool.jpg?v=20261014j`,
    highlightCaption: 'Floral set',
    heroImg: `${base}fashion-media/only-person-pool.jpg?v=20261014j`,
    heroTitle: 'Floral set',
    heroText: 'From an ONLY Curaçao post: a floral top and wide pants.',
    quote: 'Denim is our DNA.',
    looks: [
      {
        img: `${base}fashion-media/only-person-print-front.jpg?v=20261014j`,
        tag: 'Dress',
        title: 'Printed shirt dress',
        text: 'A long printed shirt dress, worn open over shorts.',
      },
      {
        img: `${base}fashion-media/only-person-print-back.jpg?v=20261014j`,
        tag: 'Dress',
        title: 'Printed shirt dress, back',
        text: 'The same long printed shirt dress, from the back.',
      },
      {
        img: `${base}fashion-media/only-person-cherry-front.jpg?v=20261014j`,
        tag: 'Dress',
        title: 'Cherry shirt dress',
        text: 'The cherry print shirt dress, from the front.',
      },
      {
        img: `${base}fashion-media/only-person-cherry-back.jpg?v=20261014j`,
        tag: 'Dress',
        title: 'Cherry shirt dress, back',
        text: 'The same cherry print dress, shown from the back.',
      },
    ],
    visitBannerImg: `${base}fashion-media/only-person-car.jpg?v=20261014j`,
    shopNote:
      'Quote and units are from sambil.cw/store/only. That page lists phone 5999 6790957. Facebook lists this mobile number, WhatsApp +599 9 524 3119, and no weekly hours (only “Open now”).',
    lifestyleTitle: 'Black top and printed pants',
    lifestyleText: 'A black sleeveless top with the red and black printed pants, by the water.',
    lifestyleImg: `${base}fashion-media/only-person-yacht.jpg?v=20261014j`,
  },
  {
    id: 'mayas-clothing',
    name: 'Mayas Clothing',
    area: 'Punda',
    partnerKicker: 'Blue Holiday Wave – Fashion Partner',
    listBlurb: "Women's fashion in the heart of Punda — 4.9 stars on Google.",
    intro:
      "Mayas Clothing is one of Punda's most loved women's boutiques, right on Prinsenstraat in the heart of historic Willemstad. Trending styles, holiday looks, and everyday island fashion — with nearly 50 Google reviews and a 4.9 rating, it's a local favourite.",
    hideVisitHeading: true,
    tagline: "Women's fashion · Punda · island style",
    logoLabel: 'MC',
    logoColor: '#c9a227',
    logoImg: '',
    venue: 'Punda, Willemstad',
    address: 'Prinsenstraat 80, Punda, Willemstad, Curaçao',
    openingHours: 'Mon–Thu 09:00–18:00 · Fri–Sat 09:00–18:30 · Closed Sunday',
    phone: '+599 9 465 7781',
    whatsapp: '59994657781',
    mapsEmbed: 'https://maps.google.com/maps?q=12.10482,-68.93221&z=16&output=embed&iwloc=',
    mapsUrl: 'https://maps.google.com/?q=Mayas+Clothing+Prinsenstraat+80+Punda+Willemstad+Curaçao',
    highlightImg: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
    highlightCaption: "Women's fashion in Punda",
    heroImg: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&q=80',
    heroTitle: "Punda's favourite women's boutique",
    heroText:
      "Mayas Clothing brings the latest trends to historic Punda — easy island pieces alongside bold holiday looks. Steps from the Handelskade and the floating bridge.",
    quote: 'Fashion that fits the island life.',
    looks: [
      {
        img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
        tag: 'Holiday',
        title: 'Holiday collection',
        text: 'Bright colours, easy fits, and statement pieces for the December season.',
      },
      {
        img: 'https://images.unsplash.com/photo-1529720317453-c8da503f2051?w=600&q=80',
        tag: 'Day',
        title: 'Daytime island style',
        text: 'Casual and smart — the kind of look that works from shopping to lunch.',
      },
      {
        img: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=600&q=80',
        tag: 'Evening',
        title: 'Evening edit',
        text: 'Dressed-up pieces for dinners and holiday gatherings in Punda.',
      },
    ],
    shopNote: "Located on Prinsenstraat — one of Punda's main shopping streets, a short walk from the Queen Emma Bridge.",
    lifestyleTitle: 'Shop Punda, dress the island',
    lifestyleText:
      "Prinsenstraat has the best boutique shopping in Willemstad — Mayas Clothing is one of its highlights. Pop in between exploring the colourful Handelskade and the historic downtown.",
    lifestyleImg: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?w=800&q=80',
  },
  {
    id: 'emilia-boutique',
    name: 'Emilia Boutique',
    area: 'Punda & Zuikertuin',
    partnerKicker: 'Blue Holiday Wave – Fashion Partner',
    listBlurb: 'Island swimwear, bikinis & resort wear — Punda & Zuikertuin.',
    intro:
      "Emilia Boutique is Curaçao's go-to for bikinis, resort wear, and island-style accessories. Located in Punda's historic shopping district with a second outlet at Zuikertuin Mall — the best place on the island to find the perfect holiday beachwear.",
    hideVisitHeading: true,
    tagline: 'Bikinis · resort wear · island accessories',
    logoLabel: 'EB',
    logoColor: '#3d7ea6',
    logoImg: 'https://logo.clearbit.com/emiliacuracao.com',
    venue: 'Punda & Zuikertuin Mall',
    address: 'Hanchi Snoa 11, Punda, Willemstad, Curaçao (+ Zuikertuin Mall)',
    openingHours: 'Mon–Sat — check store for current hours',
    phone: '+599 9 461 1171',
    whatsapp: '59994611171',
    websiteUrl: 'https://www.emiliacuracao.com',
    websiteLabel: 'emiliacuracao.com',
    mapsEmbed: 'https://maps.google.com/maps?q=12.10420,-68.93360&z=16&output=embed&iwloc=',
    mapsUrl: 'https://maps.google.com/?q=Emilia+Boutique+Hanchi+Snoa+11+Punda+Willemstad+Curaçao',
    highlightImg: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
    highlightCaption: 'Island swimwear & resort wear',
    heroImg: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
    heroTitle: 'The island swimwear destination',
    heroText:
      "Whether you need a bikini for Mambo Beach, a cover-up for Pietermaai, or the perfect resort look — Emilia Boutique has the island's best selection. Two locations for your convenience.",
    quote: 'Dressed for the island, from the island.',
    looks: [
      {
        img: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&q=80',
        tag: 'Swim',
        title: 'Holiday bikinis',
        text: 'The best selection of bikinis on the island — in store at Punda and Zuikertuin.',
      },
      {
        img: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&q=80',
        tag: 'Resort',
        title: 'Resort wear',
        text: 'Cover-ups, breezy dresses, and accessories for every beach day.',
      },
      {
        img: 'https://images.unsplash.com/photo-1559311745-d3aa09e35e95?w=600&q=80',
        tag: 'Accessories',
        title: 'Holiday accessories',
        text: 'Bags, jewellery, and the finishing touches that complete the look.',
      },
    ],
    shopNote: 'Two locations: Hanchi Snoa 11 in Punda and a second outlet at Zuikertuin Mall.',
    lifestyleTitle: 'From the beach to the boulevard',
    lifestyleText:
      "Pick up your holiday look at Emilia and head straight to the beach — the best swimwear boutique in Willemstad, loved by locals and visitors alike.",
    lifestyleImg: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=80',
  },
  {
    id: 'soho-boutique',
    name: 'SOHO Boutique',
    area: 'Rif Fort · Otrobanda',
    partnerKicker: 'Blue Holiday Wave – Fashion Partner',
    listBlurb: 'Designer to daytime — Rif Fort & Renaissance Mall.',
    intro:
      "SOHO Boutique is Otrobanda's style destination — located inside the iconic Rif Fort at the Renaissance Mall. From designer dresses to smart casual, SOHO has every look for the holiday season. Steps from the Renaissance Wind Creek Resort and the waterfront.",
    hideVisitHeading: true,
    tagline: 'Designer · casual · Rif Fort',
    logoLabel: 'SH',
    logoColor: '#1a1a2e',
    logoImg: 'https://logo.clearbit.com/boutiquesoho.com',
    venue: 'Renaissance Mall & Rif Fort',
    address: 'Baden Powellweg 1, Otrobanda, Willemstad, Curaçao',
    openingHours: 'Mon–Sat 09:30–18:30',
    phone: '+599 9 461 1114',
    whatsapp: '59994611114',
    websiteUrl: 'https://www.shoprenaissancecuracao.com/soho-boutique/',
    websiteLabel: 'shoprenaissancecuracao.com',
    mapsEmbed: 'https://maps.google.com/maps?q=12.1079,-68.9354&z=16&output=embed&iwloc=',
    mapsUrl: 'https://maps.google.com/?q=Rif+Fort+Renaissance+Mall+Baden+Powellweg+1+Otrobanda+Willemstad+Curaçao',
    highlightImg: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=600&q=80',
    highlightCaption: 'Designer fashion at Rif Fort',
    heroImg: 'https://images.unsplash.com/photo-1529720317453-c8da503f2051?w=800&q=80',
    heroTitle: "Otrobanda's fashion destination",
    heroText:
      "SOHO Boutique sits inside the historic Rif Fort — one of the most striking shopping settings in the Caribbean. Find designer dresses, business looks, and casual holiday outfits all under one roof.",
    quote: "It's not about the clothes, it's about the image.",
    looks: [
      {
        img: 'https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?w=600&q=80',
        tag: 'Designer',
        title: 'Holiday dresses',
        text: 'Dressy looks for dinners, openings, and December events in Willemstad.',
      },
      {
        img: 'https://images.unsplash.com/photo-1529720317453-c8da503f2051?w=600&q=80',
        tag: 'Casual',
        title: 'Smart casual',
        text: 'From daytime shopping to waterfront dinners — versatile pieces that do both.',
      },
      {
        img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
        tag: 'Accessories',
        title: 'Complete the look',
        text: 'Jewellery, bags, and accessories to finish your holiday wardrobe.',
      },
    ],
    shopNote: 'Inside the Rif Fort at the Renaissance Mall — free parking available. Mon–Sat 09:30–18:30.',
    lifestyleTitle: 'Shop inside a historic fort',
    lifestyleText:
      "The Rif Fort is one of the most beautiful shopping destinations in the Caribbean — and SOHO is its fashion highlight. After shopping, the waterfront bars and restaurants are right outside.",
    lifestyleImg: 'https://images.unsplash.com/photo-1529720317453-c8da503f2051?w=800&q=80',
  },
  {
    id: 'victorias-secret-sambil',
    name: "Victoria's Secret",
    area: 'Sambil Mall',
    partnerKicker: 'Blue Holiday Wave – Fashion Partner',
    listBlurb: 'Lingerie, beauty, fragrance & accessories — just opened at Sambil.',
    intro:
      "Victoria's Secret is now open at Sambil Shopping Mall — the iconic global brand bringing its full range of lingerie, sleepwear, beauty, perfume, and accessories to Curaçao. Located at unit L-35 near the Cas Abou Entrance / Punda Square. Grand opening: 19 November 2026.",
    hideVisitHeading: true,
    tagline: 'Lingerie · beauty · fragrance · accessories',
    logoLabel: 'VS',
    logoColor: '#1a1a2e',
    logoImg: 'https://www.victoriassecret.com/images/vsweb/8f9bb269-388b-4037-9391-e4e079576c6e/VS_logoSmall_black.svg',
    logoOnDark: true,
    logoLarge: true,
    venue: 'Sambil Shopping Mall',
    address: "Veeris #27, Willemstad, Curaçao — Unit L-35, Cas Abou Entrance / Punda Square",
    openingHours: 'Mon–Thu 10:00–20:00 · Fri–Sat 10:00–21:00 · Sun 12:00–20:00',
    phone: '+599 9 735 0002',
    whatsapp: '59997353131',
    websiteUrl: 'https://www.sambil.cw/store/victoria%E2%80%99s-secret',
    websiteLabel: "Victoria's Secret at Sambil",
    mapsEmbed: 'https://maps.google.com/maps?q=12.0808,-68.9018&z=16&output=embed&iwloc=',
    mapsUrl: "https://maps.google.com/?q=Sambil+Shopping+Mall+Veeris+27+Willemstad+Curaçao",
    highlightImg: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80',
    highlightCaption: 'Fragrances & beauty at Sambil',
    heroImg: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&q=80',
    heroTitle: 'The iconic brand is finally here',
    heroText:
      "Victoria's Secret brings its legendary holiday collections to Curaçao — lingerie, sleepwear, fragrances, and the must-have gift sets that sell out every December. Find them now at Sambil.",
    quote: 'Everything to emphasise your outstanding look.',
    looks: [
      {
        img: 'https://images.unsplash.com/photo-1596462502278-27bfdc403a46?w=600&q=80',
        tag: 'Lingerie',
        title: 'Holiday lingerie',
        text: 'Signature styles and seasonal collections — in store at unit L-35.',
      },
      {
        img: 'https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=600&q=80',
        tag: 'Beauty',
        title: 'Fragrance & beauty',
        text: 'The bestselling perfumes and gift sets — perfect for the holiday season.',
      },
      {
        img: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=600&q=80',
        tag: 'Accessories',
        title: 'Accessories & gifts',
        text: 'From tote bags to cosy sets — the most giftable items in the mall.',
      },
    ],
    visitBannerImg: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80',
    shopNote:
      "Brand new at Sambil — grand opening was 19 November 2026. WhatsApp +5999 735 3131 for stock questions.",
    lifestyleTitle: 'The gift everyone wants',
    lifestyleText:
      "December at Victoria's Secret means limited-edition gift sets, holiday scents, and the pieces that always sell out. Get there early.",
    lifestyleImg: 'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?w=800&q=80',
  },
]

export function getFashionStore(id: string | undefined) {
  if (!id) return undefined
  return fashionStores.find((s) => s.id === id)
}
