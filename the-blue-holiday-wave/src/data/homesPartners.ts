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
  phone?: string
  whatsapp?: string
  address?: string
  openingHours?: string
  websiteUrl?: string
  websiteLabel?: string
  mapsEmbed?: string
  mapsUrl?: string
}

const base = import.meta.env.BASE_URL

export const homesPartners: PartnerProfile[] = [
  {
    id: 'remax-bonbini',
    name: 'RE/MAX BonBini',
    area: 'Willemstad',
    intro:
      'RE/MAX BonBini is Curaçao\'s leading real estate agency — over 150 properties for sale and rent island-wide, from modern villas with pools to city apartments and undeveloped land. With decades of experience and a full team of local agents, they cover every corner of the island.',
    tagline: 'Villas · apartments · island-wide',
    logoLabel: 'RE',
    logoColor: '#cc0000',
    logoImg: `${base}homes-media/logos/remax-gold.png?v=20261126`,
    highlightImg: `${base}homes-media/remax-villa-1.jpg`,
    highlightCaption: 'Villa for sale — RE/MAX BonBini Curaçao',
    heroImg: `${base}homes-media/remax-curacao-bridge.jpg`,
    heroTitle: "Curaçao's number one real estate agency",
    heroText:
      'RE/MAX BonBini has been matching buyers and sellers in Curaçao for years. With 154 active listings and a team of experienced agents, they know every neighbourhood on the island — from Jan Thiel and Pietermaai to Blue Bay and Santa Barbara.',
    quote: "We know every street, every view, every home on this island.",
    itemsHeading: 'Featured listings',
    items: [
      {
        img: `${base}homes-media/remax-villa-1.jpg`,
        tag: 'For Sale',
        title: 'Modern villa',
        text: 'Contemporary villa with pool and sea views — currently listed on realestate-curacao.com.',
      },
      {
        img: `${base}homes-media/remax-villa-2.jpg`,
        tag: 'For Sale',
        title: 'Holiday home',
        text: 'Bright, open-plan home in a quiet residential area — move-in ready.',
      },
      {
        img: `${base}homes-media/remax-pool-villa.jpg`,
        tag: 'For Sale',
        title: 'Villa with pool',
        text: 'Spacious villa with private pool — perfect for buyers looking for holiday living.',
      },
    ],
    visitLabel: 'Agency',
    visitTitle: 'Browse RE/MAX BonBini listings',
    shopNote: '154 properties for sale · 42 for rent · 17 building lots. Browse all listings at realestate-curacao.com.',
    lifestyleLabel: 'Investment',
    lifestyleTitle: 'Invest in Curaçao',
    lifestyleText:
      'Curaçao real estate is in demand — holiday buyers, digital nomads, and long-term investors all look here. RE/MAX BonBini has the island knowledge to match you with the right property.',
    lifestyleImg: `${base}homes-media/remax-jan-sofat-villa.jpg`,
    collectionLabel: 'Listings · Holiday season',
    websiteUrl: 'https://realestate-curacao.com/en/',
    websiteLabel: 'realestate-curacao.com',
    address: 'Willemstad, Curaçao',
    mapsUrl: 'https://maps.google.com/?q=RE/MAX+BonBini+Willemstad+Curaçao',
    mapsEmbed: 'https://maps.google.com/maps?q=12.108,-68.932&z=13&output=embed&iwloc=',
  },
  {
    id: 'global-real-estate',
    name: 'Global Real Estate',
    area: 'Willemstad',
    intro:
      'Global Real Estate Curaçao specialises in luxury villas, beachfront properties, and high-end investment homes across the island. Their multilingual team serves both local and international buyers looking for premium Curaçao real estate.',
    tagline: 'Luxury · beachfront · investment',
    logoLabel: 'GR',
    logoColor: '#1a3a5c',
    logoImg: `${base}homes-media/logos/global-re-gold-3d.jpg`,
    highlightImg: `${base}homes-media/remax-villa-curacao.jpg`,
    highlightCaption: 'Luxury villa — Curaçao',
    heroImg: `${base}homes-media/remax-house-exterior.jpg`,
    heroTitle: 'Premium properties island-wide',
    heroText:
      'From seafront villas in Jan Thiel to contemporary homes in Mahuma — Global Real Estate covers the top end of the Curaçao market. Holiday buyers looking for investment-grade properties start here.',
    quote: 'Find the home that matches the life you want to live here.',
    itemsHeading: 'Featured listings',
    items: [
      {
        img: `${base}homes-media/remax-villa-curacao.jpg`,
        tag: 'For Sale',
        title: 'Villa for sale',
        text: 'Contemporary Caribbean villa — pool, garden, and sea views.',
      },
      {
        img: `${base}homes-media/remax-house-exterior.jpg`,
        tag: 'For Sale',
        title: 'Modern home',
        text: 'Clean architecture, open layout, finished to the highest standard.',
      },
      {
        img: `${base}homes-media/remax-interior.jpg`,
        tag: 'Interior',
        title: 'Luxury interiors',
        text: 'High-spec finishes and open-plan design throughout.',
      },
    ],
    visitLabel: 'Agency',
    visitTitle: 'Contact Global Real Estate',
    shopNote: 'Specialising in luxury and investment properties. Contact for private viewings.',
    lifestyleLabel: 'Lifestyle',
    lifestyleTitle: 'Island living, elevated',
    lifestyleText:
      'The right Curaçao home changes everything — the morning light, the evening view, the pace of the whole holiday season.',
    lifestyleImg: `${base}homes-media/remax-buiten.jpg`,
    collectionLabel: 'Listings · Holiday season',
    address: 'Willemstad, Curaçao',
    mapsUrl: 'https://maps.google.com/?q=Willemstad+Curaçao+real+estate',
    mapsEmbed: 'https://maps.google.com/maps?q=12.108,-68.932&z=13&output=embed&iwloc=',
  },
  {
    id: 'caribbean-park-properties',
    name: 'Caribbean Park Properties',
    area: 'Jan Thiel · Blue Bay',
    intro:
      'Caribbean Park Properties focuses on the most sought-after resort communities in Curaçao — Jan Thiel, Blue Bay, and Santa Barbara. Specialising in gated community homes, holiday rentals, and resort-side apartments for buyers who want the full island lifestyle.',
    tagline: 'Resort communities · Jan Thiel · Blue Bay',
    logoLabel: 'CP',
    logoColor: '#1a7a4a',
    logoImg: `${base}homes-media/logos/caribbean-park-gold-3d.jpg`,
    highlightImg: `${base}homes-media/remax-caribbean-home.jpg`,
    highlightCaption: 'Caribbean home — Jan Thiel area',
    heroImg: `${base}homes-media/remax-villa-3.jpg`,
    heroTitle: 'Resort living in the best communities',
    heroText:
      'Jan Thiel and Blue Bay are the two most popular resort areas on the island for international buyers. Caribbean Park Properties knows every development, every view, and every available unit in these communities.',
    quote: "Live where everyone wants to vacation.",
    itemsHeading: 'Featured listings',
    items: [
      {
        img: `${base}homes-media/remax-caribbean-home.jpg`,
        tag: 'For Sale',
        title: 'Caribbean home',
        text: 'Well-maintained resort home in a gated community with shared pool.',
      },
      {
        img: `${base}homes-media/remax-villa-3.jpg`,
        tag: 'For Sale',
        title: 'Resort villa',
        text: 'Steps from the beach — private terrace and open-plan living.',
      },
      {
        img: `${base}homes-media/remax-villa-2.jpg`,
        tag: 'For Rent',
        title: 'Holiday rental',
        text: 'Fully furnished holiday rental in Jan Thiel — available from December.',
      },
    ],
    visitLabel: 'Agency',
    visitTitle: 'Browse Caribbean Park listings',
    shopNote: 'Specialising in Jan Thiel, Blue Bay, and Santa Barbara resort communities.',
    lifestyleLabel: 'Community',
    lifestyleTitle: 'The resort life every day',
    lifestyleText:
      'Gated communities, shared pools, beach access, and neighbours who understand the island life — Caribbean Park Properties finds the right fit.',
    lifestyleImg: `${base}homes-media/remax-villa-1.jpg`,
    collectionLabel: 'Listings · Holiday season',
    address: 'Jan Thiel / Blue Bay, Willemstad, Curaçao',
    mapsUrl: 'https://maps.google.com/?q=Jan+Thiel+Curaçao',
    mapsEmbed: 'https://maps.google.com/maps?q=12.064,-68.879&z=13&output=embed&iwloc=',
  },
]

export function getHomesPartner(id: string | undefined) {
  if (!id) return undefined
  return homesPartners.find((p) => p.id === id)
}
