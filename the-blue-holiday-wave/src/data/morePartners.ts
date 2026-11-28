import type { PartnerProfile } from './homesPartners'

const base = import.meta.env.BASE_URL

/** Official sponsors / More-hub partners — real Curaçao businesses */
export const morePartners: PartnerProfile[] = [
  {
    id: 'harbor-hotel-curacao',
    name: 'Harbor Hotel & Casino',
    area: 'Otrobanda · Willemstad',
    intro:
      'Harbor Hotel & Casino is a boutique hotel in Otrobanda, in the UNESCO World Heritage centre of Willemstad. Harbor-view rooms, an outdoor pool, a waterfront restaurant, and the Royal Casino all under one roof.',
    tagline: 'Boutique hotel · harbor views · pool',
    logoLabel: 'HH',
    logoColor: '#6b8f8a',
    logoImg: `${base}more-media/logos/harbor-hotel-curacao-gold.png?v=20261127logo`,
    highlightImg: `${base}more-media/harbor-hotel-curacao-pool.jpg`,
    highlightCaption: 'Pool in the middle of Otrobanda',
    heroImg: `${base}more-media/harbor-hotel-curacao-exterior.jpg`,
    heroTitle: 'Harbor-view haven in Otrobanda',
    heroText:
      'Steps from the Handelskade and the colourful Willemstad skyline, Harbor Hotel looks out over Sint Anna Bay. A calm base for the holidays, with dining, a pool, and the city on your doorstep.',
    quote: 'Elegance & serenity, in a city that celebrates the joy of colours.',
    itemsHeading: 'Stay at Harbor',
    items: [
      {
        img: `${base}more-media/harbor-hotel-curacao-pool.jpg`,
        tag: 'Pool',
        title: 'Outdoor pool',
        text: 'Shaded loungers, a cocktail from the bar, and the trade wind in the middle of the city.',
      },
      {
        img: `${base}more-media/harbor-hotel-curacao-room-view.jpg`,
        tag: 'Room',
        title: 'Harbor-view rooms',
        text: 'Harbor View King Rooms, some with a balcony, look over the bay and the Willemstad waterfront.',
      },
      {
        img: `${base}more-media/harbor-hotel-curacao-breakfast.jpg`,
        tag: 'Dining',
        title: 'Harbor Restaurant',
        text: 'Breakfast, lunch, and dinner by the bay. Open daily from 7:00 AM till late.',
      },
    ],
    visitLabel: 'Hotel',
    visitTitle: 'Visit Harbor Hotel',
    shopNote:
      'Breedestraat, Otrobanda, Willemstad. Check-in 3 PM, check-out 12 PM. Book on the hotel website or call.',
    lifestyleLabel: 'Evening',
    lifestyleTitle: 'Dinner over the bay',
    lifestyleText:
      'Candle-lit tables at Harbor Restaurant look across Sint Anna Bay to the lights of Willemstad.',
    lifestyleImg: `${base}more-media/harbor-hotel-curacao-dinner-bay.jpg`,
    collectionLabel: 'Sponsor · Holidays season',
    phone: '+599 9 841 0099',
    email: 'hello@harborhotelcuracao.com',
    websiteUrl: 'https://www.harborhotelcuracao.com/',
    websiteLabel: 'harborhotelcuracao.com',
    address: 'Breedestraat z/n, Otrobanda, Willemstad, Curaçao',
    openingHours: 'Check-in 3 PM · Check-out 12 PM · Restaurant daily 7:00 AM till late',
    mapsUrl: 'https://maps.google.com/?q=Harbor+Hotel+Casino+Breedestraat+Willemstad+Curaçao',
    mapsEmbed: 'https://maps.google.com/maps?q=12.1075,-68.9376&z=16&output=embed&iwloc=',
  },
  {
    id: 'maduro-curiels-bank',
    name: "Maduro & Curiel's Bank",
    area: 'Punda · Willemstad',
    intro:
      "Maduro & Curiel's Bank (MCB) is the island's first commercial bank. It opened in Willemstad on 2 January 1917. Today it offers accounts, cards, loans, and Bankomatiko ATMs for personal and business clients in Curaçao.",
    tagline: 'Banking · since 1917 · Bankomatiko ATMs',
    logoLabel: 'MCB',
    logoColor: '#193b66',
    logoImg: `${base}more-media/logos/maduro-curiels-bank-gold.png?v=20261127logo`,
    highlightImg: `${base}more-media/maduro-curiels-bank-card-payment.jpg`,
    highlightCaption: 'Everyday banking',
    heroImg: `${base}more-media/maduro-curiels-bank-buildings.jpg`,
    heroTitle: 'A bank with island roots',
    heroText:
      'MCB grew out of the port trade of Curaçao more than a century ago. You can still find it today at Plasa Jojo Correa, in the old centre of Punda.',
    quote: 'We help people prosper, because we care.',
    itemsHeading: 'Banking and community',
    items: [
      {
        img: `${base}more-media/maduro-curiels-bank-service-desk.jpg`,
        tag: 'Banking',
        title: 'Personal and business',
        text: 'Current and savings accounts, cards, loans, and mortgages, with online and mobile banking.',
      },
      {
        img: `${base}more-media/maduro-curiels-bank-corporate-challenge.jpg`,
        tag: 'Community',
        title: 'Sponsored events',
        text: 'MCB backs community events, such as the Curaçao Corporate Challenge.',
      },
      {
        img: `${base}more-media/maduro-curiels-bank-financial-literacy.jpg`,
        tag: 'Learning',
        title: 'Skol di Plaka',
        text: 'A financial literacy project that teaches secondary-school students to manage money.',
      },
    ],
    visitLabel: 'Bank',
    visitTitle: "Meet Maduro & Curiel's Bank",
    shopNote:
      'Plasa Jojo Correa 2-4, Punda, Willemstad. Call or WhatsApp +599 9 466 1111 for service and questions.',
    lifestyleLabel: 'History',
    lifestyleTitle: 'Open since 1917',
    lifestyleText:
      "Maduro's Bank opened its doors on 2 January 1917 and later joined with Curiel's Bank, founded in 1927.",
    lifestyleImg: `${base}more-media/maduro-curiels-bank-history.jpg`,
    collectionLabel: 'Sponsor · Holidays season',
    phone: '+599 9 466 1111',
    email: 'customer.support@mcb-bank.com',
    whatsapp: '59994661111',
    websiteUrl: 'https://www.mcb-bank.com/personal',
    websiteLabel: 'mcb-bank.com',
    address: "Plasa Jojo Correa 2-4, Punda, Willemstad, Curaçao",
    openingHours: 'Phone service Mon–Fri 8:00–20:00 · Sat 9:00–13:00 · WhatsApp Mon–Fri 8:00–17:30',
    mapsUrl: "https://maps.google.com/?q=Maduro+%26+Curiel%27s+Bank+Plasa+Jojo+Correa+Willemstad+Curaçao",
    mapsEmbed: 'https://maps.google.com/maps?q=12.1063,-68.9330&z=16&output=embed&iwloc=',
  },
  {
    id: 'curacao-north-sea-jazz',
    name: 'Curaçao North Sea Jazz Festival',
    area: 'World Trade Center · Piscadera Bay',
    intro:
      'The Curaçao North Sea Jazz Festival is the island’s big music weekend. The 2026 edition ran from 3 to 5 September at the World Trade Center at Piscadera Bay, with J Balvin, Sean Paul, The Jacksons, and many more.',
    tagline: 'Festival · three stages · jazz, soul, Latin',
    logoLabel: 'NSJ',
    logoColor: '#1d8fb5',
    logoImg: `${base}more-media/logos/curacao-north-sea-jazz-gold.png?v=20261127logo`,
    highlightImg: `${base}more-media/curacao-north-sea-jazz-aftermovie.jpg`,
    highlightCaption: 'Live on stage at CNSJ',
    heroImg: `${base}more-media/curacao-north-sea-jazz-festival-stage.jpg`,
    heroTitle: 'Three nights of live music',
    heroText:
      'Two outdoor stages and one indoor stage at the World Trade Center, with the sea at Piscadera Bay close by. Doors open at 6:00 PM on every festival day.',
    quote: 'Three nights. Three stages. One island.',
    itemsHeading: 'Festival highlights',
    items: [
      {
        img: `${base}more-media/curacao-north-sea-jazz-aftermovie.jpg`,
        tag: 'Stage',
        title: 'Three stages',
        text: 'Two outdoor stages and one indoor stage, with seating at the indoor stage.',
      },
      {
        img: `${base}more-media/curacao-north-sea-jazz-afro23.jpg`,
        tag: 'Pre-show',
        title: 'Free opening concert',
        text: 'Afro 23 opened the 2026 festival with a free concert at Kura Hulanda Village on 1 September.',
      },
      {
        img: `${base}more-media/curacao-north-sea-jazz-jazz-stage.jpg`,
        tag: 'Line-up',
        title: 'Jazz and beyond',
        text: 'From Branford Marsalis and Monty Alexander to Latin, soul, and reggae acts.',
      },
    ],
    visitLabel: 'Festival',
    visitTitle: 'Plan your CNSJ night',
    shopNote:
      'At the World Trade Center, Piscadera Bay. Free parking and shuttles from Sambil, Rif Stadium, and Velt Veeris with your festival ticket.',
    lifestyleLabel: 'App',
    lifestyleTitle: 'Take it with you',
    lifestyleText:
      'The festival has its own app for visitors, with the programme and festival info on your phone.',
    lifestyleImg: `${base}more-media/curacao-north-sea-jazz-willemstad.jpg`,
    collectionLabel: 'Sponsor · Holidays season',
    phone: '+599 9 522 5299',
    email: 'info@curacaonorthseajazz.com',
    websiteUrl: 'https://www.curacaonorthseajazz.com/en/',
    websiteLabel: 'curacaonorthseajazz.com',
    address: 'World Trade Center Curaçao, Piscadera Bay, Willemstad, Curaçao',
    openingHours: 'Festival days: doors open 6:00 PM · Latest edition 3–5 September 2026',
    mapsUrl: 'https://maps.google.com/?q=World+Trade+Center+Curaçao+Piscadera+Bay',
    mapsEmbed: 'https://maps.google.com/maps?q=12.1201,-68.9649&z=16&output=embed&iwloc=',
  },
]

export function getMorePartner(id: string | undefined) {
  if (!id) return undefined
  return morePartners.find((p) => p.id === id)
}
