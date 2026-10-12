// The administration is never crawled; uploaded images stay available to image search
export default defineEventHandler((event) => {
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return [
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
