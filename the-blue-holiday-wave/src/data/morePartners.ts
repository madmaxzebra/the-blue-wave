import type { PartnerProfile } from './homesPartners'

const base = import.meta.env.BASE_URL

/** Sample official sponsors / More-hub partners */
export const morePartners: PartnerProfile[] = [
  {
    id: 'coral-bay',
    name: 'Coral Bay Resort',
    area: 'Jan Thiel',
    intro:
      'Official hospitality partner — stay packages, guest welcome, and holiday weekend offers.',
    tagline: 'Stay · pool · guest welcome',
    logoLabel: 'CB',
    logoColor: '#5aa0c8',
    logoImg: `${base}more-media/logos/coral-bay.png`,
    highlightImg: `${base}more-media/pool.jpg`,
    highlightCaption: 'Holiday stay package',
    heroImg: `${base}more-media/hero.jpg`,
    heroTitle: 'Where guests land for the holidays',
    heroText:
      'Coral Bay hosts Blue Holiday Wave readers with pool days, easy dinners, and a quiet place to reset between events.',
    quote: 'Come for the season. Stay for the morning light.',
    itemsHeading: 'Partner offers',
    items: [
      {
        img: `${base}more-media/pool.jpg`,
        tag: 'Stay',
        title: 'Holiday stay package',
        text: 'Two-night minimum with breakfast for magazine readers.',
      },
      {
        img: `${base}more-media/hotel.jpg`,
        tag: 'Room',
        title: 'Ocean-view rooms',
        text: 'Soft interiors, terrace seating, late checkout on Sundays.',
      },
      {
        img: `${base}more-media/hero.jpg`,
        tag: 'Guest',
        title: 'Welcome amenity',
        text: 'A small island gift for guests who book via Holiday Wave.',
      },
    ],
    visitLabel: 'Resort',
    visitTitle: 'Book Coral Bay',
    shopNote: 'Mention Holiday Wave at reservation for the partner rate.',
    lifestyleLabel: 'Hospitality',
    lifestyleTitle: 'Base for the season',
    lifestyleText:
      'A calm resort base while guests explore fashion, food, and openings.',
    lifestyleImg: `${base}more-media/hotel.jpg`,
    collectionLabel: 'Sponsor · Holiday season',
  },
  {
    id: 'trade-wind',
    name: 'Trade Wind Bank',
    area: 'Punda',
    intro:
      'Financial partner for the season — business support, event backing, and island growth stories.',
    tagline: 'Finance · business · island growth',
    logoLabel: 'TW',
    logoColor: '#d4a84b',
    logoImg: `${base}more-media/logos/trade-wind.png`,
    highlightImg: `${base}more-media/bank.jpg`,
    highlightCaption: 'Season partner',
    heroImg: `${base}more-media/bank.jpg`,
    heroTitle: 'Backing the holiday economy',
    heroText:
      'Trade Wind supports partners and small brands that show up in Fashion, Homes, and Taste this December.',
    quote: 'Local business deserves a polished stage.',
    itemsHeading: 'How they partner',
    items: [
      {
        img: `${base}more-media/bank.jpg`,
        tag: 'Sponsor',
        title: 'Season partner',
        text: 'Logo presence across the app More hub and magazine.',
      },
      {
        img: `${base}more-media/stage.jpg`,
        tag: 'Events',
        title: 'Event support',
        text: 'Backing for holiday openings and partner nights.',
      },
      {
        img: `${base}more-media/event.jpg`,
        tag: 'Story',
        title: 'Growth story',
        text: 'A short feature on island entrepreneurs in the issue.',
      },
    ],
    visitLabel: 'Bank',
    visitTitle: 'Meet Trade Wind',
    shopNote: 'Business clients can ask for the Holiday Wave partner desk.',
    lifestyleLabel: 'Community',
    lifestyleTitle: 'Invested in the island',
    lifestyleText:
      'Not just a logo — real support for the season’s partners.',
    lifestyleImg: `${base}more-media/stage.jpg`,
    collectionLabel: 'Sponsor · Holiday season',
  },
  {
    id: 'plaza-lights',
    name: 'Plaza Lights',
    area: 'Otrobanda',
    intro:
      'Events and nightlife partner — December openings, music nights, and plaza gatherings.',
    tagline: 'Events · music · plaza nights',
    logoLabel: 'PL',
    logoColor: '#e06b8a',
    logoImg: `${base}more-media/logos/plaza-lights.png`,
    highlightImg: `${base}more-media/event.jpg`,
    highlightCaption: 'December opening night',
    heroImg: `${base}more-media/event.jpg`,
    heroTitle: 'Lights on for December',
    heroText:
      'Plaza Lights turns holiday weekends into evenings worth dressing up for — and worth listing in the app.',
    quote: 'The plaza is the living room of the season.',
    itemsHeading: 'Season calendar',
    items: [
      {
        img: `${base}more-media/event.jpg`,
        tag: 'Night',
        title: 'December opening night',
        text: 'Music, partners, and a soft launch for the holiday issue.',
      },
      {
        img: `${base}more-media/stage.jpg`,
        tag: 'Stage',
        title: 'Weekend sessions',
        text: 'Live sets on selected Fridays through New Year.',
      },
      {
        img: `${base}more-media/pool.jpg`,
        tag: 'VIP',
        title: 'Partner lounge',
        text: 'A quiet corner for advertisers and guests.',
      },
    ],
    visitLabel: 'Events',
    visitTitle: 'Join Plaza Lights',
    shopNote: 'Partners get guest list access on opening night — ask for the Holiday Wave list.',
    lifestyleLabel: 'Night',
    lifestyleTitle: 'Where the season gathers',
    lifestyleText:
      'Fashion, food, and homes partners meet under the same lights.',
    lifestyleImg: `${base}more-media/stage.jpg`,
    collectionLabel: 'Sponsor · Holiday season',
  },
]

export function getMorePartner(id: string | undefined) {
  if (!id) return undefined
  return morePartners.find((p) => p.id === id)
}
