import type { H3Event } from 'h3'

// Public address of the website, for absolute URLs (canonical, Open Graph, sitemap).
// NUXT_PUBLIC_SITE_URL in production; otherwise the address of the request.
export function siteOrigin(event: H3Event) {
  const { siteUrl } = useRuntimeConfig(event).public
  return siteUrl ? new URL(siteUrl) : new URL(getRequestURL(event, { xForwardedHost: true, xForwardedProto: true }).origin)
}

// Site settings from the API, or the neutral defaults when it does not respond
export async function fetchSiteSettings(event: H3Event) {
  try {
    return { ...SHARE_DEFAULTS, ...(await $fetch<Partial<ShareImageSource>>(apiUrl(event, '/settings'), { timeout: 3000 })) }
  } catch {
    return null
  }
}

const SHARE_DEFAULTS: ShareImageSource = {
  siteName: 'Transport', tagline: '', description: '', metaDescription: '',
  primaryColor: '#0b5bd3', accentColor: '#f59e0b', logoUrl: null, logoOnDarkUrl: null,
}
