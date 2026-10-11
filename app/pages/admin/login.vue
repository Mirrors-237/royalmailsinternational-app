<template>
  <div class="night-backdrop grid min-h-dvh place-items-center px-4 py-12 text-white">
    <div class="w-full max-w-md">
      <div class="flex justify-center"><BrandMark on-dark /></div>

      <form class="mt-8 rounded-3xl bg-white p-7 text-ink shadow-[var(--shadow-float)] sm:p-9" novalidate @submit.prevent="submit">
        <h1 class="text-2xl">Sign in to the administration</h1>
        <p class="mt-1.5 text-steel">Manage shipments, requests and the website content.</p>

        <p v-if="error" class="mt-6 flex items-start gap-2.5 rounded-xl bg-red-50 p-3.5 text-sm font-semibold text-red-800" role="alert">
          <Icon name="lucide:circle-alert" class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {{ error }}
        </p>

        <div class="mt-6 space-y-5">
          <FormField id="email" label="Email address">
            <template #default="{ field }"><input v-bind="field" v-model.trim="email" type="email" autocomplete="username" required></template>
          </FormField>
          <FormField id="password" label="Password">
            <template #default="{ field }"><input v-bind="field" v-model="password" type="password" autocomplete="current-password" required></template>
          </FormField>
        </div>

        <button type="submit" class="btn btn-brand mt-7 w-full" :disabled="busy">
          <Icon v-if="busy" name="lucide:refresh-cw" class="size-5 animate-spin" aria-hidden="true" />
          {{ busy ? 'Signing in…' : 'Sign in' }}
        </button>
      </form>

      <p class="mt-6 text-center text-sm text-white/60">
        <NuxtLink to="/" class="hover:text-white">← Back to the website</NuxtLink>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: false })
useHead({ title: 'Sign in', meta: [{ name: 'robots', content: 'noindex, nofollow' }] })

const route = useRoute()
const user = useAdminUser()
const settings = useSiteSettings()
const email = ref('')
const password = ref('')
const error = ref('')
const busy = ref(false)

// Rendered in the browser: load the brand for the logo and colours
const { data: siteData } = await useFetch<Partial<SiteSettings>>('/api/settings', { server: false })
watch(siteData, (d) => { if (d) settings.value = { ...SETTINGS_FALLBACK, ...d } }, { immediate: true })

// Only redirect to admin pages after signing in
const redirect = computed(() => {
  const r = String(route.query.redirect ?? '')
  return r.startsWith('/admin') && !r.startsWith('//') ? r : '/admin'
})

async function submit() {
  error.value = ''
  if (!email.value || !password.value) {
    error.value = 'Enter your email address and password.'
    return
  }
  busy.value = true
  try {
    const res = await $fetch<{ user: AdminUser }>('/api/auth/login', { method: 'POST', body: { email: email.value, password: password.value } })
    user.value = res.user
    await navigateTo(redirect.value)
  } catch (err: any) {
    error.value = err?.statusCode === 401 ? 'Incorrect email address or password.' : apiError(err, 'Sign-in failed. Please try again.')
  } finally {
    busy.value = false
  }
}
</script>
