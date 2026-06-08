import { Capacitor } from '@capacitor/core';

function normalizeOrigin(raw: string | undefined): string {
  if (!raw || typeof raw !== 'string') return '';
  return raw.trim().replace(/\/$/, '');
}

/**
 * Base URL for /api fetch calls (no trailing slash).
 * - Browser + tunnel/production: '' (same origin)
 * - Vite dev: '' (proxy to backend)
 * - Capacitor: set VITE_APP_ORIGIN or VITE_API_URL to your deployed https:// host
 */
export function getApiBase(): string {
  const fromEnv =
    normalizeOrigin(import.meta.env.VITE_API_URL) ||
    normalizeOrigin(import.meta.env.VITE_APP_ORIGIN);
  if (fromEnv) return fromEnv;

  if (Capacitor.isNativePlatform()) {
    return '';
  }

  if (typeof window !== 'undefined') {
    const h = window.location.hostname;
    if (h !== 'localhost' && h !== '127.0.0.1') return '';
  }
  return '';
}

/** Prevent signup form hanging when Render wakes from sleep (free tier). */
export async function fetchWithTimeout(
  url: string,
  init?: RequestInit,
  timeoutMs = 12000
): Promise<Response> {
  const controller = new AbortController();
  const timer = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    window.clearTimeout(timer);
  }
}
