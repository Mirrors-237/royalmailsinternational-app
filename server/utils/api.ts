import type { H3Event } from 'h3'

export const SESSION_COOKIE = 'admin_session'

// NestJS API URL, known to the Nuxt server only
export function apiUrl(event: H3Event, path: string) {
  const { apiBase } = useRuntimeConfig(event)
  return `${apiBase.replace(/\/$/, '')}${path}`
}

// The token stays in an httpOnly cookie: browser JavaScript can never read it
export function setSession(event: H3Event, token: string) {
  setCookie(event, SESSION_COOKIE, token, {
    httpOnly: true,
    secure:   !import.meta.dev,
    sameSite: 'strict',
    path:     '/',
    maxAge:   60 * 60 * 24 * 7,
  })
}

export function clearAdminSession(event: H3Event) {
  deleteCookie(event, SESSION_COOKIE, { path: '/' })
}

export function authHeader(event: H3Event): Record<string, string> {
  const token = getCookie(event, SESSION_COOKIE)
  return token ? { authorization: `Bearer ${token}` } : {}
}

// Rejects requests that change data when they come from another site
export function assertSameOrigin(event: H3Event) {
  if (['GET', 'HEAD', 'OPTIONS'].includes(event.method)) return
  const origin = getRequestHeader(event, 'origin')
  if (!origin) return
  if (new URL(origin).host !== getRequestHost(event, { xForwardedHost: true })) {
    throw createError({ statusCode: 403, statusMessage: 'Origin not allowed' })
  }
}
