import type { PartnerProfile } from './homesPartners'

const base = import.meta.env.BASE_URL

export const tastePartners: PartnerProfile[] = [
  {
    id: 'gouverneur-de-rouville',
    name: 'Gouverneur de Rouville',
    area: 'Otrobanda',
    intro:
      "One of Curaçao's most beloved restaurants — a colonial mansion on the waterfront in Otrobanda with a magnificent view over the Handelskade. Locals and visitors come for lunch and dinner while watching large ships pass through Willemstad harbour. Open every day of the year.",
    tagline: 'Caribbean cuisine · colonial terrace · harbour view',
    logoLabel: 'GR',
    logoColor: '#1A3A6E',
    logoImg: 'https://logo.clearbit.com/de-gouverneur.com',
    highlightImg: `${base}taste-media/dining.jpg`,
    highlightCaption: 'Terrace with harbour view',
    heroImg: `${base}taste-media/hero.jpg`,
    heroTitle: 'Dinner with the best view in Willemstad',
    heroText:
      'The terrace at Gouverneur de Rouville faces the iconic Handelskade — colourful colonial facades on one side, passing cruise ships on the other. A holiday dinner here is unforgettable.',
    quote: 'Open 365 days a year — no excuse not to come.',
    itemsHeading: 'What to expect',
    items: [
      {
        img: `${base}taste-media/plate-1.jpg`,
        tag: 'Cuisine',
        title: 'Caribbean & international',
        text: 'Fresh seafood, local flavours, and international classics — a menu for every table.',
      },
      {
        img: `${base}taste-media/dining.jpg`,
        tag: 'Setting',
        title: 'Colonial terrace',
        text: 'The 2nd-floor terrace opens to the harbour — the best seats fill fast in December.',
      },
      {
        img: `${base}taste-media/bar.jpg`,
        tag: 'Drinks',
        title: 'Cocktails & local beer',
        text: 'Cold drinks at sunset while the harbour lights come on — the classic Willemstad moment.',
      },
    ],
    visitLabel: 'Restaurant',
    visitTitle: 'Reserve a table',
    shopNote: 'Open daily 09:00 until late — walk-in welcome, but reservations recommended for dinner on the terrace.',
    lifestyleLabel: 'Evening',
    lifestyleTitle: 'The classic Willemstad evening',
    lifestyleText:
      'Start with drinks on the terrace, stay for dinner, watch the lights reflect on the harbour water. Gouverneur de Rouville is the full evening in one place.',
    lifestyleImg: `${base}taste-media/plate-2.jpg`,
    collectionLabel: 'Restaurant · Holiday season',
    address: 'De Rouvilleweg 9F, 2nd Floor, Otrobanda, Willemstad, Curaçao',
    hours: 'Daily 09:00 – late (open 365 days)',
    phone: '+599 9 462 5999',
    whatsapp: '59994625999',
    websiteUrl: 'https://de-gouverneur.com',
    websiteLabel: 'de-gouverneur.com',
    mapsEmbed: 'https://maps.google.com/maps?q=12.1065,-68.9397&z=16&output=embed&iwloc=',
    mapsUrl: 'https://maps.google.com/?q=Gouverneur+de+Rouville+Otrobanda+Willemstad+Curaçao',
  },
  {
    id: 'kome',
    name: 'Kome',
    area: 'Pietermaai',
    intro:
      "Kome (Papiamentu for 'eat') is one of Pietermaai's most popular restaurants — Caribbean fusion with a modern twist, served in a beautifully restored colonial building. With over 1,400 Google reviews and a 4.6 rating, it's a favourite for locals and visitors alike.",
    tagline: 'Caribbean fusion · colonial building · brunch & dinner',
    logoLabel: 'KO',
    logoColor: '#2C5F2E',
    logoImg: 'https://logo.clearbit.com/komecuracao.com',
    highlightImg: `${base}taste-media/plate-2.jpg`,
    highlightCaption: 'Fresh Caribbean fusion plates',
    heroImg: `${base}taste-media/dining.jpg`,
    heroTitle: 'Eat well in Pietermaai',
    heroText:
      "Kome brings together the best of Caribbean and international cuisine in a relaxed, stylish setting — the go-to spot for a long, satisfying meal in one of Willemstad's most vibrant neighbourhoods.",
    quote: 'Kome — just eat.',
    itemsHeading: 'What to expect',
    items: [
      {
        img: `${base}taste-media/plate-1.jpg`,
        tag: 'Brunch',
        title: 'Weekend brunch',
        text: 'Saturdays from 11:00 — the most popular table in Pietermaai.',
      },
      {
        img: `${base}taste-media/plate-3.jpg`,
        tag: 'Dinner',
        title: 'Caribbean fusion menu',
        text: 'Bold island flavours with an international touch — changes with the season.',
      },
      {
        img: `${base}taste-media/bar.jpg`,
        tag: 'Drinks',
        title: 'Cocktails & local spirits',
        text: 'The bar fills up early on Friday evenings — come for dinner, stay for drinks.',
      },
    ],
    visitLabel: 'Restaurant',
    visitTitle: 'Book at Kome',
    shopNote: 'Open Tue–Fri 12:00–22:00 and Sat 11:00–22:00. Closed Sunday & Monday. Reservations via their website.',
    lifestyleLabel: 'Neighbourhood',
    lifestyleTitle: 'The heart of Pietermaai dining',
    lifestyleText:
      'Pietermaai is the most exciting food street on the island — and Kome is its anchor. Book early for a December weekend table.',
    lifestyleImg: `${base}taste-media/hero.jpg`,
    collectionLabel: 'Restaurant · Holiday season',
    address: '6 Johan van Walbeeckplein, Pietermaai, Willemstad, Curaçao',
    hours: 'Tue–Fri 12:00–22:00 · Sat 11:00–22:00 · Closed Sun & Mon',
    phone: '+599 9 465 0413',
    whatsapp: '59994650413',
    websiteUrl: 'https://www.komecuracao.com',
    websiteLabel: 'komecuracao.com',
    mapsEmbed: 'https://maps.google.com/maps?q=12.10288,-68.92649&z=16&output=embed&iwloc=',
    mapsUrl: 'https://maps.google.com/?q=Kome+Restaurant+Pietermaai+Willemstad+Curaçao',
  },
  {
    id: 'oliva',
    name: 'Oliva',
    area: 'Pietermaai',
    intro:
      'Oliva is a Mediterranean gastro bar in the heart of Pietermaai — fresh pasta, ravioli, souvlaki, ratatouille, and daily specials made with love. Located inside the boutique Hotel Klooster, with a Sunday BBQ night that locals rave about.',
    tagline: 'Mediterranean · gastro bar · Sunday BBQ',
    logoLabel: 'OL',
    logoColor: '#6B8E23',
    logoImg: 'https://logo.clearbit.com/olivacuracao.com',
    highlightImg: `${base}taste-media/plate-3.jpg`,
    highlightCaption: 'Mediterranean small plates',
    heroImg: `${base}taste-media/hero.jpg`,
    heroTitle: 'Mediterranean flavours in Pietermaai',
    heroText:
      'Daily freshly baked bread, house-made pasta, and Mediterranean classics — Oliva is the kind of restaurant you come back to every trip. The Sunday evening BBQ is the best-kept secret on the street.',
    quote: 'Freshly made, every day, with lots of love.',
    itemsHeading: 'What to expect',
    items: [
      {
        img: `${base}taste-media/plate-2.jpg`,
        tag: 'Menu',
        title: 'Mediterranean classics',
        text: 'Ravioli, souvlaki, ratatouille — and daily specials that change with the market.',
      },
      {
        img: `${base}taste-media/plate-1.jpg`,
        tag: 'Sunday',
        title: 'Sunday BBQ night',
        text: 'The most popular evening of the week — arrive early, 18:00–21:00.',
      },
      {
        img: `${base}taste-media/bar.jpg`,
        tag: 'Happy hour',
        title: 'Sunday happy hour',
        text: 'Drinks from 17:00–18:00 before the BBQ — the perfect way to start Sunday evening.',
      },
    ],
    visitLabel: 'Restaurant',
    visitTitle: 'Visit Oliva',
    shopNote: 'Open Mon–Fri 17:00–22:00 and Sunday BBQ 18:00–21:00. Happy hour Sunday 17:00–18:00.',
    lifestyleLabel: 'Evening',
    lifestyleTitle: 'The best Sunday evening on the island',
    lifestyleText:
      'Start with a sundowner, move to the BBQ, end the evening with the last glass on the terrace. Oliva does Sundays right.',
    lifestyleImg: `${base}taste-media/dining.jpg`,
    collectionLabel: 'Restaurant · Holiday season',
    address: 'Abraham de Veerstraat 12, Pietermaai, Willemstad, Curaçao',
    hours: 'Mon–Fri 17:00–22:00 · Sun BBQ 18:00–21:00 · Happy hour Sun 17:00–18:00',
    phone: '+599 9 698 2650',
    whatsapp: '59996982650',
    websiteUrl: 'https://www.olivacuracao.com',
    websiteLabel: 'olivacuracao.com',
    mapsEmbed: 'https://maps.google.com/maps?q=12.10204,-68.92410&z=16&output=embed&iwloc=',
    mapsUrl: 'https://maps.google.com/?q=Oliva+Restaurant+Pietermaai+Willemstad+Curaçao',
  },
]

export function getTastePartner(id: string | undefined) {
  if (!id) return undefined
  return tastePartners.find((p) => p.id === id)
}
