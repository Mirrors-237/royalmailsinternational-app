export interface AdminUser { id: string; email: string; role: string }

// Signed-in administrator (null = signed out); checked by the "admin" route middleware
export function useAdminUser() {
  return useState<AdminUser | null>('admin-user', () => null)
}

// Calls the API through the /api proxy (the session cookie goes with it).
// An expired session sends the user back to the sign-in page.
export async function adminFetch<T>(url: string, options: Parameters<typeof $fetch>[1] = {}): Promise<T> {
  try {
    return await $fetch<T>(url, options as any)
  } catch (err: any) {
    if (err?.statusCode === 401 || err?.response?.status === 401) {
      useAdminUser().value = null
      await navigateTo({ path: '/admin/login', query: { redirect: useRoute().fullPath } })
    }
    throw err
  }
}

// Readable message from an API error (NestJS validation returns a list of messages)
export function apiError(err: any, fallback = 'Something went wrong. Please try again.'): string {
  const message = err?.data?.message ?? err?.response?._data?.message
  if (Array.isArray(message)) return message.join(' · ')
  if (typeof message === 'string' && message) return message
  if (err?.statusCode === 413) return 'The file is too large.'
  if (err?.statusCode === 429) return 'Too many attempts. Please wait a moment and try again.'
  return fallback
}

// Short confirmation messages shown at the bottom of the admin screens
export interface AdminNotice { id: number; text: string; tone: 'success' | 'error' }

export function useAdminNotices() {
  const notices = useState<AdminNotice[]>('admin-notices', () => [])
  function notify(text: string, tone: AdminNotice['tone'] = 'success') {
    const id = Date.now() + Math.random()
    notices.value.push({ id, text, tone })
    setTimeout(() => { notices.value = notices.value.filter((n) => n.id !== id) }, tone === 'error' ? 7000 : 3500)
  }
  return { notices, notify }
}
