import type { SiteSettings } from '~/composables/useSiteSettings'

// Loads the site settings during server rendering: name, logo and colours are in the very
// first bytes of HTML, with no visible change while the page loads.
export default defineNuxtPlugin(async () => {
  if (!import.meta.server) return

  const settings = useSiteSettings()
  const { apiBase } = useRuntimeConfig()

  try {
    const data = await $fetch<Partial<SiteSettings>>(`${apiBase}/settings`, { timeout: 3000 })
    settings.value = { ...SETTINGS_FALLBACK, ...data }
  } catch (err) {
    console.error('[site-settings] API unreachable, using default values', err)
  }
})
