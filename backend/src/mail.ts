import fs from 'fs';
import path from 'path';
import nodemailer from 'nodemailer';
import { Resend } from 'resend';
import {
  getAdminEmail,
  getResendApiKey,
  getSiteUrl,
  getSmtpHost,
  getSmtpPass,
  getSmtpPort,
  getSmtpUser,
  hasResendConfig,
  hasSmtpConfig,
} from './env';
import {
  buildWelcomeEmailHtml,
  buildWelcomeEmailPlainText,
  buildWelcomeEmailSubject,
} from './welcomeContent';
import {
  buildBroadcastEmailHtml,
  buildBroadcastEmailPlainText,
} from './broadcastContent';

// Prefer Gmail SMTP when configured; fall back to Resend if SMTP fails.
const smtpUser = getSmtpUser();
const smtpPass = getSmtpPass();
const hasSmtp = hasSmtpConfig();
const hasResend = hasResendConfig();
const resend = hasResend ? new Resend(getResendApiKey()) : null;

const smtpHost = getSmtpHost();
const smtpPort = getSmtpPort();
const isGmail = smtpHost === 'smtp.gmail.com';
const transporter = nodemailer.createTransport(isGmail
  ? { service: 'gmail', auth: { user: smtpUser, pass: smtpPass } }
  : {
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: { user: smtpUser, pass: smtpPass },
      tls: { rejectUnauthorized: false },
    });

export async function testSmtpConnection(): Promise<{ ok: boolean; error?: string }> {
  if (hasResend) {
    return { ok: true };
  }
  if (!hasSmtp) {
    return { ok: false, error: 'Mail not configured. Set RESEND_API_KEY or SMTP_USER/SMTP_PASS in .env' };
  }
  try {
    await transporter.verify();
    return { ok: true };
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    console.error('[Mail] SMTP verify failed:', err);
    return { ok: false, error: msg };
  }
}

function getFromAddress(viaResend: boolean): string {
  if (viaResend && process.env.RESEND_FROM) {
    return process.env.RESEND_FROM;
  }
  if (viaResend) {
    return '"The Blue Wave" <onboarding@resend.dev>';
  }
  return `"The Blue Wave" <${smtpUser}>`;
}

function getReplyToAddress(): string {
  return process.env.REPLY_TO || getAdminEmail() || smtpUser || '';
}

function resolveSiteOrigin(siteOrigin?: string): string {
  const raw = siteOrigin || getSiteUrl();
  return raw.replace(/\/$/, '');
}

const BANNER_CID = 'banner-image';

function getBannerAttachment(): { content: string; filename: string; contentId: string; contentType: string } | null {
  const bannerPath = path.join(__dirname, '..', 'assets', 'email-banner.png');
  try {
    if (fs.existsSync(bannerPath)) {
      const content = fs.readFileSync(bannerPath).toString('base64');
      return {
        content,
        filename: 'email-banner.png',
        contentId: BANNER_CID,
        contentType: 'image/png',
      };
    }
  } catch {
    console.warn('[Mail] Banner image not found at', bannerPath);
  }
  return null;
}

export async function sendWelcomeEmail(to: string, siteOrigin?: string): Promise<{ ok: boolean; error?: string }> {
  const site = resolveSiteOrigin(siteOrigin);
  const banner = getBannerAttachment();
  const logoUrl = `${site}/bluewavelogo.png`;
  const bannerUrl = `${site}/email-banner.png`;
  const imgSrc = bannerUrl;
  const subject = buildWelcomeEmailSubject();
  const text = buildWelcomeEmailPlainText(to, site);
  const html = buildWelcomeEmailHtml(to, site);
  const replyTo = getReplyToAddress();

  if (hasSmtp) {
    const smtpAttachments = !imgSrc && banner
      ? [{ filename: banner.filename, content: Buffer.from(banner.content, 'base64'), cid: BANNER_CID }]
      : [];
    try {
      const info = await transporter.sendMail({
        from: getFromAddress(false),
        to,
        replyTo: replyTo || undefined,
        subject,
        text,
        html,
        attachments: smtpAttachments,
      });
      const msgId = (info as { messageId?: string }).messageId || 'unknown';
      console.log(`[Mail] Welcome email sent to ${to} (SMTP) | messageId: ${msgId}`);
      return { ok: true };
    } catch (err) {
      const msg = err instanceof Error ? (err as Error & { code?: string }).message : String(err);
      console.warn('[Mail] SMTP welcome failed, trying Resend fallback:', msg);
      if (!hasResend || !resend) {
        const hint = /invalid.*credentials|username.*password|authentication/i.test(msg)
          ? ' Create a new Gmail App Password: myaccount.google.com/apppasswords'
          : '';
        return { ok: false, error: msg + hint };
      }
    }
  }

  if (hasResend && resend) {
    const fromAddr = getFromAddress(true);
    const attachments = !imgSrc && banner ? [{ content: banner.content, filename: banner.filename, contentId: BANNER_CID }] : undefined;
    try {
      const { data, error } = await resend.emails.send({
        from: fromAddr,
        to,
        replyTo: replyTo || undefined,
        subject,
        text,
        html,
        attachments,
      });
      if (error) {
        console.error('[Mail] Resend error:', JSON.stringify(error), '- Verify domain in Resend dashboard');
        return { ok: false, error: JSON.stringify(error) };
      }
      console.log(`[Mail] Welcome email sent to ${to} (Resend)`, data?.id);
      return { ok: true };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error('[Mail] Error sending welcome email:', err);
      return { ok: false, error: msg };
    }
  }

  console.warn('[Mail] Mail not configured (no RESEND_API_KEY or SMTP), skipping welcome email');
  return { ok: false, error: 'Mail not configured' };
}

