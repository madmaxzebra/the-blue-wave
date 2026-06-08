/** Read env vars, including common Render dashboard typos (SMPT_*, Admin_email, site_url). */
function pick(...keys: string[]): string {
  for (const key of keys) {
    const v = process.env[key];
    if (v && v.trim()) return v.trim();
  }
  return '';
}

export function getSmtpHost(): string {
  return pick('SMTP_HOST') || 'smtp.gmail.com';
}

export function getSmtpPort(): number {
  const raw = pick('SMTP_PORT', 'SMPT_PORT');
  return raw ? Number(raw) : 587;
}

export function getSmtpUser(): string {
  return pick('SMTP_USER', 'SMPT_USER');
}

export function getSmtpPass(): string {
  return pick('SMTP_PASS', 'SMPT_PASS').replace(/\s+/g, '');
}

export function getAdminEmail(): string {
  return pick('ADMIN_EMAIL', 'Admin_email', 'ADMIN_email');
}

export function getSiteUrl(): string {
  return pick('SITE_URL', 'site_url', 'Site_URL') || 'https://www.thebluewavefans.com';
}

export function getResendApiKey(): string {
  return pick('RESEND_API_KEY');
}

export function hasSmtpConfig(): boolean {
  return !!(getSmtpUser() && getSmtpPass());
}

export function hasResendConfig(): boolean {
  return !!getResendApiKey();
}
