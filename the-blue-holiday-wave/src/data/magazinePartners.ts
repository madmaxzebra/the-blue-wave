import type { PartnerProfile } from './homesPartners'

const base = import.meta.env.BASE_URL

/** Sample magazine feature partners */
export const magazinePartners: PartnerProfile[] = [
  {
    id: 'island-ink',
    name: 'Island Ink Studio',
    area: 'Editorial',
    intro:
      'Photography and fashion editorials for the holiday issue — light, style, and island nights.',
    tagline: 'Photo · editorial · print',
    logoLabel: 'II',
    logoColor: '#c9a227',
    logoImg: `${base}magazine-media/logos/island-ink.png`,
    highlightImg: `${base}magazine-media/story-1.jpg`,
    highlightCaption: 'Holiday cover story',
    heroImg: `${base}magazine-media/hero.jpg`,
    heroTitle: 'Stories made for the printed page',
    heroText:
      'Island Ink brings the lookbook energy into the Holiday Wave magazine — full spreads, quiet captions, real light.',
    quote: 'A good page feels like an evening well spent.',
    itemsHeading: 'In this issue',
    items: [
      {
        img: `${base}magazine-media/cover.jpg`,
        tag: 'Cover',
        title: 'Holiday cover story',
        text: 'Lead fashion editorial for the December opener.',
      },
      {
        img: `${base}magazine-media/story-2.jpg`,
        tag: 'Spread',
        title: 'City after dark',
        text: 'Eight pages of Willemstad nights and style.',
      },
      {
        img: `${base}magazine-media/desk.jpg`,
        tag: 'Behind',
        title: 'Studio notes',
        text: 'How the shoot was planned for print colour.',
      },
    ],
    visitLabel: 'Studio',
    visitTitle: 'Work with Island Ink',
    shopNote: 'Magazine partners get a full spread + digital version in the app.',
    lifestyleLabel: 'Print',
    lifestyleTitle: 'Collector’s pages',
    lifestyleText:
      'Made for the PDF archive and the coffee-table print when it lands.',
    lifestyleImg: `${base}magazine-media/story-3.jpg`,
    collectionLabel: 'Feature · Holiday edition',
  },
  {
    id: 'gold-page',
    name: 'Gold Page Media',
    area: 'Advertising',
    intro:
      'Full-page and half-page holiday ads — clean layouts that match The Blue Wave look.',
    tagline: 'Ads · layout · brand pages',
    logoLabel: 'GP',
    logoColor: '#5aa0c8',
    logoImg: `${base}magazine-media/logos/gold-page.png`,
    highlightImg: `${base}magazine-media/story-2.jpg`,
    highlightCaption: 'Partner ad spread',
    heroImg: `${base}magazine-media/story-2.jpg`,
    heroTitle: 'Your brand, magazine-ready',
    heroText:
      'Gold Page designs advertiser pages that feel editorial — not noisy — so partners look premium next to the stories.',
    quote: 'Advertising should feel like part of the issue.',
    itemsHeading: 'Ad formats',
    items: [
      {
        img: `${base}magazine-media/story-2.jpg`,
        tag: 'Full',
        title: 'Full-page feature',
        text: 'Hero image, short copy, QR to your partner page in the app.',
      },
      {
        img: `${base}magazine-media/story-3.jpg`,
        tag: 'Half',
        title: 'Half-page slot',
        text: 'Perfect for boutiques and restaurants.',
      },
      {
        img: `${base}magazine-media/cover.jpg`,
        tag: 'Series',
        title: '3-issue package',
        text: 'Holiday + follow-up editions at a partner rate.',
      },
    ],
    visitLabel: 'Media',
    visitTitle: 'Book Gold Page',
    shopNote: 'Deadline for December ads: confirm artwork two weeks before print lock.',
    lifestyleLabel: 'Brand',
    lifestyleTitle: 'Seen in Holiday Wave',
    lifestyleText:
      'Partners get the magazine placement plus a link from the app listing.',
    lifestyleImg: `${base}magazine-media/desk.jpg`,
    collectionLabel: 'Advertising · Holiday edition',
  },
  {
    id: 'wave-press',
    name: 'Wave Press',
    area: 'Print',
    intro:
      'Print and finishing for the collector’s PDF and any short holiday print run.',
    tagline: 'Print · finish · archive',
    logoLabel: 'WP',
    logoColor: '#e06b8a',
    logoImg: `${base}magazine-media/logos/wave-press.png`,
    highlightImg: `${base}magazine-media/story-3.jpg`,
    highlightCaption: 'Collector finish',
    heroImg: `${base}magazine-media/desk.jpg`,
    heroTitle: 'From screen to keepsake',
    heroText:
      'Wave Press handles colour, paper feel, and the small-run holiday prints partners love to hand out.',
    quote: 'If it feels good in the hand, it gets kept.',
    itemsHeading: 'Print options',
    items: [
      {
        img: `${base}magazine-media/hero.jpg`,
        tag: 'Paper',
        title: 'Soft-touch cover',
        text: 'Matte cover with gold foil option for sponsors.',
      },
      {
        img: `${base}magazine-media/story-1.jpg`,
        tag: 'Inside',
        title: 'Gallery stock',
        text: 'Pages that hold photo blacks and gold highlights.',
      },
      {
        img: `${base}magazine-media/cover.jpg`,
        tag: 'Run',
        title: 'Short holiday run',
        text: 'Limited copies for partners and VIP guests.',
      },
    ],
    visitLabel: 'Press',
    visitTitle: 'Talk to Wave Press',
    shopNote: 'Partner print packs can include 25–100 copies with your logo page.',
    lifestyleLabel: 'Archive',
    lifestyleTitle: 'Worth keeping',
    lifestyleText:
      'The same care that goes into the PDF collector’s edition, on paper.',
    lifestyleImg: `${base}magazine-media/story-1.jpg`,
    collectionLabel: 'Print · Holiday edition',
  },
]

export function getMagazinePartner(id: string | undefined) {
  if (!id) return undefined
  return magazinePartners.find((p) => p.id === id)
}