export async function sendAdminNotificationEmail(newSubscriberEmail: string, _siteOrigin?: string): Promise<boolean> {
  const adminEmail = getAdminEmail() || smtpUser;
  if (!adminEmail) {
    console.warn('[Mail] ADMIN_EMAIL not configured, skipping admin notification');
    return false;
  }
  const banner = getBannerAttachment();
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px;">
      ${banner ? `<div style="text-align: center; margin-bottom: 1rem;"><img src="cid:${BANNER_CID}" alt="The Blue Wave" style="max-width: 100%; height: auto;" /></div>` : ''}
      <h2 style="color: #0066CC;">New subscription 🌊</h2>
      <p>A new person has subscribed to The Blue Wave:</p>
      <p style="font-size: 1.2em; font-weight: bold;">${newSubscriberEmail}</p>
      <p style="color: #666; font-size: 0.9em;">© 2026 The Blue Wave Fans · Curaçao</p>
    </div>
  `;

  if (hasSmtp) {
    const smtpAttachments = banner
      ? [{ filename: banner.filename, content: Buffer.from(banner.content, 'base64'), cid: BANNER_CID }]
      : [];
    try {
      await transporter.sendMail({
        from: getFromAddress(false),
        to: adminEmail,
        subject: `[The Blue Wave] New subscriber: ${newSubscriberEmail}`,
        html,
        attachments: smtpAttachments,
      });
      console.log(`[Mail] Admin notification sent to ${adminEmail} (SMTP)`);
      return true;
    } catch (err) {
      console.warn('[Mail] SMTP admin notification failed, trying Resend:', err);
      if (!hasResend || !resend) return false;
    }
  }

  if (hasResend && resend) {
    const fromAddr = getFromAddress(true);
    const attachments = banner ? [{ content: banner.content, filename: banner.filename, contentId: BANNER_CID }] : undefined;
    try {
      const { data, error } = await resend.emails.send({
        from: fromAddr,
        to: adminEmail,
        subject: `[The Blue Wave] New subscriber: ${newSubscriberEmail}`,
        html,
        attachments,
      });
      if (error) {
        console.error('[Mail] Resend error (admin):', JSON.stringify(error));
        return false;
      }
      console.log(`[Mail] Admin notification sent to ${adminEmail} (Resend)`, data?.id);
      return true;
    } catch (err) {
      console.error('[Mail] Error sending admin notification:', err);
      return false;
    }
  }

  console.warn('[Mail] Mail not configured, skipping admin notification');
  return false;
}

export async function sendBroadcastEmail(
  to: string,
  subject: string,
  messageHtml: string,
  messageText: string,
  siteOrigin?: string
): Promise<{ ok: boolean; error?: string }> {
  const site = resolveSiteOrigin(siteOrigin);
  const html = buildBroadcastEmailHtml(subject, messageHtml, site);
  const text = buildBroadcastEmailPlainText(subject, messageText, site);
  const replyTo = getReplyToAddress();

  if (hasSmtp) {
    try {
      await transporter.sendMail({
        from: getFromAddress(false),
        to,
        replyTo: replyTo || undefined,
        subject,
        text,
        html,
      });
      return { ok: true };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      if (!hasResend || !resend) return { ok: false, error: msg };
    }
  }

  if (hasResend && resend) {
    try {
      const { error } = await resend.emails.send({
        from: getFromAddress(true),
        to,
        replyTo: replyTo || undefined,
        subject,
        text,
        html,
      });
      if (error) return { ok: false, error: JSON.stringify(error) };
      return { ok: true };
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      return { ok: false, error: msg };
    }
  }

  return { ok: false, error: 'Mail not configured' };
}
