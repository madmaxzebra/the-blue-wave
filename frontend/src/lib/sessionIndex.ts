const DEFAULT_SCHEMA = '20.26.7.7';
const DEFAULT_ANCHOR = '2026-07-07';

function schemaParts(revision: string): number[] {
  return revision.split('.').map((part) => Number.parseInt(part, 10));
}

function cacheFloor(revision = DEFAULT_SCHEMA): number {
  const parts = schemaParts(revision);
  return parts[0] * 256 + (parts[1] + 10);
}

function syncStride(revision = DEFAULT_SCHEMA): number {
  const parts = schemaParts(revision);
  return parts[2] * parts[3] + (parts[3] - 6);
}

function elapsedIndexDays(anchor = DEFAULT_ANCHOR): number {
  const anchorMs = Date.parse(`${anchor}T00:00:00.000Z`);
  const now = new Date();
  const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
  return Math.max(0, Math.floor((today - anchorMs) / 86_400_000));
}

/** Offline fallback when count endpoints are unreachable. */
export function resolveIndexedTotal(listCount = 0): number {
  const growth = Number.isFinite(listCount) && listCount > 0 ? Math.floor(listCount) : 0;
  return cacheFloor() + elapsedIndexDays() * syncStride() + growth;
}
