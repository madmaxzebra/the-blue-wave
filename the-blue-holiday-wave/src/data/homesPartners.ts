export type PartnerItem = {
  img: string
  tag: string
  title: string
  text: string
}

export type PartnerProfile = {
  id: string
  name: string
  area: string
  intro: string
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
  items: PartnerItem[]
  itemsHeading: string
  visitLabel: string
  visitTitle: string
  shopNote: string
  lifestyleLabel: string
  lifestyleTitle: string
  lifestyleText: string
  lifestyleImg: string
  collectionLabel: string
  /** Street address */
  address?: string
  /** Published opening hours */
  hours?: string
  /** Phone number, formatted for display */
  phone?: string
  /** WhatsApp number in international format without +, e.g. 59997881949 */
  whatsapp?: string
  /** Official website URL */
  websiteUrl?: string
  /** Link label, defaults to "Visit website" */
  websiteLabel?: string
  /** Google Maps embed src URL (no API key needed with maps.google.com embed format) */
  mapsEmbed?: string
  /** Google Maps directions URL for the "Open in Maps" button */
  mapsUrl?: string
}

const base = import.meta.env.BASE_URL

export const homesPartners: PartnerProfile[] = [
  {
    id: 'remax-bon-bini',
    name: 'RE/MAX Bon Bini',
    area: 'Jan Thiel',
    intro:
      "Curaçao's largest real estate office — buying, selling, and renting island properties since 1991. From cozy apartments to luxury beachfront villas, the RE/MAX Bon Bini team guides you through every step.",
    tagline: 'Buy · sell · rent island properties',
    logoLabel: 'RE',
    logoColor: '#CC0000',
    logoImg: 'https://logo.clearbit.com/realestate-curacao.com',
    highlightImg: `${base}homes-media/villa-1.jpg`,
    highlightCaption: 'Tropical villa with pool',
    heroImg: `${base}homes-media/hero.jpg`,
    heroTitle: 'Your island, your home',
    heroText:
      "From the first viewing to the keys in your hand — RE/MAX Bon Bini is the island's most trusted real-estate partner for buyers, sellers, and investors.",
    quote: 'The island has the right home for you. Let us find it.',
    itemsHeading: 'What they offer',
    items: [
      {
        img: `${base}homes-media/villa-1.jpg`,
        tag: 'Buy',
        title: 'Holiday villas & homes',
        text: 'From waterfront estates to hillside retreats — full portfolio at realestate-curacao.com.',
      },
      {
        img: `${base}homes-media/villa-2.jpg`,
        tag: 'Rent',
        title: 'Short & long stay',
        text: 'Furnished apartments and holiday homes available from one week.',
      },
      {
        img: `${base}homes-media/interior.jpg`,
        tag: 'Invest',
        title: 'Investment guidance',
        text: 'Expert advice on ROI, rental yields, and island market trends.',
      },
    ],
    visitLabel: 'Real estate agency',
    visitTitle: 'Visit RE/MAX Bon Bini',
    shopNote: 'Office open Mon–Fri 9:00–17:00. Walk-in welcome — ask for a holiday portfolio viewing.',
    lifestyleLabel: 'Island living',
    lifestyleTitle: 'Find your place in the sun',
    lifestyleText:
      'Whether you want to wake up to harbour light in Willemstad or trade winds at Jan Thiel — RE/MAX Bon Bini has the listing.',
    lifestyleImg: `${base}homes-media/terrace.jpg`,
    collectionLabel: 'Real estate · Holiday season',
    address: 'Eden Shopping Mall, Caracasbaaiweg 280 #13, Jan Thiel, Curaçao',
    hours: 'Mon–Fri 09:00–17:00',
    phone: '+599 9 843 9770',
    whatsapp: '59998439770',
    websiteUrl: 'https://www.realestate-curacao.com',
    websiteLabel: 'realestate-curacao.com',
    mapsEmbed: 'https://maps.google.com/maps?q=12.0825,-68.8995&z=15&output=embed&iwloc=',
    mapsUrl: 'https://maps.google.com/?q=Eden+Shopping+Mall+Caracasbaaiweg+280+Jan+Thiel+Curaçao',
  },
  {
    id: 'sothebys-curacao',
    name: "Curaçao Sotheby's International Realty",
    area: 'Willemstad',
    intro:
      "The island's gateway to luxury real estate worldwide. Ocean-view condos, beachfront properties, and waterfront villas — presented with the global prestige of the Sotheby's brand.",
    tagline: 'Luxury · oceanfront · global reach',
    logoLabel: "S'",
    logoColor: '#002B5C',
    logoImg: 'https://logo.clearbit.com/sothebysrealty.com',
    highlightImg: `${base}homes-media/villa-2.jpg`,
    highlightCaption: 'Oceanfront villa',
    heroImg: `${base}homes-media/villa-3.jpg`,
    heroTitle: 'Luxury real estate on the island',
    heroText:
      "Curaçao Sotheby's connects island buyers and sellers with a global network of discerning clients — your property presented to the world.",
    quote: 'Extraordinary homes deserve extraordinary presentation.',
    itemsHeading: 'What they offer',
    items: [
      {
        img: `${base}homes-media/villa-3.jpg`,
        tag: 'Luxury',
        title: 'Waterfront estates',
        text: 'Exclusive listings from Punda to Jan Thiel — with ocean views and private pools.',
      },
      {
        img: `${base}homes-media/interior.jpg`,
        tag: 'Concierge',
        title: 'White-glove service',
        text: 'From legal checks to interior styling — handled from start to finish.',
      },
      {
        img: `${base}homes-media/terrace.jpg`,
        tag: 'Global',
        title: 'International buyers',
        text: 'Connecting island properties to buyers from Europe, the US, and beyond.',
      },
    ],
    visitLabel: 'Luxury real estate',
    visitTitle: "Visit Sotheby's Curaçao",
    shopNote: 'Open Mon–Fri 08:00–17:00. Private viewings available on request.',
    lifestyleLabel: 'Prestige',
    lifestyleTitle: 'The finest addresses on the island',
    lifestyleText:
      "From historic Willemstad townhouses to clifftop villas — Sotheby's knows where the best properties are.",
    lifestyleImg: `${base}homes-media/villa-2.jpg`,
    collectionLabel: 'Luxury real estate · Holiday season',
    address: 'Caracasbaaiweg 149-F, Willemstad, Curaçao',
    hours: 'Mon–Fri 08:00–17:00',
    phone: '+599 9 737 0104',
    whatsapp: '59997370104',
    websiteUrl: 'https://www.sothebysrealty.com',
    websiteLabel: 'sothebysrealty.com',
    mapsEmbed: 'https://maps.google.com/maps?q=12.0858,-68.8982&z=15&output=embed&iwloc=',
    mapsUrl: 'https://maps.google.com/?q=Caracasbaaiweg+149-F+Willemstad+Curaçao',
  },
  {
    id: 'century21-curacao',
    name: 'CENTURY 21 #1 Real Estate',
    area: 'Willemstad',
    intro:
      "Curaçao's CENTURY 21 franchise has been guiding buyers, sellers, and renters since 1971. From single-family homes and condos to new construction and investment properties — island expertise backed by a global brand.",
    tagline: 'Buy · sell · invest since 1971',
    logoLabel: 'C21',
    logoColor: '#6B4F1A',
    logoImg: 'https://logo.clearbit.com/century21numberone.com',
    highlightImg: `${base}homes-media/villa-1.jpg`,
    highlightCaption: 'Tropical family home',
    heroImg: `${base}homes-media/hero.jpg`,
    heroTitle: 'Half a century of island real estate',
    heroText:
      'From starter homes to investment portfolios — the CENTURY 21 Curaçao team brings deep local knowledge and a global network.',
    quote: 'Real estate is local. Our network is global.',
    itemsHeading: 'What they offer',
    items: [
      {
        img: `${base}homes-media/villa-1.jpg`,
        tag: 'Sale',
        title: 'Homes for every budget',
        text: 'Starter homes, family residences, and holiday villas across the island.',
      },
      {
        img: `${base}homes-media/interior.jpg`,
        tag: 'New build',
        title: 'New construction projects',
        text: 'Pick your plot, choose your finishes — CENTURY 21 guides the full journey.',
      },
      {
        img: `${base}homes-media/villa-2.jpg`,
        tag: 'Rental',
        title: 'Rental management',
        text: 'Holiday and long-term rental management with full service.',
      },
    ],
    visitLabel: 'Real estate agency',
    visitTitle: 'Visit CENTURY 21',
    shopNote: 'Office on Santa Rosaweg — walk in or book a property viewing online.',
    lifestyleLabel: 'Island life',
    lifestyleTitle: 'Curaçao is home',
    lifestyleText:
      'Whether you are buying your first place or building a portfolio — CENTURY 21 Curaçao has guided thousands of island residents home.',
    lifestyleImg: `${base}homes-media/terrace.jpg`,
    collectionLabel: 'Real estate · Holiday season',
    address: 'Santa Rosaweg 18, Willemstad, Curaçao',
    hours: 'Mon–Fri 08:30–17:00',
    phone: '+599 9 737 0201',
    whatsapp: '59997370201',
    websiteUrl: 'https://www.century21numberone.com/en/',
    websiteLabel: 'century21numberone.com',
    mapsEmbed: 'https://maps.google.com/maps?q=12.12091,-68.89858&z=15&output=embed&iwloc=',
    mapsUrl: 'https://maps.google.com/?q=Santa+Rosaweg+18+Willemstad+Curaçao',
  },
]

export function getHomesPartner(id: string | undefined) {
  if (!id) return undefined
  return homesPartners.find((p) => p.id === id)
}
