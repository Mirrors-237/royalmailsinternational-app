// Password change: the API signs out every other session and returns a new token,
// which replaces the one in the cookie so this session stays open
export default defineEventHandler(async (event) => {
  assertSameOrigin(event)
  const headers = authHeader(event)
  if (!headers.authorization) throw createError({ statusCode: 401, statusMessage: 'Sign in required' })
  const body = await readBody(event)

  try {
    const res = await $fetch<{ accessToken: string }>(apiUrl(event, '/auth/password'), { method: 'PATCH', headers, body })
    setSession(event, res.accessToken)
    return { ok: true }
  } catch (err: any) {
    const message = err?.response?._data?.message
    throw createError({
      statusCode: err?.response?.status ?? 502,
      statusMessage: (Array.isArray(message) ? message.join(' · ') : message) || 'Password change failed',
      data: err?.response?._data,
    })
  }
})
