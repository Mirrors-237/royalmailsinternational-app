import type { MaybeRefOrGetter } from 'vue'

// Public address of the website without a trailing slash (NUXT_PUBLIC_SITE_URL, or the current address)
export function useSiteUrl() {
  const { siteUrl } = useRuntimeConfig().public
  return (siteUrl || useRequestURL({ xForwardedHost: true, xForwardedProto: true }).origin).replace(/\/$/, '')
}

// Title and description of a page, for search results and sharing.
// Without a title, the SEO title set in the admin is used (home page).
export function usePageSeo(page: { title?: MaybeRefOrGetter<string>; description?: MaybeRefOrGetter<string>; noindex?: boolean }) {
  const settings = useSiteSettings()
  const fullTitle = () => {
    const title = toValue(page.title)
    return title ? `${title} – ${settings.value.siteName}` : settings.value.metaTitle || settings.value.siteName
  }
  const description = () => toValue(page.description) || settings.value.metaDescription || settings.value.description

  useSeoMeta({
    ...(page.title ? { title: () => toValue(page.title) } : {}),
    description,
    ogTitle: fullTitle,
    ogDescription: description,
    twitterTitle: fullTitle,
    twitterDescription: description,
    ...(page.noindex ? { robots: 'noindex, nofollow' } : {}),
  })
}

// schema.org data for search engines; "<" is escaped so that admin content cannot close the script
export function useStructuredData(id: string, data: () => Record<string, unknown>) {
  useHead({
    script: [{
      key: `ld-${id}`,
      type: 'application/ld+json',
      innerHTML: () => JSON.stringify(data()).replace(/</g, '\\u003c'),
    }],
  })
}

// Removes empty values (schema.org validators flag empty strings and arrays)
export function compact<T extends Record<string, unknown>>(obj: T): Partial<T> {
  return Object.fromEntries(Object.entries(obj).filter(([, v]) => v !== '' && v != null && !(Array.isArray(v) && !v.length))) as Partial<T>
}
