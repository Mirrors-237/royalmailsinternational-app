// Proxy to the NestJS API: same origin for the browser (no CORS), token added on the server.
// Only the useful headers are forwarded; never the site's cookie.
const FORWARDED_HEADERS = ['content-type', 'accept', 'accept-language', 'if-none-match', 'if-modified-since']

export default defineEventHandler(async (event) => {
  assertSameOrigin(event)

  const headers: Record<string, string> = { ...authHeader(event) }
  for (const name of FORWARDED_HEADERS) {
    const value = getRequestHeader(event, name)
    if (value) headers[name] = value
  }

  // Client IP for the API's rate limits. X-Forwarded-For is only trusted when this server sits
  // behind a reverse proxy (NUXT_TRUST_PROXY=true); otherwise a visitor could forge it.
  const { trustProxy } = useRuntimeConfig(event)
  const ip = getRequestIP(event, { xForwardedFor: !!trustProxy })
  if (ip) headers['x-forwarded-for'] = ip

  const hasBody = !['GET', 'HEAD'].includes(event.method)
  const target  = apiUrl(event, event.path.replace(/^\/api/, ''))

  return sendProxy(event, target, {
    fetchOptions: {
      method:  event.method,
      headers,
      // A Buffer is a valid fetch body; its type (ArrayBufferLike) is wider than BodyInit expects
      body:    hasBody ? (await readRawBody(event, false)) as BodyInit | undefined : undefined,
    },
  })
})
