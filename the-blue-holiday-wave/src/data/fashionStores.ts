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

import { fashionStoresMore } from './fashionStoresMore'

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
    phone: '+599 9 735 3131',
    whatsapp: '59997353131',
    websiteUrl: 'https://www.zara.com/cw/',
    websiteLabel: 'Shop at zara.com/cw',
    mapsEmbed: 'https://maps.google.com/maps?q=12.13458,-68.95730&z=16&output=embed&iwloc=',
    mapsUrl: 'https://maps.google.com/?q=Sambil+Shopping+Mall+Veeris+27+Willemstad+Curaçao',
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
      'Hours above are from ZARA’s official store page. Mall-wide hours on sambil.cw may differ — check both before you go. The phone and WhatsApp number is Sambil’s published number (sambil.cw lists it as WhatsApp only).',
    lifestyleTitle: 'Lunch with friends, still dressed up',
    lifestyleText:
      'Holiday on the island is as much about the table as the wardrobe — easy looks that move from shopping to a long, sunny lunch without a change.',
    lifestyleImg: `${base}fashion-media/zara-sambil-store.jpg`,
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
    mapsEmbed: 'https://maps.google.com/maps?q=12.08665,-68.89874&z=16&output=embed&iwloc=',
    mapsUrl: 'https://maps.google.com/?q=Out+of+the+Blue+Mambo+Beach+Boulevard+Willemstad+Curaçao',
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
    whatsapp: '59995243119',
    openingHours:
      'Sambil: Mon–Thu 10:00–20:00 · Fri–Sat 10:00–21:00 · Sun 12:00–20:00 · Saliña Galleries: Mon–Sat 10:00–18:00',
    websiteUrl: 'https://www.facebook.com/onlycuracao1',
    websiteLabel: 'See ONLY on Facebook',
    mapsEmbed: 'https://maps.google.com/maps?q=12.13458,-68.95730&z=16&output=embed&iwloc=',
    mapsUrl: 'https://maps.google.com/?q=Sambil+Shopping+Mall+Veeris+27+Willemstad+Curaçao',
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
      'Quote and units are from sambil.cw/store/only. That page lists phone 5999 6790957 and the Sambil hours above. Facebook lists this mobile number and WhatsApp +599 9 524 3119. Saliña Galleries hours come from their Facebook listing.',
    lifestyleTitle: 'Black top and printed pants',
    lifestyleText: 'A black sleeveless top with the red and black printed pants, by the water.',
    lifestyleImg: `${base}fashion-media/only-person-yacht.jpg?v=20261014j`,
  },
  {
    id: 'mayas-clothing',
    name: 'Mayas Clothing',
    area: 'Punda',
    partnerKicker: 'Blue Holiday Wave – Fashion Partner',
    listBlurb: 'Sneakers, slides, and clothing in the heart of Punda — 4.9 stars on Google.',
    intro:
      "Mayas is a shoes and clothing store on Prinsenstraat in the heart of historic Willemstad. Exclusive sneakers, Yeezy slides, and trending clothing — with nearly 50 Google reviews, a 4.9 rating, and a layaway plan if you can't pay in full.",
    hideVisitHeading: true,
    tagline: 'Shoes & sneakers · clothing · Punda',
    logoLabel: 'MC',
    logoColor: '#c9a227',
    logoImg: `${base}fashion-media/logos/mayas-clothing-gold.png?v=20261126`,
    logoLarge: true,
    venue: 'Punda, Willemstad',
    address: 'Prinsenstraat 80, Punda, Willemstad, Curaçao',
    openingHours: 'Mon–Thu 09:00–18:00 · Fri–Sat 09:00–18:30 · Closed Sunday',
    phone: '+599 9 465 7781',
    whatsapp: '59994657781',
    websiteUrl: 'https://www.instagram.com/mayasclothingcw/',
    websiteLabel: 'See Mayas on Instagram',
    mapsEmbed: 'https://maps.google.com/maps?q=12.10482,-68.93221&z=16&output=embed&iwloc=',
    mapsUrl: 'https://maps.google.com/?q=Mayas+Clothing+Prinsenstraat+80+Punda+Willemstad+Curaçao',
    highlightImg: `${base}fashion-media/mayas-clothing-yeezy-slides.jpg`,
    highlightCaption: 'Yeezy Slides, in store',
    heroImg: `${base}fashion-media/mayas-clothing-sneaker-wall.jpg`,
    heroTitle: 'Exclusive sneakers in Punda',
    heroText:
      "Mayas stocks sneakers you don't see everywhere — like the Sacai x Nike LD Waffle — next to its clothing. A short walk from the Handelskade and the Queen Emma Bridge.",
    quote: 'Shoes & clothing, right in the heart of Punda.',
    looks: [
      {
        img: `${base}fashion-media/mayas-clothing-jordan-shoebox.jpg`,
        tag: 'Sneakers',
        title: 'Fresh pairs in the box',
        text: 'Try them on in store — from their Facebook post about the layaway plan.',
      },
      {
        img: `${base}fashion-media/mayas-clothing-cargo.jpg`,
        tag: 'Clothing',
        title: 'Cargo collection',
        text: 'Cargo pants with clean white sneakers, from their Instagram cargo post.',
      },
      {
        img: `${base}fashion-media/mayas-clothing-earth-tones.jpg`,
        tag: 'Summer',
        title: 'Earth tones',
        text: 'Relaxed tees in earth tones for summer, from their Instagram.',
      },
    ],
    shopNote:
      "Located on Prinsenstraat — one of Punda's main shopping streets, a short walk from the Queen Emma Bridge. Ask in store about the layaway plan.",
    lifestyleTitle: 'Sneakers, slides, and street style',
    lifestyleText:
      'Prinsenstraat has some of the best shopping in Willemstad — Mayas is the stop for sneakers, slides, and clothing. Pop in between exploring the colourful Handelskade and historic downtown.',
    lifestyleImg: `${base}fashion-media/mayas-clothing-store-rack.jpg`,
  },
  {
    id: 'emilia-boutique',
    name: 'Emilia Boutique',
    area: 'Punda & Zuikertuin',
    partnerKicker: 'Blue Holiday Wave – Fashion Partner',
    listBlurb: 'Dresses, swimwear & party looks — Punda & Zuikertuin.',
    intro:
      "Emilia Boutique is a women's fashion and swimwear store in Punda, with a second shop at Zuikertuin Mall. Dresses, party and concert outfits, bikinis, cover-ups, and beach essentials — new collections land often.",
    hideVisitHeading: true,
    tagline: 'Dresses · swimwear · party looks',
    logoLabel: 'EB',
    logoColor: '#3d7ea6',
    logoImg: `${base}fashion-media/logos/emilia-boutique-gold.png?v=20261126`,
    logoLarge: true,
    venue: 'Punda & Zuikertuin Mall',
    address: 'Hanchi Snoa 11, Punda, Willemstad, Curaçao (+ Zuikertuin Mall)',
    openingHours: 'Punda: Mon–Sat 09:00–18:00 · Zuikertuin Mall: Mon–Sat 09:00–19:00 · Closed Sunday',
    phone: '+599 9 461 1171',
    whatsapp: '59994611171',
    websiteUrl: 'https://www.emiliacuracao.com',
    websiteLabel: 'emiliacuracao.com',
    mapsEmbed: 'https://maps.google.com/maps?q=12.10569,-68.93342&z=16&output=embed&iwloc=',
    mapsUrl: 'https://maps.google.com/?q=Emilia+Boutique+Hanchi+Snoa+11+Punda+Willemstad+Curaçao',
    highlightImg: `${base}fashion-media/emilia-boutique-print-dress.jpg`,
    highlightCaption: 'Print dresses and party looks',
    heroImg: `${base}fashion-media/emilia-boutique-jumpsuit.jpg`,
    heroTitle: 'Dresses for every plan',
    heroText:
      "Print dresses, jumpsuits, and party looks from Emilia's Instagram — plus bikinis, cover-ups, and matching pareos in store. Two shops: Punda and Zuikertuin Mall.",
    quote: 'All the latest fashion trends from around the globe.',
    looks: [
      {
        img: `${base}fashion-media/emilia-boutique-print-dress.jpg`,
        tag: 'Dresses',
        title: 'Print dress',
        text: 'A bold print dress, shared on Emilia’s Instagram.',
      },
      {
        img: `${base}fashion-media/emilia-boutique-jumpsuit.jpg`,
        tag: 'Jumpsuit',
        title: 'Orange for King’s Day',
        text: 'From the Zuikertuin Mall post about a jumpsuit picked for King’s Day.',
      },
      {
        img: `${base}fashion-media/emilia-boutique-satin-top.jpg`,
        tag: 'Party',
        title: 'Festival edit',
        text: 'From their post about sequin shorts and skirts for the Tumba festival.',
      },
    ],
    shopNote:
      'Two shops: Hanchi Snoa 11 in Punda and Emilia Too at Zuikertuin Mall. Their November posts also show swimwear, bikinis, and cover-ups.',
    lifestyleTitle: 'Holiday parties and beach days',
    lifestyleText:
      'Their November posts mix party dresses and concert outfits with swimwear, bikinis, and matching pareos for the beach.',
    lifestyleImg: `${base}fashion-media/emilia-boutique-satin-top.jpg`,
  },
  {
    id: 'soho-boutique',
    name: 'SOHO Boutique',
    area: 'Rif Fort · Otrobanda',
    partnerKicker: 'Blue Holiday Wave – Fashion Partner',
    listBlurb: 'Designer to daytime — Rif Fort & Renaissance Mall.',
    intro:
      "SOHO Boutique is a women's fashion boutique at the Renaissance Mall in Otrobanda, inside the Rif Fort. From designer dresses to smart casual, jeans, swimsuits, shoes, and accessories — every look for the holiday season, steps from the waterfront.",
    hideVisitHeading: true,
    tagline: 'Designer · casual · Rif Fort',
    logoLabel: 'SH',
    logoColor: '#1a1a2e',
    logoImg: `${base}fashion-media/logos/soho-boutique-gold.png?v=20261126`,
    logoLarge: true,
    venue: 'Renaissance Mall & Rif Fort',
    address: 'Renaissance Mall #210, Baden Powellweg 1, Otrobanda, Willemstad, Curaçao',
    openingHours: 'Mon–Sat 09:30–18:30',
    phone: '+599 9 461 1114',
    whatsapp: '59995235880',
    websiteUrl: 'https://www.shoprenaissancecuracao.com/soho-boutique/',
    websiteLabel: 'shoprenaissancecuracao.com',
    mapsEmbed: 'https://maps.google.com/maps?q=12.1079,-68.9354&z=16&output=embed&iwloc=',
    mapsUrl: 'https://maps.google.com/?q=Rif+Fort+Renaissance+Mall+Baden+Powellweg+1+Otrobanda+Willemstad+Curaçao',
    highlightImg: `${base}fashion-media/soho-boutique-party-dress.jpg`,
    highlightCaption: 'Party dresses at SOHO',
    heroImg: `${base}fashion-media/soho-boutique-store.jpg`,
    heroTitle: "Otrobanda's fashion destination",
    heroText:
      'SOHO Boutique sits inside the historic Rif Fort at the Renaissance Mall. Find designer dresses, business outfits, and casual holiday looks all under one roof.',
    quote: "It's not about the clothes, it's about the image.",
    looks: [
      {
        img: `${base}fashion-media/soho-boutique-party-dress.jpg`,
        tag: 'Party',
        title: 'Party dresses',
        text: 'Just in: party dresses, shared on their Instagram.',
      },
      {
        img: `${base}fashion-media/soho-boutique-weekend-set.jpg`,
        tag: 'Weekend',
        title: 'Weekend line-up',
        text: 'A black skirt and top set with gold accessories, from their weekend post.',
      },
      {
        img: `${base}fashion-media/soho-boutique-rack.jpg`,
        tag: 'In store',
        title: 'Prints and lace',
        text: 'Floral prints and lace pieces on the racks at SOHO.',
      },
    ],
    shopNote: 'Inside the Rif Fort at the Renaissance Mall — free parking available. Mon–Sat 09:30–18:30.',
    lifestyleTitle: 'Shop inside a historic fort',
    lifestyleText:
      'The Rif Fort is one of the most beautiful shopping spots in Curaçao — and SOHO is its fashion stop. After shopping, the waterfront bars and restaurants are right outside.',
    lifestyleImg: `${base}fashion-media/soho-boutique-rack.jpg`,
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
    logoImg: `${base}fashion-media/logos/victorias-secret-gold.png?v=20261126`,
    logoLarge: true,
    venue: 'Sambil Shopping Mall',
    address: "Veeris #27, Willemstad, Curaçao — Unit L-35, Cas Abou Entrance / Punda Square",
    openingHours: 'Mon–Thu 10:00–20:00 · Fri–Sat 10:00–21:00 · Sun 12:00–20:00',
    phone: '+599 9 735 0002',
    whatsapp: '59997353131',
    websiteUrl: 'https://www.sambil.cw/store/victoria%E2%80%99s-secret',
    websiteLabel: "Victoria's Secret at Sambil",
    mapsEmbed: 'https://maps.google.com/maps?q=12.13458,-68.95730&z=16&output=embed&iwloc=',
    mapsUrl: "https://maps.google.com/?q=Sambil+Shopping+Mall+Veeris+27+Willemstad+Curaçao",
    highlightImg: `${base}fashion-media/vs/vs-lingerie-3.jpg`,
    highlightCaption: 'Lingerie & sleepwear at Sambil',
    heroImg: `${base}fashion-media/vs/vs-lingerie-1.jpg`,
    heroTitle: 'The iconic brand is finally here',
    heroText:
      "Victoria's Secret is now open at Sambil — the full collection of lingerie, sleepwear, fragrances, and holiday gift sets. Find them at unit L-35 near the Cas Abou Entrance.",
    quote: 'Everything to emphasise your outstanding look.',
    looks: [
      {
        img: `${base}fashion-media/vs/vs-lingerie-4.jpg`,
        tag: 'Lingerie',
        title: 'Holiday lingerie',
        text: 'Signature lace styles and seasonal collections — in store at unit L-35.',
      },
      {
        img: `${base}fashion-media/vs/vs-lingerie-2.jpg`,
        tag: 'Sleepwear',
        title: 'Sleepwear & sets',
        text: 'Babydolls, teddies and matching sets — perfect holiday gifts.',
      },
      {
        img: `${base}fashion-media/vs/vs-lingerie-5.jpg`,
        tag: 'Accessories',
        title: 'Gift sets & beauty',
        text: 'The bestselling perfumes and gift sets — perfect for the holiday season.',
      },
    ],
    visitBannerImg: `${base}fashion-media/vs/vs-lingerie-6.jpg`,
    shopNote:
      "Brand new at Sambil — grand opening was 19 November 2026. WhatsApp +5999 735 3131 for stock questions.",
    lifestyleTitle: 'The gift everyone wants',
    lifestyleText:
      "December at Victoria's Secret means limited-edition gift sets, holiday scents, and the pieces that always sell out. Get there early.",
    lifestyleImg: `${base}fashion-media/vs/vs-lingerie-3.jpg`,
  },
  ...fashionStoresMore,
]

export function getFashionStore(id: string | undefined) {
  if (!id) return undefined
  return fashionStores.find((s) => s.id === id)
}
