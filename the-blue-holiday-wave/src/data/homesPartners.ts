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
}

const base = import.meta.env.BASE_URL

/** Sample real-estate partners — replace with real logos & listings later */
export const homesPartners: PartnerProfile[] = [
  {
    id: 'harbour-view-estates',
    name: 'Harbour View Estates',
    area: 'Scharloo',
    intro:
      'Waterfront homes and renovated townhouses with harbour light and easy city access.',
    tagline: 'Waterfront · townhouse · harbour light',
    logoLabel: 'HV',
    logoColor: '#3d7ea6',
    logoImg: `${base}homes-media/logos/harbour-view.png`,
    highlightImg: `${base}homes-media/villa-1.jpg`,
    highlightCaption: 'Harbour terrace villa',
    heroImg: `${base}homes-media/hero.jpg`,
    heroTitle: 'Live where the water meets the street',
    heroText:
      'Holiday season buyers want light, outdoor space, and a short walk to dinner. This is that shortlist.',
    quote: 'Buy the view. Keep the evenings free.',
    itemsHeading: 'Featured homes',
    items: [
      {
        img: `${base}homes-media/villa-1.jpg`,
        tag: 'Sale',
        title: 'Harbour terrace villa',
        text: 'Three bedrooms, wraparound deck, morning light on the water.',
      },
      {
        img: `${base}homes-media/villa-2.jpg`,
        tag: 'Sale',
        title: 'Garden court residence',
        text: 'Quiet courtyard living, two minutes from the boulevard.',
      },
      {
        img: `${base}homes-media/interior.jpg`,
        tag: 'Open house',
        title: 'Sunday viewing',
        text: 'Styled interiors ready for holiday guests — book a slot.',
      },
    ],
    visitLabel: 'Agency',
    visitTitle: 'Visit Harbour View',
    shopNote: 'Private tours available daily — ask for the December open-house calendar.',
    lifestyleLabel: 'Neighbourhood',
    lifestyleTitle: 'City close, water closer',
    lifestyleText:
      'Scharloo mornings, harbour evenings — homes for people who want both.',
    lifestyleImg: `${base}homes-media/terrace.jpg`,
    collectionLabel: 'Listings · Holiday season',
  },
  {
    id: 'coral-keys-realty',
    name: 'Coral Keys Realty',
    area: 'Jan Thiel',
    intro:
      'Resort-side apartments and villas for holiday living, rentals, and long stays.',
    tagline: 'Resort · villa · long stay',
    logoLabel: 'CK',
    logoColor: '#d4a84b',
    logoImg: `${base}homes-media/logos/coral-keys.png`,
    highlightImg: `${base}homes-media/villa-2.jpg`,
    highlightCaption: 'Jan Thiel pool villa',
    heroImg: `${base}homes-media/villa-3.jpg`,
    heroTitle: 'Keys to the quieter coast',
    heroText:
      'Pool decks, trade-wind evenings, and homes that work for December guests and year-round life.',
    quote: 'Arrive once. Stay as long as you like.',
    itemsHeading: 'Featured homes',
    items: [
      {
        img: `${base}homes-media/villa-3.jpg`,
        tag: 'Sale',
        title: 'Pool villa with guest wing',
        text: 'Four bedrooms, outdoor kitchen, space for holiday visitors.',
      },
      {
        img: `${base}homes-media/terrace.jpg`,
        tag: 'Rent',
        title: 'December long stay',
        text: 'Furnished terrace apartment — two-week minimum.',
      },
      {
        img: `${base}homes-media/interior.jpg`,
        tag: 'New',
        title: 'Turnkey interior',
        text: 'Move in with a suitcase — finishes already done.',
      },
    ],
    visitLabel: 'Agency',
    visitTitle: 'Talk to Coral Keys',
    shopNote: 'Ask for the holiday rental sheet and owner meet-and-greet slots.',
    lifestyleLabel: 'Lifestyle',
    lifestyleTitle: 'Coast days, easy nights',
    lifestyleText:
      'Jan Thiel living for buyers who want resort energy without hotel noise.',
    lifestyleImg: `${base}homes-media/villa-2.jpg`,
    collectionLabel: 'Listings · Holiday season',
  },
  {
    id: 'blue-ridge-properties',
    name: 'Blue Ridge Properties',
    area: 'Sint Michiel',
    intro:
      'Hillside homes with wide views — modern builds and land opportunities for next year.',
    tagline: 'Hillside · view · build-ready',
    logoLabel: 'BR',
    logoColor: '#8b2344',
    logoImg: `${base}homes-media/logos/blue-ridge.png`,
    highlightImg: `${base}homes-media/villa-3.jpg`,
    highlightCaption: 'Ridge modern home',
    heroImg: `${base}homes-media/terrace.jpg`,
    heroTitle: 'Above the bay, under the sky',
    heroText:
      'Elevated lots and finished homes for clients who want horizon, privacy, and holiday quiet.',
    quote: 'The higher the ridge, the longer the sunset.',
    itemsHeading: 'Featured homes',
    items: [
      {
        img: `${base}homes-media/hero.jpg`,
        tag: 'Sale',
        title: 'Ridge modern home',
        text: 'Glass, concrete, and a terrace that faces west.',
      },
      {
        img: `${base}homes-media/villa-1.jpg`,
        tag: 'Land',
        title: 'Build-ready plot',
        text: 'Cleared lot with permits guidance included.',
      },
      {
        img: `${base}homes-media/interior.jpg`,
        tag: 'Sale',
        title: 'Architect interior',
        text: 'Open plan, high ceilings, night lighting designed in.',
      },
    ],
    visitLabel: 'Agency',
    visitTitle: 'Meet Blue Ridge',
    shopNote: 'Weekend ridge tours by appointment — sunset slots book first.',
    lifestyleLabel: 'Outlook',
    lifestyleTitle: 'Quiet elevation',
    lifestyleText:
      'For buyers who want space between neighbours and a clear line to the sea.',
    lifestyleImg: `${base}homes-media/villa-3.jpg`,
    collectionLabel: 'Listings · Holiday season',
  },
]

export function getHomesPartner(id: string | undefined) {
  if (!id) return undefined
  return homesPartners.find((p) => p.id === id)
}
