// Home content in use: the admin's version, otherwise the defaults
export function useHomeContent() {
  const settings = useSiteSettings()
  return computed<HomeContent>(() => ({ ...HOME_DEFAULTS, ...(settings.value.homeContent ?? {}) }))
}
