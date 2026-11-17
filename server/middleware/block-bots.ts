// robots.txt is only a request: the robots listed in BLOCKED_BOTS that ignore it get a 403 here
export default defineEventHandler((event) => {
  if (event.path === '/robots.txt') return
  if (isBlockedBot(getRequestHeader(event, 'user-agent'))) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }
})
