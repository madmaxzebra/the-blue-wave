import type { PartnerProfile } from './homesPartners'

const base = import.meta.env.BASE_URL

/** Sample culinary partners — replace with real logos & menus later */
export const tastePartners: PartnerProfile[] = [
  {
    id: 'casa-brisa',
    name: 'Casa Brisa',
    area: 'Pietermaai',
    intro:
      'Seafood and island classics on a breezy terrace — holiday menus built for long tables.',
    tagline: 'Seafood · terrace · long tables',
    logoLabel: 'CB',
    logoColor: '#3d7ea6',
    logoImg: `${base}taste-media/logos/casa-brisa.png`,
    highlightImg: `${base}taste-media/plate-1.jpg`,
    highlightCaption: 'Catch of the evening',
    heroImg: `${base}taste-media/hero.jpg`,
    heroTitle: 'Dinner that lasts past dessert',
    heroText:
      'Holiday season means reservations, shared plates, and a terrace that holds the night air.',
    quote: 'Come hungry. Leave slowly.',
    itemsHeading: 'Holiday menu highlights',
    items: [
      {
        img: `${base}taste-media/plate-1.jpg`,
        tag: 'Main',
        title: 'Catch of the evening',
        text: 'Grilled fish, citrus, and herbs from the garden.',
      },
      {
        img: `${base}taste-media/plate-2.jpg`,
        tag: 'Share',
        title: 'Table starters',
        text: 'Small plates meant to pass — for four or more.',
      },
      {
        img: `${base}taste-media/dining.jpg`,
        tag: 'Room',
        title: 'Terrace seating',
        text: 'Candlelight tables for December weekends.',
      },
    ],
    visitLabel: 'Restaurant',
    visitTitle: 'Reserve Casa Brisa',
    shopNote: 'Holiday set menu available Dec 1–31 — book early for terrace seats.',
    lifestyleLabel: 'Evening',
    lifestyleTitle: 'Stay for one more glass',
    lifestyleText:
      'Pietermaai nights, soft music, and a kitchen that doesn’t rush you out.',
    lifestyleImg: `${base}taste-media/bar.jpg`,
    collectionLabel: 'Menu · Holiday season',
  },
  {
    id: 'oven-and-olive',
    name: 'Oven & Olive',
    area: 'Punda',
    intro:
      'Wood-fired pizzas, fresh pasta, and a courtyard that fills up when the shops close.',
    tagline: 'Wood fire · pasta · courtyard',
    logoLabel: 'OO',
    logoColor: '#d4a84b',
    logoImg: `${base}taste-media/logos/oven-olive.png`,
    highlightImg: `${base}taste-media/plate-2.jpg`,
    highlightCaption: 'Wood-fired holiday pie',
    heroImg: `${base}taste-media/dining.jpg`,
    heroTitle: 'Fire, dough, and courtyard light',
    heroText:
      'Casual holiday dining in the city — easy for families, still special enough for a toast.',
    quote: 'If the oven’s on, the night’s still young.',
    itemsHeading: 'Holiday menu highlights',
    items: [
      {
        img: `${base}taste-media/plate-2.jpg`,
        tag: 'Fire',
        title: 'Holiday pie',
        text: 'Seasonal toppings, blistered crust, shareable.',
      },
      {
        img: `${base}taste-media/plate-3.jpg`,
        tag: 'Pasta',
        title: 'House ravioli',
        text: 'Filled pasta with a slow sauce — winter comfort, island style.',
      },
      {
        img: `${base}taste-media/bar.jpg`,
        tag: 'Drink',
        title: 'Courtyard aperitivo',
        text: 'Early evening drinks before the oven rush.',
      },
    ],
    visitLabel: 'Restaurant',
    visitTitle: 'Find Oven & Olive',
    shopNote: 'Walk-ins welcome before 18:00 — after that, reserve the courtyard.',
    lifestyleLabel: 'City',
    lifestyleTitle: 'After the shops',
    lifestyleText:
      'Punda closes, the courtyard opens — pizza smoke and easy conversation.',
    lifestyleImg: `${base}taste-media/hero.jpg`,
    collectionLabel: 'Menu · Holiday season',
  },
  {
    id: 'sweet-salt-kitchen',
    name: 'Sweet & Salt Kitchen',
    area: 'Otrobanda',
    intro:
      'Modern Caribbean plates and a dessert cart that locals queue for in December.',
    tagline: 'Caribbean · dessert · night out',
    logoLabel: 'SS',
    logoColor: '#8b2344',
    logoImg: `${base}taste-media/logos/sweet-salt.png`,
    highlightImg: `${base}taste-media/plate-3.jpg`,
    highlightCaption: 'Sweet finale',
    heroImg: `${base}taste-media/plate-3.jpg`,
    heroTitle: 'Salt first. Sweet last.',
    heroText:
      'Bold island flavours for holiday dinners — then a dessert that ends the night properly.',
    quote: 'Save room. That’s the rule.',
    itemsHeading: 'Holiday menu highlights',
    items: [
      {
        img: `${base}taste-media/plate-3.jpg`,
        tag: 'Dessert',
        title: 'Sweet finale',
        text: 'The cart everyone asks about — limited each night.',
      },
      {
        img: `${base}taste-media/plate-1.jpg`,
        tag: 'Main',
        title: 'Salt plate',
        text: 'Local catch with spice that doesn’t shout.',
      },
      {
        img: `${base}taste-media/dining.jpg`,
        tag: 'Room',
        title: 'Dining room glow',
        text: 'Warm light, soft music, tables for two or ten.',
      },
    ],
    visitLabel: 'Restaurant',
    visitTitle: 'Book Sweet & Salt',
    shopNote: 'Dessert cart is first-come after 21:00 — dinner reservations hold your seat.',
    lifestyleLabel: 'Night',
    lifestyleTitle: 'Cross the bridge for dinner',
    lifestyleText:
      'Otrobanda evenings — walk over, eat well, walk back under the lights.',
    lifestyleImg: `${base}taste-media/dining.jpg`,
    collectionLabel: 'Menu · Holiday season',
  },
]

export function getTastePartner(id: string | undefined) {
  if (!id) return undefined
  return tastePartners.find((p) => p.id === id)
}
