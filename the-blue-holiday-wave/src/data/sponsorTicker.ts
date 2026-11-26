/** Sponsor logos — same roster as The Blue Wave live hub (Apr–Jun 2026). */
export type SponsorTickerItem = {
  logo: string
  logoAlt: string
  href: string
  size?: 'compact' | 'medium' | 'large' | 'square' | 'wide'
  scale?: number
}

export const SPONSOR_TICKER: SponsorTickerItem[] = [
  {
    logo: 'sponsors/freeport-jewelers.png',
    logoAlt: 'Freeport Jewelers',
    href: 'https://www.freeportjewelers.com/',
    scale: 1.21,
  },
  {
    logo: 'sponsors/ennia.png',
    logoAlt: 'ennia',
    href: 'https://www.ennia.com/',
    size: 'compact',
  },
  {
    logo: 'sponsors/40b-to-the-max.png',
    logoAlt: '40B To The Max Sports Bar',
    href: 'https://www.facebook.com/TotheMaxSportsBarat40B',
    size: 'square',
  },
  {
    logo: 'sponsors/de-visboer.png',
    logoAlt: 'de VISBOER',
    href: 'https://www.facebook.com/profile.php?id=61550738927415',
    size: 'square',
    scale: 1.13,
  },
  {
    logo: 'sponsors/dewars.png',
    logoAlt: "Dewar's",
    href: 'https://www.facebook.com/dewars',
    size: 'compact',
  },
  {
    logo: 'sponsors/bocas.png',
    logoAlt: 'Bocas Restaurant',
    href: 'https://www.facebook.com/bocascuracao',
    size: 'square',
  },
  {
    logo: 'sponsors/brasa.png',
    logoAlt: 'un BRASA pa TUR',
    href: 'https://www.facebook.com/enjoy.brasa.beer',
    size: 'medium',
  },
  {
    logo: 'sponsors/bacardi-dark.png',
    logoAlt: 'Bacardí',
    href: 'https://www.facebook.com/Bacardi.Global',
    size: 'compact',
    scale: 1.35,
  },
  {
    logo: 'sponsors/polar.png',
    logoAlt: 'Polar',
    href: 'https://www.facebook.com/polarcuracao',
    size: 'large',
  },
  {
    logo: 'sponsors/elevation.png',
    logoAlt: 'Élévation Rooftop Bar & Cuisine',
    href: 'https://www.facebook.com/elevation.westend/',
    scale: 1.15,
  },
  {
    logo: 'sponsors/sky-c-dark.png',
    logoAlt: 'SKY-C Solutions',
    href: 'https://www.skycsolutions.com/',
    size: 'wide',
    scale: 1.1,
  },
  {
    logo: 'sponsors/the-green-house.png',
    logoAlt: 'The Green House — Westend Otrobanda & Mambo Beach',
    href: 'https://thegreenhousecw.com/',
    size: 'wide',
    scale: 1.12,
  },
  {
    logo: 'sponsors/greenhouse.png',
    logoAlt: 'The Greenhouse Lounge & Sportsbar',
    href: 'https://www.facebook.com/thegreenhouseloungeandsportsbar',
    size: 'square',
  },
]