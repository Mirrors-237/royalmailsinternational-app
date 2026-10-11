// Admin pages: requires a session; otherwise go to the sign-in page and come back afterwards
export default defineNuxtRouteMiddleware(async (to) => {
  if (to.path === '/admin/login') return

  const user = useAdminUser()
  if (!user.value) {
    const res = await $fetch<{ user: AdminUser | null }>('/api/auth/session').catch(() => ({ user: null }))
    user.value = res.user
  }
  if (!user.value) return navigateTo({ path: '/admin/login', query: { redirect: to.fullPath } })
})
