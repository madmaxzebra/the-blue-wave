"use strict";
/**
 * Official public subscriber total — stored on CountAPI, updated only by this server.
 * Browsers never read or write CountAPI directly (prevents drift and fake jumps).
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPublicSubscriberCount = getPublicSubscriberCount;
exports.incrementPublicSubscriberCount = incrementPublicSubscriberCount;
const COUNTER_KEY = 'thebluewavefans-subscribers';
const COUNTER_API = 'https://countapi.mileshilliard.com/api/v1';
const FALLBACK_COUNT = Number.parseInt(process.env.SUBSCRIBER_COUNT_BASE ?? '5156', 10);
function parseValue(data) {
    if (!data || typeof data !== 'object')
        return null;
    const value = data.value;
    if (typeof value === 'number' && Number.isFinite(value) && value >= 0) {
        return Math.floor(value);
    }
    return null;
}
async function counterGet() {
    try {
        const res = await fetch(`${COUNTER_API}/get/${COUNTER_KEY}`, {
            signal: AbortSignal.timeout(8000),
        });
        if (!res.ok)
            return null;
        return parseValue(await res.json());
    }
    catch {
        return null;
    }
}
async function counterHit() {
    try {
        const res = await fetch(`${COUNTER_API}/hit/${COUNTER_KEY}`, {
            signal: AbortSignal.timeout(8000),
        });
        if (!res.ok)
            return null;
        return parseValue(await res.json());
    }
    catch {
        return null;
    }
}
/** Read the live public total (CountAPI → env fallback). */
async function getPublicSubscriberCount() {
    const remote = await counterGet();
    if (remote !== null)
        return remote;
    return Number.isFinite(FALLBACK_COUNT) ? FALLBACK_COUNT : 5156;
}
/**
 * +1 on CountAPI after a real new subscriber (not QA test emails).
 * Returns the new official total.
 */
async function incrementPublicSubscriberCount() {
    const afterHit = await counterHit();
    if (afterHit !== null)
        return afterHit;
    const current = await getPublicSubscriberCount();
    return current + 1;
}
