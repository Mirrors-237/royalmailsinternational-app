export default defineEventHandler((event) => {
  assertSameOrigin(event)
  clearAdminSession(event)
  return { ok: true }
})
