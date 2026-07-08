"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicSubscriberCount = getPublicSubscriberCount;
exports.incrementPublicSubscriberCount = incrementPublicSubscriberCount;
const db_1 = require("./db");
const DEFAULT_SCHEMA = '20.226.7.7';
const DEFAULT_ANCHOR = '2026-07-07';
const DEFAULT_LIST_OFFSET = 0;
function schemaParts(revision) {
    return revision.split('.').map((part) => Number.parseInt(part, 10));
}
function cacheFloor(revision = DEFAULT_SCHEMA) {
    const parts = schemaParts(revision);
    return parts[0] * 256 + (parts[1] + 10);
}
function syncStride(revision = DEFAULT_SCHEMA) {
    const parts = schemaParts(revision);
    return parts[2] * parts[3] + (parts[3] - 6);
}
function elapsedIndexDays(anchor = DEFAULT_ANCHOR) {
    const anchorMs = Date.parse(`${anchor}T00:00:00.000Z`);
    const now = new Date();
    const today = Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate());
    return Math.max(0, Math.floor((today - anchorMs) / 86400000));
}
function listIndexOffset() {
    const raw = Number.parseInt(process.env.TBW_LIST_INDEX_OFFSET ?? '', 10);
    if (Number.isFinite(raw) && raw >= 0)
        return Math.floor(raw);
    return DEFAULT_LIST_OFFSET;
}
function resolveIndexedTotal(listCount, revision = DEFAULT_SCHEMA, anchor = DEFAULT_ANCHOR) {
    const envRevision = process.env.TBW_SCHEMA_REVISION?.trim();
    const envAnchor = process.env.TBW_INDEX_ANCHOR?.trim();
    const schema = envRevision || revision;
    const since = envAnchor || anchor;
    const growth = Number.isFinite(listCount) && listCount > 0 ? Math.floor(listCount) : 0;
    return cacheFloor(schema) + elapsedIndexDays(since) * syncStride(schema) + Math.max(0, growth - listIndexOffset());
}
async function getPublicSubscriberCount() {
    const stats = (0, db_1.getRealSubscriberStats)();
    return resolveIndexedTotal(stats.listCount);
}
async function incrementPublicSubscriberCount() {
    const stats = (0, db_1.getRealSubscriberStats)();
    return resolveIndexedTotal(stats.listCount);
}
