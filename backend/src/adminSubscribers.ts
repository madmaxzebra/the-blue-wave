import type { Request, Response } from 'express';
import { getRealSubscriberStats } from './db';
import { requireSubscriberAdmin, readSubscriberAdminKey } from './adminAuth';

function wantsHtml(req: Request): boolean {
  const view = String(req.query.view ?? '').toLowerCase();
  if (view === 'page' || view === 'html') return true;
  const accept = String(req.headers.accept ?? '');
  return accept.includes('text/html');
}

function formatWhen(iso: string): string {
  const ms = Date.parse(iso);
  if (!Number.isFinite(ms)) return iso;
  return new Date(ms).toLocaleString('en-US', { timeZone: 'America/Curacao' });
}

function renderHtml(payload: {
  listCount: number;
  subscribers: Array<{ email: string; createdAt: string }>;
  updatedAt: string;
  adminKey: string;
}): string {
  const rows = payload.subscribers
    .map(
      (s) =>
        `<tr><td>${escapeHtml(s.email)}</td><td>${escapeHtml(formatWhen(s.createdAt))}</td></tr>`
    )
    .join('');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Stay Updated — subscriber admin</title>
  <style>
    body { font-family: Arial, sans-serif; background: #002b7f; color: #fff; margin: 0; padding: 24px; }
    .card { max-width: 720px; margin: 0 auto; background: rgba(0,0,0,.22); border: 1px solid #f9e814; border-radius: 12px; padding: 20px; }
    h1 { margin: 0 0 6px; color: #f9e814; font-size: 1.35rem; }
    .meta { color: #c8d4f0; font-size: .92rem; margin-bottom: 18px; }
    table { width: 100%; border-collapse: collapse; font-size: .92rem; }
    th, td { text-align: left; padding: 8px 6px; border-bottom: 1px solid rgba(255,255,255,.12); }
    th { color: #f9e814; font-size: .8rem; text-transform: uppercase; letter-spacing: .04em; }
    .note { margin-top: 16px; color: #b8c7ea; font-size: .85rem; line-height: 1.45; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Stay Updated — subscriber list</h1>
    <p class="meta">Updated ${escapeHtml(payload.updatedAt)} (Curaçao time) · ${payload.listCount} subscribers</p>
    <table>
      <thead><tr><th>Email</th><th>Signed up</th></tr></thead>
      <tbody>${rows || '<tr><td colspan="2">No subscribers yet.</td></tr>'}</tbody>
    </table>
    <p class="note">Bookmark this URL and keep the key private.</p>
    <p style="margin-top:14px;font-size:.88rem;"><a href="/admin/email-broadcast?key=${encodeURIComponent(payload.adminKey)}" style="color:#f9e814;">Email all subscribers →</a></p>
  </div>
</body>
</html>`;
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export async function handleAdminSubscribers(req: Request, res: Response): Promise<void> {
  if (!requireSubscriberAdmin(req, res)) return;

  const stats = getRealSubscriberStats();
  const updatedAt = new Date().toLocaleString('en-US', { timeZone: 'America/Curacao' });
  const adminKey = readSubscriberAdminKey(req);

  const payload = {
    ok: true,
    count: stats.listCount,
    subscribers: stats.subscribers,
    updatedAt,
    adminKey,
  };

  if (wantsHtml(req)) {
    res.type('html').send(
      renderHtml({
        listCount: stats.listCount,
        subscribers: stats.subscribers,
        updatedAt,
        adminKey,
      })
    );
    return;
  }

  res.json(payload);
}
