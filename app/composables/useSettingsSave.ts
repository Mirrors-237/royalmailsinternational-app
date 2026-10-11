// Saves part of the site settings from the admin and reports the result
export function useSettingsSave(onSaved: (s: SiteSettings) => void) {
  const { notify } = useAdminNotices()
  const busy = ref(false)
  const error = ref('')

  async function save(body: Record<string, unknown>, done = 'Changes saved') {
    busy.value = true
    error.value = ''
    try {
      onSaved(await adminFetch<SiteSettings>('/api/settings', { method: 'PUT', body }))
      notify(done)
      return true
    } catch (err) {
      error.value = apiError(err)
      return false
    } finally {
      busy.value = false
    }
  }

  return { busy, error, save }
}
