const MAGAZINE_URL =
  (process.env.FLIPSNACK_URL ||
    'https://www.flipsnack.com/AD66C5D9E8C/wk-magazine-alfa-1-4-annimated').replace(/\/$/, '');

const APP_STORE_LAUNCH_LABEL = '13 June 2026';
const TEAM_NAME = 'The Blue Wave Fans Team';
const FACEBOOK_URL = 'https://www.facebook.com/profile.php?id=61573224060522';

export function buildWelcomeEmailSubject(): string {
  return "You're riding The Blue Wave! 🌊";
}

export function buildWelcomeEmailPlainText(email: string, siteUrl: string): string {
  return [
    "You're riding The Blue Wave! 🌊",
    '',
    `Thank you for joining us — we have registered you with: ${email}`,
    '',
    'The moment has broken — The Blue Wave is live! What we have been building on the shores of Curaçao is here, and we are glad we can finally show you what we have created.',
    '',
    "The Blue Wave is more than a moment — it's a movement. A celebration of our island's color, culture, and spirit, carried out to the world. We will keep sharing new stories, magazine editions, and updates throughout the FIFA World Cup 2026 tournament.",
    '',
    'THE MAGAZINE IS LIVE',
    'Our flip magazine is online now — free to read.',
    'The best experience to view, hear and read The Blue Wave magazine is on desktop, laptop and iPad. Of course it also works on your mobile phone.',
    'If you have not opened it yet:',
    MAGAZINE_URL,
    '',
    'THE BLUE WAVE APP',
    `From ${APP_STORE_LAUNCH_LABEL}, The Blue Wave app will be available to download for free in the Apple App Store and Google Play.`,
    'The mobile app keeps The Blue Wave Magazine in your pocket: thumb-friendly reading, plus real-time news updates and live score messages and alerts delivered through push technology.',
    '',
    'Keep an eye on your inbox as the tournament unfolds — there is more to come.',
    '',
    'See you in the water,',
    TEAM_NAME,
    'Curaçao',
    '',
    `Visit us: ${siteUrl}`,
    '',
    '© 2026 The Blue Wave Fans · Curaçao',
  ].join('\n');
}

export function buildWelcomeEmailHtml(email: string, siteUrl: string): string {
  const safeEmail = email.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  return `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; color: #333333; line-height: 1.6;">
      <div style="background: #0066CC; padding: 24px; text-align: center;">
        <img src="${siteUrl}/bluewavelogo.png" alt="The Blue Wave" width="200" style="max-width: 200px; height: auto;" />
      </div>
      <div style="padding: 28px 24px; background: #ffffff;">
        <h1 style="color: #0066CC; font-size: 22px; margin: 0 0 20px;">You're riding The Blue Wave! 🌊</h1>
        <p>Thank you for joining us — we have registered you with: <strong>${safeEmail}</strong></p>
        <p>The moment has broken — <strong>The Blue Wave is live!</strong> What we have been building on the shores of Curaçao is here, and we are glad we can finally show you what we have created.</p>
        <p>The Blue Wave is more than a moment — it's a movement. A celebration of our island's color, culture, and spirit, carried out to the world. We will keep sharing new stories, magazine editions, and updates throughout the FIFA World Cup 2026 tournament.</p>
        <h2 style="color: #0066CC; font-size: 18px; margin-top: 24px;">The magazine is live</h2>
        <p>Our flip magazine is online now — <strong>free to read</strong>.</p>
        <p>The best experience to view, hear and read The Blue Wave magazine is on <strong>desktop, laptop and iPad</strong>. Of course it also works on your mobile phone.</p>
        <p>If you have not opened it yet, tap below:</p>
        <p style="text-align: center; margin: 20px 0;">
          <a href="${MAGAZINE_URL}" style="display: inline-block; background: #0066CC; color: #ffffff; text-decoration: none; padding: 12px 22px; border-radius: 8px; font-weight: bold;">Open the magazine →</a>
        </p>
        <h2 style="color: #0066CC; font-size: 18px; margin-top: 24px;">The Blue Wave app — ${APP_STORE_LAUNCH_LABEL}</h2>
        <p>From <strong>${APP_STORE_LAUNCH_LABEL}</strong>, The Blue Wave app will be available to download for <strong>free</strong> in the <strong>Apple App Store</strong> and <strong>Google Play</strong>.</p>
        <p>The mobile app keeps The Blue Wave Magazine in your pocket: thumb-friendly reading, plus real-time news updates and live score messages and alerts delivered through push technology.</p>
        <h2 style="color: #0066CC; font-size: 18px; margin-top: 24px;">Stay connected</h2>
        <p>Like and share our Facebook page to stay in touch with other Blue Wave Fans.</p>
        <p style="text-align: center; margin: 20px 0;">
          <a href="${FACEBOOK_URL}" style="display: inline-block; background: #1877F2; color: #ffffff; text-decoration: none; padding: 12px 22px; border-radius: 8px; font-weight: bold;">Like us on Facebook →</a>
        </p>
        <p>Keep an eye on your inbox as the tournament unfolds — there is more to come.</p>
        <p style="margin-top: 28px;">
          See you in the water,<br />
          <strong style="color: #0066CC;">${TEAM_NAME}</strong><br />
          Curaçao
        </p>
      </div>
      <div style="background: #1a1a2e; color: #aaaaaa; text-align: center; padding: 14px; font-size: 12px;">
        © 2026 The Blue Wave Fans · Curaçao
      </div>
    </div>
  `;
}
