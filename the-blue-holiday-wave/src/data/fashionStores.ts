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
  /** Official store or brand URL */
  websiteUrl?: string
  websiteLabel?: string
  /** WhatsApp number in international format without +, e.g. 59997881949 */
  whatsapp?: string
  /** Google Maps embed src URL */
  mapsEmbed?: string
  /** Google Maps directions URL */
  mapsUrl?: string
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
    whatsapp: '59997000000',
    mapsEmbed: 'https://maps.google.com/maps?q=12.0808,-68.9018&z=16&output=embed&iwloc=',
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
    whatsapp: '59994613212',
    mapsEmbed: 'https://maps.google.com/maps?q=12.0776,-68.8912&z=16&output=embed&iwloc=',
    mapsUrl: 'https://maps.google.com/?q=Mambo+Beach+Boulevard+Willemstad+Curaçao',
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
    whatsapp: '59994659771',
    mapsEmbed: 'https://maps.google.com/maps?q=12.0808,-68.9018&z=16&output=embed&iwloc=',
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
      'Quote and units are from sambil.cw/store/only. That page lists phone 5999 6790957. Facebook lists this mobile number, WhatsApp +599 9 524 3119, and no weekly hours (only “Open now”).',
    lifestyleTitle: 'Black top and printed pants',
    lifestyleText: 'A black sleeveless top with the red and black printed pants, by the water.',
    lifestyleImg: `${base}fashion-media/only-person-yacht.jpg?v=20261014j`,
  },
  {
    id: 'atelier-salina',
    name: 'Atelier Salina',
    area: 'Punda',
    listBlurb: 'Island linen and gold jewelry for town evenings.',
    intro:
      'Island-made linen and soft gold jewelry. Quiet pieces for long evenings in town.',
    tagline: 'Linen · gold · evening light',
    logoLabel: 'AS',
    logoColor: '#c9a227',
    logoImg: `${base}fashion-media/logos/atelier-salina.png`,
    highlightImg: `${base}fashion-media/look-1.jpg`,
    highlightCaption: 'Golden hour linen set',
    heroImg: `${base}fashion-media/hero.jpg`,
    heroTitle: 'Dress for the light, not the clock',
    heroText:
      'Holiday season moves from bright noon to soft gold. Easy fabrics, clear color — the wardrobe that follows the sun.',
    quote: 'Two strong pieces. Rotate the shoes. Let the island do the glow.',
    looks: [
      {
        img: `${base}fashion-media/look-1.jpg`,
        tag: 'Day',
        title: 'Golden hour linen',
        text: 'Soft sand tones, open sleeves, a gold cuff — Willemstad evenings.',
      },
      {
        img: `${base}fashion-media/look-2.jpg`,
        tag: 'Transfer',
        title: 'Pool-to-dinner dress',
        text: 'One piece from midday shade to a late table in Punda.',
      },
      {
        img: `${base}fashion-media/look-3.jpg`,
        tag: 'Night',
        title: 'Terrace after dark',
        text: 'Dark silk, light jewelry, island breeze.',
      },
    ],
    shopNote: 'Start with linen and local jewelry. Add one evening piece you can wear twice.',
    lifestyleTitle: 'After dark, still easy',
    lifestyleText:
      'Openings and long dinners — not a new outfit every night. Pack two hero pieces and keep the palette calm.',
    lifestyleImg: `${base}fashion-media/night.jpg`,
  },
  {
    id: 'casa-mar',
    name: 'Casa Mar Boutique',
    area: 'Pietermaai',
    listBlurb: 'Breezy resort dresses and statement sandals.',
    intro:
      'Resort wear with a city edge — swim covers, breezy dresses, and statement sandals.',
    tagline: 'Resort · city · sea air',
    logoLabel: 'CM',
    logoColor: '#3d7ea6',
    logoImg: `${base}fashion-media/logos/casa-mar.png`,
    highlightImg: `${base}fashion-media/look-2.jpg`,
    highlightCaption: 'Pool-to-dinner dress',
    heroImg: `${base}fashion-media/look-2.jpg`,
    heroTitle: 'From the pool to Pietermaai',
    heroText:
      'Pieces that travel with you: shade at midday, dinner after dark, no hotel change needed.',
    quote: 'One dress. Two moments. Zero rush.',
    looks: [
      {
        img: `${base}fashion-media/look-2.jpg`,
        tag: 'Day',
        title: 'Pool cover that stays',
        text: 'Light fabric, strong cut — works past the last swim.',
      },
      {
        img: `${base}fashion-media/boutique.jpg`,
        tag: 'Shop',
        title: 'In-store edit',
        text: 'Sandals, wraps, and the dress you wear twice this week.',
      },
      {
        img: `${base}fashion-media/night.jpg`,
        tag: 'Night',
        title: 'Street-light glow',
        text: 'Same silhouette, darker tone — ready for Pietermaai.',
      },
    ],
    shopNote: 'Ask for the holiday capsule — limited sizes for December weekends.',
    lifestyleTitle: 'Sea air, city nights',
    lifestyleText:
      'Casa Mar is for guests who live between the water and the next table.',
    lifestyleImg: `${base}fashion-media/boutique.jpg`,
  },
  {
    id: 'noir-otro',
    name: 'Noir Otrobanda',
    area: 'Otrobanda',
    listBlurb: 'Evening wear and sharp tailoring for nights out.',
    intro:
      'Evening wear and sharp tailoring for openings, dinners, and December nights out.',
    tagline: 'Night · silk · sharp lines',
    logoLabel: 'NO',
    logoColor: '#8b2344',
    logoImg: `${base}fashion-media/logos/noir-otro.png`,
    highlightImg: `${base}fashion-media/look-3.jpg`,
    highlightCaption: 'Terrace after dark',
    heroImg: `${base}fashion-media/night.jpg`,
    heroTitle: 'Built for Otrobanda evenings',
    heroText:
      'Dark silk, clean lines, jewelry that catches terrace light — collection for the night shift of the holidays.',
    quote: 'The outfit stays quiet so the night can talk.',
    looks: [
      {
        img: `${base}fashion-media/look-3.jpg`,
        tag: 'Night',
        title: 'Terrace silk',
        text: 'Soft drape, strong presence under warm lights.',
      },
      {
        img: `${base}fashion-media/hero.jpg`,
        tag: 'Event',
        title: 'Opening night',
        text: 'One look that photographs well and still feels easy.',
      },
      {
        img: `${base}fashion-media/look-1.jpg`,
        tag: 'Day-after',
        title: 'Soft return',
        text: 'Lighter tones for brunch after a late night.',
      },
    ],
    shopNote: 'Book a 20-minute fitting for holiday events — walk-ins welcome weekends.',
    lifestyleTitle: 'Stay out later',
    lifestyleText:
      'Noir is for the second dinner, the late drink, and the walk home through lit streets.',
    lifestyleImg: `${base}fashion-media/look-3.jpg`,
  },
]

export function getFashionStore(id: string | undefined) {
  if (!id) return undefined
  return fashionStores.find((s) => s.id === id)
}
