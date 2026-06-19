import { timingSafeEqual } from 'crypto';
import type { Request, Response } from 'express';

export function subscriberAdminKeyConfigured(): boolean {
  return Boolean((process.env.SUBSCRIBER_ADMIN_KEY || '').trim());
}

export function subscriberAdminKeyOk(provided: string): boolean {
  const expected = (process.env.SUBSCRIBER_ADMIN_KEY || '').trim();
  if (!expected || !provided) return false;
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export function readSubscriberAdminKey(req: Request): string {
  const fromQuery = req.query.key;
  if (typeof fromQuery === 'string' && fromQuery.trim()) return fromQuery.trim();
  const fromHeader = req.headers['x-admin-key'];
  if (typeof fromHeader === 'string' && fromHeader.trim()) return fromHeader.trim();
  return '';
}

export function requireSubscriberAdmin(req: Request, res: Response): boolean {
  if (!subscriberAdminKeyConfigured()) {
    res.status(503).json({
      ok: false,
      error: 'Admin not configured. Set SUBSCRIBER_ADMIN_KEY on Render.',
    });
    return false;
  }
  if (!subscriberAdminKeyOk(readSubscriberAdminKey(req))) {
    res.status(403).json({ ok: false, error: 'Forbidden' });
    return false;
  }
  return true;
}
