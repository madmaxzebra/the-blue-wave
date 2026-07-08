export type LandingNewStory = {
  slug: string;
  headline: string;
  imageUrl: string;
  imageAlt: string;
};

const APP_ASSET_BASE = 'https://thebluewavefans.com/thebluewaveapp';

/** Featured “New magazine stories” on the Blue Wave landing page. */
export const LANDING_NEW_STORIES: LandingNewStory[] = [
  {
    slug: 'blue-wave-proud-on-the-world-stage',
    headline: 'The Blue Wave made history',
    imageUrl: `${APP_ASSET_BASE}/magazine-heroes/blue-wave-proud-on-the-world-stage.png`,
    imageAlt:
      'Curaçao national team squad photo on the pitch in blue and yellow kits — The Blue Wave at the FIFA World Cup 2026',
  },
  {
    slug: 'guinness-record-smallest-nation-blue-wave',
    headline: 'Officially the smallest',
    imageUrl: `${APP_ASSET_BASE}/magazine-heroes/guinness-record-curacao-certificate.png`,
    imageAlt:
      'Gilbert Martina and a Guinness World Records adjudicator hold the framed certificate',
  },
  {
    slug: 'curacaos-black-panther-eloy-room',
    headline: "Curaçao's Black Panter",
    imageUrl: `${APP_ASSET_BASE}/magazine-heroes/curacaos-black-panther-eloy-room.png`,
    imageAlt: 'Eloy Room during Curaçao’s 0–0 World Cup draw with Ecuador',
  },
];
