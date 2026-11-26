import type { PartnerProfile } from './homesPartners'
import { tastePartnersMore } from './tastePartnersMore'

const base = import.meta.env.BASE_URL

export const tastePartners: PartnerProfile[] = [
  {
    id: 'the-pen-restaurant',
    name: 'The Pen Restaurant',
    area: 'Avila Beach Hotel · Pietermaai',
    intro:
      'The Pen is the main restaurant at the iconic Avila Beach Hotel — a heritage building right on the sea in Pietermaai. Open for breakfast, lunch, and dinner on the terrace with views across the bay. One of the most loved dining spots in Willemstad.',
    tagline: 'Terrace · breakfast to dinner · heritage building',
    logoLabel: 'TP',
    logoColor: '#1a3a5c',
    logoImg: `${base}taste-media/logos/the-pen-gold.png?v=20261127logo`,
    highlightImg: `${base}taste-media/avila-pen-terrace.jpg`,
    highlightCaption: 'Terrace views at The Pen',
    heroImg: `${base}taste-media/avila-pen-terrace.jpg`,
    heroTitle: 'Terrace views for days',
    heroText:
      'The Pen Restaurant at Avila Beach Hotel has been a Willemstad institution for decades. Dine on the terrace overlooking the sea — breakfast, long lunches, and candle-lit holiday dinners.',
    quote: 'Terrace views for days.',
    itemsHeading: 'At the table',
    items: [
      {
        img: `${base}taste-media/avila-pen-dinner.jpg`,
        tag: 'Dinner',
        title: 'Dinner on the terrace',
        text: 'Holiday evenings at the most scenic terrace in Willemstad.',
      },
      {
        img: `${base}taste-media/avila-pen-breakfast.jpg`,
        tag: 'Breakfast',
        title: 'Breakfast by the sea',
        text: 'Start the day at the Pen — fresh food, sea air, and morning light.',
      },
      {
        img: `${base}taste-media/avila-hotel-beach.jpg`,
        tag: 'Setting',
        title: 'Avila Beach Hotel',
        text: 'A Dutch colonial heritage hotel right on the beach — unique in Curaçao.',
      },
    ],
    visitLabel: 'Restaurant',
    visitTitle: 'Visit The Pen',
    shopNote: 'Located at Avila Beach Hotel, Penstraat 130, Pietermaai, Willemstad. Open daily.',
    lifestyleLabel: 'Evening',
    lifestyleTitle: 'Dinner by the water',
    lifestyleText:
      'The Pen is one of those places where you book for dinner and stay until the stars are out. Reserve for the holidays.',
    lifestyleImg: `${base}taste-media/avila-hotel-beach.jpg`,
    collectionLabel: 'Menu · Holiday season',
    phone: '+599 9 461 4377',
    whatsapp: '59997881949',
    websiteUrl: 'https://www.avilabeachhotel.com/discover-avila/restaurants-bars/',
    websiteLabel: 'avilabeachhotel.com',
    address: 'Penstraat 130, Pietermaai, Willemstad, Curaçao',
    openingHours: 'Open daily — breakfast, lunch & dinner',
    mapsUrl: 'https://maps.google.com/?q=Avila+Beach+Hotel+Penstraat+130+Willemstad+Curaçao',
    mapsEmbed: 'https://maps.google.com/maps?q=12.1038,-68.9229&z=16&output=embed&iwloc=',
  },
  {
    id: 'blues-caribbean-kitchen',
    name: 'Blues Caribbean Kitchen',
    area: 'Avila Beach Hotel · Pietermaai',
    intro:
      "Blues is Avila's colourful Caribbean restaurant on the pier — a waterfront bar and kitchen right on the sea. Fresh Caribbean dishes, cold drinks, and the best sunset view in Pietermaai. A holiday favourite with locals and visitors alike.",
    tagline: 'Pier · Caribbean dishes · sunset views',
    logoLabel: 'BL',
    logoColor: '#1a7a4a',
    logoImg: `${base}taste-media/logos/blues-gold.png?v=20261127logo`,
    highlightImg: `${base}taste-media/avila-blues-exterior.jpg`,
    highlightCaption: 'Blues restaurant on the pier',
    heroImg: `${base}taste-media/avila-blues-exterior.jpg`,
    heroTitle: 'Caribbean kitchen on the pier',
    heroText:
      "Blues Caribbean Kitchen sits right on Avila's private pier — colourful, breezy, and always busy in December. Order fresh Caribbean fish, share plates, and watch the sunset from the water.",
    quote: 'The best view comes with the best fish.',
    itemsHeading: 'On the menu',
    items: [
      {
        img: `${base}taste-media/avila-blues-exterior.jpg`,
        tag: 'Setting',
        title: 'On the pier',
        text: 'The restaurant sits directly over the water — no better seat on the island.',
      },
      {
        img: `${base}taste-media/avila-schooner-bar.jpg`,
        tag: 'Drinks',
        title: 'Sundowner drinks',
        text: "Order a rum punch and watch the sun drop into the sea.",
      },
      {
        img: `${base}taste-media/avila-hotel-beach.jpg`,
        tag: 'Beach',
        title: 'Avila private beach',
        text: 'Swim, then eat — the beach is right there.',
      },
    ],
    visitLabel: 'Restaurant & Bar',
    visitTitle: 'Visit Blues',
    shopNote: 'Located at Avila Beach Hotel, Penstraat 130, Pietermaai. Walk the pier to the entrance.',
    lifestyleLabel: 'Sunset',
    lifestyleTitle: 'Pier drinks at golden hour',
    lifestyleText:
      'December in Curaçao means warm evenings and long sunsets. Blues is the best place on the island to watch it happen — feet near the water, drink in hand.',
    lifestyleImg: `${base}taste-media/avila-schooner-bar.jpg`,
    collectionLabel: 'Menu · Holiday season',
    phone: '+599 9 461 4377',
    whatsapp: '59997881949',
    websiteUrl: 'https://www.avilabeachhotel.com/discover-avila/restaurants-bars/',
    websiteLabel: 'avilabeachhotel.com',
    address: 'Penstraat 130, Pietermaai, Willemstad, Curaçao (Avila Beach Hotel pier)',
    openingHours: 'Open daily — lunch & dinner',
    mapsUrl: 'https://maps.google.com/?q=Avila+Beach+Hotel+Penstraat+130+Willemstad+Curaçao',
    mapsEmbed: 'https://maps.google.com/maps?q=12.1038,-68.9229&z=16&output=embed&iwloc=',
  },
  {
    id: 'schooner-bar',
    name: 'Schooner Bar',
    area: 'Avila Beach Hotel · Pietermaai',
    intro:
      "The Schooner Bar is Avila's beachfront tiki bar — a relaxed open-air bar on the sand, right at the water's edge. Cocktails, fresh juices, and beach vibes from midday until late. The most laid-back spot at the hotel during the holiday season.",
    tagline: 'Beachfront · cocktails · sand & sea',
    logoLabel: 'SB',
    logoColor: '#c47e1a',
    logoImg: `${base}taste-media/logos/schooner-bar-gold.png?v=20261127logo`,
    logoWide: true,
    highlightImg: `${base}taste-media/avila-schooner-bar.jpg`,
    highlightCaption: 'Schooner Bar on the beach',
    heroImg: `${base}taste-media/avila-schooner-bar.jpg`,
    heroTitle: 'Sand, sea, and a cold drink',
    heroText:
      "Schooner Bar is the ultimate beach bar — a thatched-roof open-air bar right on Avila's private beach. Rum punches, fresh coconut water, and that Caribbean breeze. Perfect for a holiday afternoon.",
    quote: 'Feet in the sand, drink in hand.',
    itemsHeading: 'Drinks & bites',
    items: [
      {
        img: `${base}taste-media/avila-schooner-bar.jpg`,
        tag: 'Bar',
        title: 'The beach bar',
        text: 'Thatched roof, open air, sand underfoot — the most relaxed spot on the island.',
      },
      {
        img: `${base}taste-media/avila-hotel-beach.jpg`,
        tag: 'Beach',
        title: 'Private beach',
        text: "Avila's private beach is steps away — swim, then order from the bar.",
      },
      {
        img: `${base}taste-media/avila-pen-terrace.jpg`,
        tag: 'View',
        title: 'Holiday evenings',
        text: 'As the sun goes down, the Schooner Bar is the best seat on the beach.',
      },
    ],
    visitLabel: 'Beach Bar',
    visitTitle: 'Visit Schooner Bar',
    shopNote: 'On the beach at Avila Beach Hotel, Penstraat 130, Pietermaai. Open daily from midday.',
    lifestyleLabel: 'Beach life',
    lifestyleTitle: 'Holiday afternoons',
    lifestyleText:
      "December in Curaçao is warm and sunny. Spend the afternoon at Avila's beach bar — no schedule, no rush.",
    lifestyleImg: `${base}taste-media/avila-hotel-beach.jpg`,
    collectionLabel: 'Drinks · Holiday season',
    phone: '+599 9 461 4377',
    whatsapp: '59997881949',
    websiteUrl: 'https://www.avilabeachhotel.com/discover-avila/restaurants-bars/',
    websiteLabel: 'avilabeachhotel.com',
    address: 'Penstraat 130, Pietermaai, Willemstad, Curaçao (Avila Beach Hotel beach)',
    openingHours: 'Open daily from noon',
    mapsUrl: 'https://maps.google.com/?q=Avila+Beach+Hotel+Penstraat+130+Willemstad+Curaçao',
    mapsEmbed: 'https://maps.google.com/maps?q=12.1038,-68.9229&z=16&output=embed&iwloc=',
  },
  ...tastePartnersMore,
]

export function getTastePartner(id: string | undefined) {
  if (!id) return undefined
  return tastePartners.find((p) => p.id === id)
}
