export interface SiteSettings {
  siteName: string
  trackingPrefix: string
  tagline: string
  description: string
  address: string
  postalCode: string
  city: string
  country: string
  email: string
  phone: string
  whatsapp: string
  openingHours: string
  mapEmbedUrl: string
  socialFacebook: string
  socialLinkedin: string
  socialTwitter: string
  primaryColor: string
  accentColor: string
  metaTitle: string
  metaDescription: string
  logoUrl: string | null
  logoOnDarkUrl: string | null
  faviconUrl: string | null
  // Website photos replaced in the admin, by slot (see utils/media.ts)
  images: Partial<Record<MediaSlot, string>>
  // Home page texts, figures and example shipments (null = built-in defaults, see utils/home.ts)
  homeContent: HomeContent | null
}

// Values used when the API is unreachable: neutral, without brand identity
export const SETTINGS_FALLBACK: SiteSettings = {
  siteName:        'Transport',
  trackingPrefix:  '',
  tagline:         '',
  description:     '',
  address:         '',
  postalCode:      '',
  city:            '',
  country:         '',
  email:           '',
  phone:           '',
  whatsapp:        '',
  openingHours:    '',
  mapEmbedUrl:     '',
  socialFacebook:  '',
  socialLinkedin:  '',
  socialTwitter:   '',
  primaryColor:    '#0b5bd3',
  accentColor:     '#f59e0b',
  metaTitle:       '',
  metaDescription: '',
  logoUrl:         null,
  logoOnDarkUrl:   null,
  faviconUrl:      null,
  images:          {},
  homeContent:     null,
}

// Shared between server rendering and the browser (loaded once by the site-settings plugin)
export function useSiteSettings() {
  return useState<SiteSettings>('site-settings', () => ({ ...SETTINGS_FALLBACK }))
}

// Image URLs returned by the API are relative to its base: serve them through the /api proxy
export function brandingSrc(url: string | null) {
  return url ? `/api${url}` : null
}
