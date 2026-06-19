import { getSiteUrl } from './env';

const TEAM_NAME = 'The Blue Wave Fans Team';

export function buildBroadcastEmailHtml(subject: string, messageHtml: string, siteUrl?: string): string {
  const site = (siteUrl || getSiteUrl()).replace(/\/$/, '');
  const safeSubject = escapeHtml(subject);

  return `
    <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0 auto; color: #333333; line-height: 1.6;">
      <div style="background: #0066CC; padding: 24px; text-align: center;">
        <img src="${site}/bluewavelogo.png" alt="The Blue Wave" width="200" style="max-width: 200px; height: auto;" />
      </div>
      <div style="padding: 28px 24px; background: #ffffff;">
        <h1 style="color: #0066CC; font-size: 22px; margin: 0 0 20px;">${safeSubject}</h1>
        ${messageHtml}
        <p style="margin-top: 28px;">See you in the water,<br /><strong>${TEAM_NAME}</strong><br />Curaçao</p>
        <p style="color: #666; font-size: 12px; margin-top: 24px;">
          <a href="${site}" style="color: #0066CC;">thebluewavefans.com</a> ·
          <a href="${site}/thebluewaveapp/get.html" style="color: #0066CC;">The Blue Wave app</a>
        </p>
      </div>
      <div style="background: #f0f4f8; padding: 16px; text-align: center; font-size: 11px; color: #666;">
        © 2026 The Blue Wave Fans · Curaçao
      </div>
    </div>
  `.trim();
}

export function plainTextToHtml(text: string): string {
  return text
    .split(/\n{2,}/)
    .map((block) => {
      const lines = block
        .split('\n')
        .map((line) => escapeHtml(line.trim()))
        .filter(Boolean)
        .join('<br />');
      return lines ? `<p style="margin: 0 0 16px;">${lines}</p>` : '';
    })
    .join('');
}

export function buildBroadcastEmailPlainText(subject: string, message: string, siteUrl?: string): string {
  const site = (siteUrl || getSiteUrl()).replace(/\/$/, '');
  return [
    subject,
    '',
    message.trim(),
    '',
    `See you in the water,`,
    TEAM_NAME,
    'Curaçao',
    '',
    site,
    '',
    '© 2026 The Blue Wave Fans · Curaçao',
  ].join('\n');
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
