// Coordinates of a place, for the tracking events entered in the admin (map on the tracking page).
// Admin only; goes through OpenStreetMap Nominatim with an identified User-Agent and a cache,
// as its usage policy requires (max. 1 request per second, no bulk use).
const cache = new Map<string, { lat: number; lng: number; label: string } | null>()
let lastCall = 0

export default defineEventHandler(async (event) => {
  // Only signed-in administrators
  const headers = authHeader(event)
  if (!headers.authorization) throw createError({ statusCode: 401, statusMessage: 'Sign in required' })
  await $fetch(apiUrl(event, '/auth/me'), { headers }).catch(() => {
    throw createError({ statusCode: 401, statusMessage: 'Sign in required' })
  })

  const q = String(getQuery(event).q ?? '').trim().slice(0, 200)
  if (q.length < 2) throw createError({ statusCode: 400, statusMessage: 'Enter a place to look up' })

  const key = q.toLowerCase()
  if (!cache.has(key)) {
    const wait = lastCall + 1100 - Date.now()
    if (wait > 0) await new Promise((r) => setTimeout(r, wait))
    lastCall = Date.now()

    const results = await $fetch<{ lat: string; lon: string; display_name: string }[]>('https://nominatim.openstreetmap.org/search', {
      query: { q, format: 'jsonv2', limit: 1 },
      headers: { 'User-Agent': 'courier-tracking-admin/1.0 (geocoding of tracking events)', 'Accept-Language': 'en' },
      timeout: 8000,
    }).catch(() => {
      throw createError({ statusCode: 502, statusMessage: 'The map service is not responding. Enter the coordinates by hand.' })
    })

    const r = results[0]
    cache.set(key, r ? { lat: Number(Number(r.lat).toFixed(6)), lng: Number(Number(r.lon).toFixed(6)), label: r.display_name } : null)
  }

  const found = cache.get(key)
  if (!found) throw createError({ statusCode: 404, statusMessage: 'Place not found. Check the spelling or enter the coordinates by hand.' })
  return found
})
