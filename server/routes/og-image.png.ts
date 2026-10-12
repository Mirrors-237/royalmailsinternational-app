// Image shown when a page of the website is shared (see server/utils/share-image.ts)
export default defineEventHandler(async (event) => {
  const settings = await fetchSiteSettings(event)
  if (!settings) throw createError({ statusCode: 503, statusMessage: 'Settings unavailable' })

  const png = await renderShareImage(event, settings)
  setHeaders(event, {
    'content-type': 'image/png',
    // The URL carries a version (?v=…) that changes with the logo, name or colours
    'cache-control': 'public, max-age=86400',
  })
  return png
})
