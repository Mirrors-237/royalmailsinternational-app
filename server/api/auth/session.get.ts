// Signed-in user, or null; the token is never exposed
export default defineEventHandler(async (event) => {
  const headers = authHeader(event)
  if (!headers.authorization) return { user: null }

  try {
    const user = await $fetch(apiUrl(event, '/auth/me'), { headers })
    return { user }
  } catch (err: any) {
    // Expired or invalid token: forget it. An unreachable API does not sign the user out.
    if (err?.response?.status === 401) {
      clearAdminSession(event)
      return { user: null }
    }
    throw createError({ statusCode: 502, statusMessage: 'API unreachable' })
  }
})
