interface LoginResponse {
  accessToken: string
  user: { id: string; email: string; role: string }
}

export default defineEventHandler(async (event) => {
  assertSameOrigin(event)
  const body = await readBody(event)

  try {
    const res = await $fetch<LoginResponse>(apiUrl(event, '/auth/login'), { method: 'POST', body })
    setSession(event, res.accessToken)
    return { user: res.user }
  } catch (err: any) {
    throw createError({
      statusCode: err?.response?.status ?? 502,
      statusMessage: err?.response?._data?.message ?? 'Sign-in failed',
      data: err?.response?._data,
    })
  }
})
