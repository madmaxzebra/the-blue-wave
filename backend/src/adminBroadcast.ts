import type { Request, Response } from 'express';
import { broadcastToSubscribers } from './broadcastToSubscribers';
import { getRealSubscriberStats } from './db';
import { requireSubscriberAdmin, readSubscriberAdminKey } from './adminAuth';

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function renderPage(key: string, recipientCount: number, result?: string, isError?: boolean): string {
  const keyQ = encodeURIComponent(key);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Email all subscribers — The Blue Wave</title>
  <style>
    body { font-family: Arial, sans-serif; background: #002b7f; color: #fff; margin: 0; padding: 24px; }
    .card { max-width: 640px; margin: 0 auto; background: rgba(0,0,0,.22); border: 1px solid #f9e814; border-radius: 12px; padding: 20px; }
    h1 { margin: 0 0 6px; color: #f9e814; font-size: 1.35rem; }
    .meta { color: #c8d4f0; font-size: .92rem; margin-bottom: 18px; }
    label { display: block; margin: 14px 0 6px; font-size: .9rem; color: #f9e814; }
    input, textarea { width: 100%; box-sizing: border-box; border: 1px solid #4a6bb8; border-radius: 8px; padding: 10px 12px; font: inherit; background: #001f5c; color: #fff; }
    textarea { min-height: 180px; resize: vertical; }
    .row { display: flex; gap: 10px; flex-wrap: wrap; margin-top: 16px; }
    button, .btn { border: 0; border-radius: 8px; padding: 11px 16px; font-weight: 700; cursor: pointer; text-decoration: none; display: inline-block; }
    .btn-primary { background: #f9e814; color: #002b7f; }
    .btn-secondary { background: rgba(255,255,255,.12); color: #fff; }
    .result { margin-top: 16px; padding: 12px; border-radius: 8px; font-size: .92rem; line-height: 1.45; }
    .result.ok { background: rgba(80, 200, 120, .18); border: 1px solid #6fdc8c; }
    .result.err { background: rgba(255, 120, 120, .15); border: 1px solid #ff8a8a; }
    .note { margin-top: 16px; color: #b8c7ea; font-size: .85rem; line-height: 1.45; }
    .links { margin-top: 14px; font-size: .88rem; }
    .links a { color: #f9e814; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Email all Stay Updated subscribers</h1>
    <p class="meta"><strong>${recipientCount}</strong> real subscribers will receive this (your test emails excluded).</p>
    ${result ? `<div class="result ${isError ? 'err' : 'ok'}">${result}</div>` : ''}
    <form method="post" action="/api/admin/broadcast?key=${keyQ}">
      <label for="subject">Subject</label>
      <input id="subject" name="subject" required maxlength="200" placeholder="Tonight: Curaçao vs Ecuador — kickoff 8 PM" />
      <label for="message">Message</label>
      <textarea id="message" name="message" required maxlength="8000" placeholder="Write your update here. Line breaks are kept."></textarea>
      <label for="confirm">Type SEND to confirm real delivery</label>
      <input id="confirm" name="confirm" placeholder="SEND" autocomplete="off" />
      <div class="row">
        <button type="submit" class="btn-primary">Send to all subscribers</button>
        <button type="submit" formaction="/api/admin/broadcast?key=${keyQ}&dryRun=1" class="btn-secondary">Preview count only</button>
      </div>
    </form>
    <p class="note">Each person gets their own email (not a visible group list). Gmail allows ~500 emails/day — if you have more subscribers, split across days. Sending cannot be undone.</p>
    <p class="links"><a href="/admin/subscribers?key=${keyQ}&view=page">← Subscriber list</a></p>
  </div>
</body>
</html>`;
}

export async function handleAdminBroadcastGet(req: Request, res: Response): Promise<void> {
  if (!requireSubscriberAdmin(req, res)) return;
  const stats = getRealSubscriberStats();
  const key = readSubscriberAdminKey(req);
  res.type('html').send(renderPage(key, stats.realCount));
}

export async function handleAdminBroadcastPost(req: Request, res: Response): Promise<void> {
  if (!requireSubscriberAdmin(req, res)) return;

  const key = readSubscriberAdminKey(req);
  const subject = String(req.body?.subject ?? '').trim();
  const message = String(req.body?.message ?? '').trim();
  const dryRun = String(req.query.dryRun ?? req.body?.dryRun ?? '') === '1';
  const confirm = String(req.body?.confirm ?? '').trim().toUpperCase();

  if (!dryRun && confirm !== 'SEND') {
    const stats = getRealSubscriberStats();
    res
      .type('html')
      .send(
        renderPage(
          key,
          stats.realCount,
          'Type <strong>SEND</strong> in the confirm box to deliver this email.',
          true
        )
      );
    return;
  }

  const result = await broadcastToSubscribers({ subject, message, dryRun });

  if (req.accepts('html') && !String(req.query.format ?? '').includes('json')) {
    const stats = getRealSubscriberStats();
    let text: string;
    if (dryRun) {
      text = `Preview OK — would send to <strong>${result.recipientCount}</strong> subscribers.`;
    } else if (result.sent > 0 && result.failed === 0) {
      text = `Sent to <strong>${result.sent}</strong> of ${result.recipientCount} subscribers.`;
    } else {
      text = `Sent <strong>${result.sent}</strong>, failed <strong>${result.failed}</strong>. ${
        result.failures[0]?.error ? escapeHtml(result.failures[0].error) : ''
      }`;
    }
    res.type('html').send(renderPage(key, stats.realCount, text, !result.ok && !dryRun));
    return;
  }

  res.json(result);
}
