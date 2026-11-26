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
  /** Horizontal wordmark — extra width, lower height in the layout */
  logoWide?: boolean
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

import { homesPartnersMore } from './homesPartnersMore'

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
    logoImg: `${base}homes-media/logos/remax-gold.png?v=20261127logo`,
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
    collectionLabel: 'Listings · Holidays season',
    websiteUrl: 'https://realestate-curacao.com/en/',
    websiteLabel: 'realestate-curacao.com',
    phone: '+599 9 843 9770',
    address: 'Eden Shopping Mall, Caracasbaaiweg 280 #13, Jan Thiel, Curaçao',
    mapsUrl: 'https://maps.google.com/?q=RE/MAX+BonBini+Caracasbaaiweg+280+Curaçao',
    mapsEmbed: 'https://maps.google.com/maps?q=12.10487,-68.88036&z=16&output=embed&iwloc=',
  },
  {
    id: 'real-estate-caribe',
    name: 'Real Estate Caribe',
    area: 'Willemstad',
    intro:
      'Real Estate Caribe is a Willemstad agency with a team of local brokers who have worked the Curaçao property market since 1999. They help with homes for sale and for rent, commercial property, building lots, valuations, financing advice and property management.',
    tagline: 'Sales · rentals · management',
    logoLabel: 'RC',
    logoColor: '#040245',
    logoImg: `${base}homes-media/logos/real-estate-caribe-gold.png?v=20261127logo`,
    logoWide: true,
    highlightImg: `${base}homes-media/real-estate-caribe-garden-pool.jpg`,
    highlightCaption: 'Home with garden pool — Real Estate Caribe',
    heroImg: `${base}homes-media/real-estate-caribe-spanish-water-aerial.jpg`,
    heroTitle: 'Your personal realtor in Curaçao',
    heroText:
      'Real Estate Caribe offers a personal, customised service in English, Dutch, German and Spanish. They are especially strong in quality rental homes, and also handle sales, appraisals and property management.',
    quote: 'A personal service to help you find your way in the local property market.',
    itemsHeading: 'Featured listings',
    items: [
      {
        img: `${base}homes-media/real-estate-caribe-grote-berg-home.jpg`,
        tag: 'For Rent',
        title: 'Family home, Grote Berg',
        text: 'Single-family home in a green neighbourhood, with a garden and a private pool.',
      },
      {
        img: `${base}homes-media/real-estate-caribe-grote-berg-pool.jpg`,
        tag: 'For Rent',
        title: 'Patio and pool',
        text: 'Covered terrace next to a private pool — made for warm holiday evenings.',
      },
      {
        img: `${base}homes-media/real-estate-caribe-resort-pool.jpg`,
        tag: 'Resort',
        title: 'Resort-style living',
        text: 'Resort pool with palm trees and sun loungers — from their listings.',
      },
    ],
    visitLabel: 'Agency',
    visitTitle: 'Visit Real Estate Caribe',
    shopNote: 'Santa Rosaweg 172, Willemstad. Open Monday to Friday 09:00–17:00, Saturdays by appointment.',
    lifestyleLabel: 'Island living',
    lifestyleTitle: 'Rent first, then stay',
    lifestyleText:
      'New to Curaçao? Many people start with a rental and take their time. Real Estate Caribe knows the rental market well and can guide you from the first viewing to the keys.',
    lifestyleImg: `${base}homes-media/real-estate-caribe-resort-pool-2.jpg`,
    collectionLabel: 'Listings · Holidays season',
    phone: '+599 9 562 4089',
    whatsapp: '59995624089',
    websiteUrl: 'https://www.realestatecaribe.com/',
    websiteLabel: 'realestatecaribe.com',
    address: 'Santa Rosaweg 172, Willemstad, Curaçao',
    openingHours: 'Mon–Fri 09:00–17:00 · Sat by appointment',
    mapsUrl: 'https://maps.google.com/?q=Real+Estate+Caribe+Santa+Rosaweg+172+Willemstad+Curaçao',
    mapsEmbed: 'https://maps.google.com/maps?q=12.1243,-68.8793&z=16&output=embed&iwloc=',
  },
  {
    id: 'gs-real-estate',
    name: 'GS Real Estate B.V.',
    area: 'Willemstad',
    intro:
      'GS Real Estate is a small, personal agency in Willemstad run by certified broker Gerben Sevinga. They help with buying and selling homes, long-term rentals, and management of homes and holiday homes. You can write to them in Dutch, German, English or Spanish.',
    tagline: 'Sales · rentals · management',
    logoLabel: 'GS',
    logoColor: '#2a6a8a',
    logoImg: `${base}homes-media/logos/gs-real-estate-gold.png?v=20261127logo`,
    highlightImg: `${base}homes-media/gs-real-estate-seru-coral-pool.jpg`,
    highlightCaption: 'Seru Coral resort pool — GS Real Estate listing',
    heroImg: `${base}homes-media/gs-real-estate-resort-pool.jpg`,
    heroTitle: 'Total real estate for you',
    heroText:
      'GS Real Estate works with a calm, personal approach: attention, no pressure, and a focus on results. From a first rental to a home purchase, you deal with one person who knows the island.',
    quote: 'Attention, a relaxed way of working, and results.',
    itemsHeading: 'Featured listings',
    items: [
      {
        img: `${base}homes-media/gs-real-estate-grote-berg-home.jpg`,
        tag: 'Home',
        title: 'Home in Grote Berg',
        text: 'Two-storey family home with a garden, in a quiet residential area.',
      },
      {
        img: `${base}homes-media/gs-real-estate-jan-sofat-pool-home.jpg`,
        tag: 'Home',
        title: 'Bungalow with pool',
        text: 'Single-storey home with its own pool, in the Jan Sofat area.',
      },
      {
        img: `${base}homes-media/gs-real-estate-aerial.jpg`,
        tag: 'Resort',
        title: 'Vista Royal, Jan Thiel',
        text: 'Aerial view of the Vista Royal community near the Jan Thiel coast.',
      },
    ],
    visitLabel: 'Agency',
    visitTitle: 'Visit GS Real Estate',
    shopNote: 'Santa Rosaweg 70 C, Willemstad. Call or send a WhatsApp message to book a viewing.',
    lifestyleLabel: 'Resort life',
    lifestyleTitle: 'Pools, palms and quiet streets',
    lifestyleText:
      'Many homes on their list are in resort communities and residential areas with shared pools and green gardens — a good fit for a longer stay in Curaçao.',
    lifestyleImg: `${base}homes-media/gs-real-estate-family-home.jpg`,
    collectionLabel: 'Listings · Holidays season',
    phone: '+599 9 524 4433',
    whatsapp: '59995244433',
    websiteUrl: 'https://www.gs-realestate.com/',
    websiteLabel: 'gs-realestate.com',
    address: 'Santa Rosaweg 70 C, Willemstad, Curaçao',
    mapsUrl: 'https://maps.google.com/?q=GS+Real+Estate+Santa+Rosaweg+70+C+Willemstad+Curaçao',
    mapsEmbed: 'https://maps.google.com/maps?q=12.1241,-68.8921&z=16&output=embed&iwloc=',
  },
  ...homesPartnersMore,
]

export function getHomesPartner(id: string | undefined) {
  if (!id) return undefined
  return homesPartners.find((p) => p.id === id)
}
