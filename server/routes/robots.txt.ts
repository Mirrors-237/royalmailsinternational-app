// The administration is never crawled; uploaded images stay available to image search.
// AI and SEO scrapers are refused everywhere (and get a 403 if they ignore it: middleware/block-bots.ts).
export default defineEventHandler((event) => {
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return [
    ...BLOCKED_BOTS.map((bot) => `User-agent: ${bot}`),
    'Disallow: /',
    '',
    'User-agent: *',
    'Disallow: /admin',
    'Disallow: /api/',
    'Allow: /api/media/',
    'Allow: /api/branding/',
    '',
    `Sitemap: ${siteOrigin(event).origin}/sitemap.xml`,
    '',
  ].join('\n')
})
