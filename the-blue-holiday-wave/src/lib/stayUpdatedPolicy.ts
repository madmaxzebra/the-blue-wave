const APPROVED_HOSTS = ['thebluewavefans.com', 'www.thebluewavefans.com'] as const

/** Subscriber signup only on approved live domains unless explicitly enabled. */
export function isStayUpdatedAllowed(): boolean {
  const flag = import.meta.env.VITE_STAY_UPDATED_ENABLED
  if (flag === 'true') return true
  if (flag === 'false') return false
  if (typeof window === 'undefined') return false
  const host = window.location.hostname.toLowerCase()
  return APPROVED_HOSTS.some((allowed) => host === allowed || host.endsWith(`.${allowed}`))
}