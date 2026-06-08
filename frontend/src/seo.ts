import { FACEBOOK_URL } from './FacebookLink';

export const SITE_URL = 'https://www.thebluewavefans.com';
export const SITE_TITLE = 'The Blue Wave | FIFA World Cup 2026 Magazine';
export const SITE_DESCRIPTION =
  'Read The Blue Wave — the FIFA World Cup 2026 magazine from Curaçao. Flip through stories, fan culture, and Caribbean soccer spirit online for free.';
export const SITE_KEYWORDS =
  'FIFA World Cup 2026, World Cup magazine, Curaçao soccer, Caribbean football, The Blue Wave, WK magazine, flip magazine, Curaçao World Cup fans';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/flipsnack-launch-promo.png`;
export const DEFAULT_FLIPSNACK_URL =
  'https://www.flipsnack.com/AD66C5D9E8C/wk-magazine-alfa-1-4-annimated';

type MetaSpec = [string, string, 'name' | 'property'];

function upsertMeta(key: string, content: string, attr: 'name' | 'property') {
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function upsertLink(rel: string, href: string) {
  let el = document.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}

function upsertJsonLd(id: string, data: Record<string, unknown>) {
  let el = document.getElementById(id) as HTMLScriptElement | null;
  if (!el) {
    el = document.createElement('script');
    el.id = id;
    el.type = 'application/ld+json';
    document.head.appendChild(el);
  }
  el.textContent = JSON.stringify(data);
}

export function applySeo(options?: { flipsnackUrl?: string }) {
  if (typeof document === 'undefined') return;

  const flipsnackUrl = options?.flipsnackUrl || DEFAULT_FLIPSNACK_URL;
  const pageUrl =
    typeof window !== 'undefined' ? window.location.href.split('#')[0] : SITE_URL;
  const canonical = SITE_URL.endsWith('/') ? SITE_URL : `${SITE_URL}/`;

  document.title = SITE_TITLE;
  document.documentElement.lang = 'en';

  upsertLink('canonical', canonical);

  const metas: MetaSpec[] = [
    ['description', SITE_DESCRIPTION, 'name'],
    ['keywords', SITE_KEYWORDS, 'name'],
    ['robots', 'index, follow, max-image-preview:large', 'name'],
    ['author', 'Zebra Productions', 'name'],
    ['theme-color', '#0066CC', 'name'],
    ['og:type', 'website', 'property'],
    ['og:site_name', 'The Blue Wave', 'property'],
    ['og:locale', 'en_US', 'property'],
    ['og:url', pageUrl, 'property'],
    ['og:title', SITE_TITLE, 'property'],
    ['og:description', SITE_DESCRIPTION, 'property'],
    ['og:image', DEFAULT_OG_IMAGE, 'property'],
    ['og:image:alt', 'The Blue Wave FIFA World Cup 2026 magazine cover preview', 'property'],
    ['twitter:card', 'summary_large_image', 'name'],
    ['twitter:title', SITE_TITLE, 'name'],
    ['twitter:description', SITE_DESCRIPTION, 'name'],
    ['twitter:image', DEFAULT_OG_IMAGE, 'name'],
    ['twitter:image:alt', 'The Blue Wave FIFA World Cup 2026 magazine cover preview', 'name'],
  ];

  metas.forEach(([key, content, attr]) => upsertMeta(key, content, attr));

  upsertJsonLd('bluewave-seo-jsonld', {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        url: SITE_URL,
        name: 'The Blue Wave',
        description: SITE_DESCRIPTION,
        inLanguage: 'en',
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
      {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'The Blue Wave',
        url: SITE_URL,
        logo: `${SITE_URL}/logo.png`,
        sameAs: [FACEBOOK_URL],
      },
      {
        '@type': 'WebPage',
        '@id': `${SITE_URL}/#webpage`,
        url: canonical,
        name: SITE_TITLE,
        description: SITE_DESCRIPTION,
        isPartOf: { '@id': `${SITE_URL}/#website` },
        about: {
          '@type': 'SportsEvent',
          name: 'FIFA World Cup 2026',
          location: { '@type': 'Place', name: 'North America' },
        },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: DEFAULT_OG_IMAGE,
        },
      },
      {
        '@type': 'Periodical',
        '@id': `${SITE_URL}/#magazine`,
        name: 'The Blue Wave Magazine',
        description:
          'A FIFA World Cup 2026 flip magazine celebrating soccer culture in Curaçao and the Caribbean.',
        url: flipsnackUrl,
        inLanguage: 'en',
        publisher: { '@id': `${SITE_URL}/#organization` },
      },
    ],
  });
}
