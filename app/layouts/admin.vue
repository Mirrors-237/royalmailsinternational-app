<template>
  <div class="min-h-dvh bg-surface lg:grid lg:grid-cols-[17rem_1fr]">
    <a href="#admin-content" class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-ink focus:px-4 focus:py-3 focus:text-white">Skip to content</a>

    <!-- Sidebar (a drawer on small screens) -->
    <aside
      class="night-backdrop fixed inset-y-0 left-0 z-40 flex w-72 flex-col text-white transition-transform lg:sticky lg:top-0 lg:h-dvh lg:w-auto lg:translate-x-0"
      :class="menuOpen ? 'translate-x-0' : '-translate-x-full'"
      aria-label="Administration"
    >
      <div class="flex h-20 items-center justify-between px-5">
        <BrandMark on-dark />
        <button type="button" class="grid size-10 place-items-center rounded-xl hover:bg-white/10 lg:hidden" @click="menuOpen = false">
          <Icon name="lucide:x" class="size-5" aria-hidden="true" />
          <span class="sr-only">Close menu</span>
        </button>
      </div>

      <nav class="flex-1 overflow-y-auto px-3 py-2">
        <p class="px-3 pb-2 pt-3 text-xs font-semibold text-white/45">Operations</p>
        <ul class="space-y-0.5">
          <li v-for="item in operations" :key="item.to">
            <AdminNavLink v-bind="item" />
          </li>
        </ul>
        <p class="px-3 pb-2 pt-6 text-xs font-semibold text-white/45">Website</p>
        <ul class="space-y-0.5">
          <li v-for="item in website" :key="item.to">
            <AdminNavLink v-bind="item" />
          </li>
        </ul>
      </nav>

      <div class="border-t border-white/10 p-4">
        <NuxtLink to="/admin/account" class="flex items-center gap-2 rounded-lg px-1 py-1 text-sm text-white/60 hover:text-white" :aria-current="route.path === '/admin/account' ? 'page' : undefined">
          <Icon name="lucide:circle-user" class="size-4 shrink-0" aria-hidden="true" />
          <span class="min-w-0 truncate">{{ user?.email }}</span>
          <span class="sr-only">, account and password</span>
        </NuxtLink>
        <div class="mt-3 grid grid-cols-2 gap-2">
          <NuxtLink to="/" target="_blank" class="btn btn-glass min-h-10 px-3 text-sm">
            <Icon name="lucide:external-link" class="size-4" aria-hidden="true" />
            Website
          </NuxtLink>
          <button type="button" class="btn btn-glass min-h-10 px-3 text-sm" @click="logout">
            <Icon name="lucide:log-out" class="size-4" aria-hidden="true" />
            Sign out
          </button>
        </div>
      </div>
    </aside>
    <div v-if="menuOpen" class="fixed inset-0 z-30 bg-night/50 lg:hidden" aria-hidden="true" @click="menuOpen = false" />

    <div class="min-w-0">
      <header class="sticky top-0 z-20 flex h-16 items-center gap-3 border-b border-line bg-white/90 px-4 backdrop-blur lg:hidden">
        <button type="button" class="grid size-10 place-items-center rounded-xl bg-surface" :aria-expanded="menuOpen" @click="menuOpen = true">
          <Icon name="lucide:menu" class="size-5" aria-hidden="true" />
          <span class="sr-only">Open menu</span>
        </button>
        <span class="font-bold">Administration</span>
      </header>

      <main id="admin-content" class="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-10 lg:py-10" tabindex="-1">
        <slot />
      </main>
    </div>

    <!-- Confirmations -->
    <div class="pointer-events-none fixed bottom-4 right-4 z-50 flex w-[min(24rem,calc(100vw-2rem))] flex-col gap-2" aria-live="polite">
      <TransitionGroup
        enter-active-class="transition duration-200 ease-out"
        enter-from-class="translate-y-2 opacity-0"
        leave-active-class="transition duration-150 ease-in"
        leave-to-class="opacity-0"
      >
        <p
          v-for="n in notices"
          :key="n.id"
          class="pointer-events-auto flex items-start gap-3 rounded-xl px-4 py-3 text-sm font-semibold shadow-[var(--shadow-lift)]"
          :class="n.tone === 'error' ? 'bg-red-700 text-white' : 'bg-night text-white'"
          :role="n.tone === 'error' ? 'alert' : 'status'"
        >
          <Icon :name="n.tone === 'error' ? 'lucide:circle-alert' : 'lucide:circle-check'" class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
          {{ n.text }}
        </p>
      </TransitionGroup>
    </div>
  </div>
</template>

<script setup lang="ts">
const route = useRoute()
const user = useAdminUser()
const settings = useSiteSettings()
const { notices } = useAdminNotices()
const menuOpen = ref(false)

useHead({ title: 'Administration', meta: [{ name: 'robots', content: 'noindex, nofollow' }] })

// Admin pages are rendered in the browser: load the brand (name, logo, colours) here
const { data: siteData } = await useFetch<Partial<SiteSettings>>('/api/settings', { server: false })
watch(siteData, (d) => { if (d) settings.value = { ...SETTINGS_FALLBACK, ...d } }, { immediate: true })

// Counters next to the menu entries
const counts = useState('admin-counts', () => ({ leads: 0, messages: 0 }))
async function refreshCounts() {
  const [leads, messages] = await Promise.all([
    adminFetch<{ new: number }>('/api/leads/stats').catch(() => ({ new: 0 })),
    adminFetch<{ unread: number }>('/api/messages/stats').catch(() => ({ unread: 0 })),
  ])
  counts.value = { leads: leads.new, messages: messages.unread }
}
onMounted(refreshCounts)
watch(() => route.fullPath, () => { menuOpen.value = false; refreshCounts() })

const operations = computed(() => [
  { to: '/admin',           icon: 'lucide:layout-dashboard', label: 'Dashboard', exact: true },
  { to: '/admin/shipments', icon: 'lucide:package',          label: 'Shipments' },
  { to: '/admin/leads',     icon: 'lucide:file-text',        label: 'Quote requests', count: counts.value.leads },
  { to: '/admin/messages',  icon: 'lucide:mail',             label: 'Messages', count: counts.value.messages },
])

const website = [
  { to: '/admin/settings',     icon: 'lucide:palette',        label: 'Brand and content' },
  { to: '/admin/testimonials', icon: 'lucide:message-square-quote', label: 'Testimonials' },
  { to: '/admin/partners',     icon: 'lucide:handshake',      label: 'Partners' },
]

async function logout() {
  await $fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
  user.value = null
  await navigateTo('/admin/login')
}
</script>
