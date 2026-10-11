<template>
  <div>
    <AdminPageTitle title="Brand and content" description="Everything here appears on the public website as soon as it is saved.">
      <NuxtLink to="/" target="_blank" class="btn btn-ghost">
        <Icon name="lucide:external-link" class="size-4" aria-hidden="true" />
        View the website
      </NuxtLink>
    </AdminPageTitle>

    <div role="tablist" aria-label="Settings sections" class="mt-8 flex gap-1 overflow-x-auto rounded-2xl bg-white p-1 ring-1 ring-line">
      <button
        v-for="t in tabs"
        :id="`tab-${t.id}`"
        :key="t.id"
        type="button"
        role="tab"
        :aria-selected="tab === t.id"
        :aria-controls="`panel-${t.id}`"
        :tabindex="tab === t.id ? 0 : -1"
        class="flex shrink-0 items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors"
        :class="tab === t.id ? 'bg-night text-white' : 'text-steel hover:bg-surface hover:text-ink'"
        @click="select(t.id)"
        @keydown.right.prevent="move(1)"
        @keydown.left.prevent="move(-1)"
      >
        <Icon :name="t.icon" class="size-4" aria-hidden="true" />
        {{ t.label }}
      </button>
    </div>

    <div v-if="settings" :id="`panel-${tab}`" role="tabpanel" :aria-labelledby="`tab-${tab}`" class="mt-6">
      <AdminSettingsBrandTab v-if="tab === 'brand'" :settings="settings" @saved="apply" />
      <AdminSettingsContactTab v-else-if="tab === 'contact'" :settings="settings" @saved="apply" />
      <AdminSettingsHomeTab v-else-if="tab === 'home'" :settings="settings" @saved="apply" />
      <AdminSettingsPhotosTab v-else-if="tab === 'photos'" :settings="settings" @saved="apply" />
      <AdminSettingsSeoTab v-else :settings="settings" @saved="apply" />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Brand and content' })

const route = useRoute()
const router = useRouter()
const site = useSiteSettings()

const tabs = [
  { id: 'brand',   label: 'Brand and colours', icon: 'lucide:palette' },
  { id: 'contact', label: 'Contact details',   icon: 'lucide:phone' },
  { id: 'home',    label: 'Home page',         icon: 'lucide:house' },
  { id: 'photos',  label: 'Photos',            icon: 'lucide:image' },
  { id: 'seo',     label: 'Search engines',    icon: 'lucide:search' },
] as const
type TabId = typeof tabs[number]['id']

const tab = ref<TabId>(tabs.some((t) => t.id === route.query.tab) ? (route.query.tab as TabId) : 'brand')
function select(id: TabId) {
  tab.value = id
  router.replace({ query: { tab: id } })
}
function move(step: number) {
  const i = tabs.findIndex((t) => t.id === tab.value)
  const next = tabs[(i + step + tabs.length) % tabs.length]!.id
  select(next)
  nextTick(() => document.getElementById(`tab-${next}`)?.focus())
}

const { data: settings } = await useAsyncData('adm-settings', () => adminFetch<SiteSettings>('/api/settings'))

// After each save: the admin (logo, colours) and the next website pages use the new values
function apply(next: SiteSettings) {
  settings.value = next
  site.value = { ...SETTINGS_FALLBACK, ...next }
}
</script>
