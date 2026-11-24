import type { PartnerProfile } from './homesPartners'

const base = import.meta.env.BASE_URL

export const morePartners: PartnerProfile[] = [
  {
    id: 'avila-beach-hotel',
    name: 'Avila Beach Hotel',
    area: 'Pietermaai',
    intro:
      "Curaçao's most iconic beach hotel — a heritage property on the water in Pietermaai with three distinct wings, a private beach, and decades of island soul. Centrally located, with everything from a full spa and restaurants to shopping and local bites on-site.",
    tagline: 'Iconic heritage hotel · private beach · island soul',
    logoLabel: 'AV',
    logoColor: '#0A4B8C',
    logoImg: 'https://logo.clearbit.com/avilabeachhotel.com',
    highlightImg: `${base}more-media/hotel.jpg`,
    highlightCaption: 'Avila Beach Hotel on the waterfront',
    heroImg: `${base}more-media/hero.jpg`,
    heroTitle: "Curaçao's most beloved hotel",
    heroText:
      'Three unique wings — the Octagon, the Caribbean Oceanfront Blues, and the classic La Belle Alliance — each with its own character. One hotel that feels like the whole island.',
    quote: 'Centrally located. Beachfront. Authentic Soul.',
    itemsHeading: 'What they offer',
    items: [
      {
        img: `${base}more-media/pool.jpg`,
        tag: 'Beach',
        title: 'Private beach & pool',
        text: "The island's favourite hotel beach — calm water, sun loungers, and trade-wind afternoons.",
      },
      {
        img: `${base}more-media/hotel.jpg`,
        tag: 'Stay',
        title: 'Three hotel wings',
        text: 'Oceanfront rooms, heritage suites, and private apartments — pick your style.',
      },
      {
        img: `${base}more-media/event.jpg`,
        tag: 'Dining',
        title: 'Restaurants on-site',
        text: 'From breakfast to late dinner — everything within steps of your room.',
      },
    ],
    visitLabel: 'Hotel',
    visitTitle: 'Book at Avila Beach Hotel',
    shopNote: 'Holiday packages available December — mention Blue Holiday Wave for the partner rate.',
    lifestyleLabel: 'Island life',
    lifestyleTitle: 'Wake up on the water',
    lifestyleText:
      'Mornings on a private beach, afternoons exploring Pietermaai, evenings in the hotel restaurant — the full Curaçao holiday in one address.',
    lifestyleImg: `${base}more-media/pool.jpg`,
    collectionLabel: 'Hotel · Holiday season',
    address: 'Penstraat 130, Pietermaai, Willemstad, Curaçao',
    hours: 'Reception open 24/7',
    phone: '+599 9 788 1949',
    whatsapp: '59997881949',
    websiteUrl: 'https://www.avilabeachhotel.com',
    websiteLabel: 'avilabeachhotel.com',
    mapsEmbed: 'https://maps.google.com/maps?q=12.1022,-68.9220&z=16&output=embed&iwloc=',
    mapsUrl: 'https://maps.google.com/?q=Avila+Beach+Hotel+Penstraat+130+Willemstad+Curaçao',
  },
  {
    id: 'baoase',
    name: 'Baoase Luxury Resort',
    area: 'Marie Pompoen',
    intro:
      "Curaçao's most exclusive boutique resort — just 23 villas and suites on a private beach between Willemstad and Seaquarium Beach. Baoase has been rated among the top luxury resorts in the Caribbean. Individually designed spaces, a world-class beach restaurant, and total privacy.",
    tagline: 'Boutique luxury · private beach · 23 villas',
    logoLabel: 'BA',
    logoColor: '#1A3A2A',
    logoImg: 'https://logo.clearbit.com/baoase.com',
    highlightImg: `${base}more-media/pool.jpg`,
    highlightCaption: 'Private beach villa',
    heroImg: `${base}more-media/hero.jpg`,
    heroTitle: 'The most exclusive address on the island',
    heroText:
      'Only 23 villas and suites on a private beach — Baoase is for guests who want total luxury, total privacy, and the best beach restaurant on the island.',
    quote: 'Arrive. Breathe. Stay as long as you like.',
    itemsHeading: 'What they offer',
    items: [
      {
        img: `${base}more-media/pool.jpg`,
        tag: 'Villas',
        title: 'Private pool villas',
        text: '23 individually designed suites and villas — each with private outdoor space.',
      },
      {
        img: `${base}more-media/hotel.jpg`,
        tag: 'Beach',
        title: 'Private beach & restaurant',
        text: 'The Baoase beach restaurant is one of the finest dining experiences on the island.',
      },
      {
        img: `${base}more-media/stage.jpg`,
        tag: 'Spa',
        title: 'Wellness & spa',
        text: 'Full spa treatments, yoga, and a tranquil pool for complete relaxation.',
      },
    ],
    visitLabel: 'Luxury resort',
    visitTitle: 'Reserve at Baoase',
    shopNote: 'December is peak season — reserve early. Restaurant open to non-guests by reservation.',
    lifestyleLabel: 'Luxury',
    lifestyleTitle: 'The Caribbean at its finest',
    lifestyleText:
      "Whether you stay or just dine at the beach restaurant — Baoase represents the best Curaçao has to offer. It's the island's most talked-about address.",
    lifestyleImg: `${base}more-media/hotel.jpg`,
    collectionLabel: 'Luxury resort · Holiday season',
    address: 'Winterswijkstraat 2, Marie Pompoen, Willemstad, Curaçao',
    hours: 'Reception open 24/7 · Restaurant open to guests & reservations',
    phone: '+599 9 461 1799',
    whatsapp: '59994611799',
    websiteUrl: 'https://baoase.com',
    websiteLabel: 'baoase.com',
    mapsEmbed: 'https://maps.google.com/maps?q=12.0966,-68.9115&z=16&output=embed&iwloc=',
    mapsUrl: 'https://maps.google.com/?q=Baoase+Luxury+Resort+Winterswijkstraat+2+Curaçao',
  },
  {
    id: 'renaissance-curacao',
    name: 'Renaissance Wind Creek Curaçao Resort',
    area: 'Otrobanda',
    intro:
      "A 5-star beachfront resort in the heart of Willemstad — the Renaissance Wind Creek sits right on the waterfront in Otrobanda with stunning harbour views, a private elevated beach, an infinity pool, casino, multiple restaurants, and sophisticated event spaces.",
    tagline: '5-star resort · harbour views · private beach',
    logoLabel: 'RC',
    logoColor: '#8B1A1A',
    logoImg: 'https://logo.clearbit.com/renaissancecuracao.com',
    highlightImg: `${base}more-media/hotel.jpg`,
    highlightCaption: 'Renaissance Wind Creek waterfront',
    heroImg: `${base}more-media/hero.jpg`,
    heroTitle: 'Five-star luxury in the heart of Willemstad',
    heroText:
      'Steps from Punda, the floating bridge, and all of Willemstad — the Renaissance is the most centrally located luxury resort on the island, with its own private beach, casino, and world-class restaurants.',
    quote: 'Scenic luxury in the historical city of Willemstad.',
    itemsHeading: 'What they offer',
    items: [
      {
        img: `${base}more-media/pool.jpg`,
        tag: 'Beach',
        title: 'Private elevated beach',
        text: 'Pristine white sands and an infinity pool overlooking the ocean.',
      },
      {
        img: `${base}more-media/hotel.jpg`,
        tag: 'Rooms',
        title: 'City & ocean views',
        text: "Plush rooms with harbour or ocean views — steps from Willemstad's best restaurants.",
      },
      {
        img: `${base}more-media/event.jpg`,
        tag: 'Casino',
        title: 'Wind Creek Casino',
        text: 'Full casino entertainment — open late for a holiday night out.',
      },
    ],
    visitLabel: '5-star resort',
    visitTitle: 'Book at Renaissance',
    shopNote: 'Holiday packages available December — mention Blue Holiday Wave for the partner rate.',
    lifestyleLabel: 'City luxury',
    lifestyleTitle: 'The city is your lobby',
    lifestyleText:
      "Punda, the Queen Emma Bridge, and all of Willemstad's shopping and dining are within walking distance — the Renaissance is the city hotel that has everything.",
    lifestyleImg: `${base}more-media/pool.jpg`,
    collectionLabel: '5-star resort · Holiday season',
    address: 'Baden Powellweg 1, Otrobanda, Willemstad, Curaçao',
    hours: 'Reception open 24/7',
    phone: '+599 9 435 5000',
    whatsapp: '59994355000',
    websiteUrl: 'https://renaissancecuracao.com',
    websiteLabel: 'renaissancecuracao.com',
    mapsEmbed: 'https://maps.google.com/maps?q=12.1079,-68.9354&z=16&output=embed&iwloc=',
    mapsUrl: 'https://maps.google.com/?q=Renaissance+Wind+Creek+Curacao+Resort+Baden+Powellweg+1',
  },
]

export function getMorePartner(id: string | undefined) {
  if (!id) return undefined
  return morePartners.find((p) => p.id === id)
}
