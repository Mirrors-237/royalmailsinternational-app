// List of the public pages for search engines (declared in robots.txt)
export default defineEventHandler((event) => {
  const origin = siteOrigin(event).origin
  const urls = SITEMAP_PAGES.map((path) => `  <url><loc>${origin}${path === '/' ? '/' : path}</loc></url>`).join('\n')
  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
})
