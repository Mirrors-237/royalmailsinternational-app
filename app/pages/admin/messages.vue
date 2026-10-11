<template>
  <div>
    <AdminPageTitle title="Messages" description="Messages sent from the Contact page. Opening a message marks it as read." />

    <div class="mt-8 flex flex-wrap gap-3">
      <label class="relative min-w-60 flex-1">
        <span class="sr-only">Search</span>
        <Icon name="lucide:search" class="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-steel" aria-hidden="true" />
        <input v-model="q" type="search" placeholder="Name, email, subject or text" class="field min-h-11 pl-10 pr-3">
      </label>
      <div class="flex flex-wrap gap-1.5" role="group" aria-label="Filter by status">
        <button
          v-for="f in filters"
          :key="f.value"
          type="button"
          class="rounded-full px-3.5 py-2 text-sm font-semibold transition-colors"
          :class="status === f.value ? 'bg-night text-white' : 'bg-white text-ink ring-1 ring-line hover:ring-field'"
          :aria-pressed="status === f.value"
          @click="status = f.value"
        >{{ f.label }}</button>
      </div>
    </div>

    <div class="mt-5">
      <ul v-if="data?.items.length" class="space-y-3">
        <li v-for="m in data.items" :key="m.id" class="card overflow-hidden" :class="{ 'ring-2 ring-brand-soft': m.status === 'UNREAD' }">
          <button
            type="button"
            class="flex w-full flex-wrap items-center gap-x-4 gap-y-1 px-5 py-4 text-left hover:bg-surface"
            :aria-expanded="open === m.id"
            :aria-controls="`msg-${m.id}`"
            @click="toggle(m)"
          >
            <span class="size-2 shrink-0 rounded-full" :class="m.status === 'UNREAD' ? 'bg-brand' : 'bg-transparent'" aria-hidden="true" />
            <span class="min-w-0 flex-1">
              <span class="block truncate" :class="m.status === 'UNREAD' ? 'font-extrabold' : 'font-semibold'">{{ m.subject }}</span>
              <span class="block truncate text-sm text-steel">{{ m.fullName }} · {{ m.email }}</span>
            </span>
            <span class="text-sm text-steel">{{ formatDateTime(m.createdAt) }}</span>
            <AdminBadge :tone="MESSAGE_STATUS[m.status].tone">{{ MESSAGE_STATUS[m.status].label }}</AdminBadge>
            <Icon name="lucide:chevron-down" class="size-5 text-steel transition-transform" :class="{ 'rotate-180': open === m.id }" aria-hidden="true" />
          </button>
          <div v-show="open === m.id" :id="`msg-${m.id}`" class="border-t border-line px-5 py-5">
            <p class="whitespace-pre-line">{{ m.message }}</p>
            <p v-if="m.phone" class="mt-4 text-sm text-steel">Phone: <a :href="`tel:${m.phone}`" class="font-semibold text-ink hover:underline">{{ m.phone }}</a></p>
            <div class="mt-5 flex flex-wrap gap-2">
              <a :href="replyLink(m)" class="btn btn-brand min-h-10 px-4 text-sm" @click="setStatus(m, 'REPLIED')">
                <Icon name="lucide:reply" class="size-4" aria-hidden="true" />
                Reply by email
              </a>
              <button v-if="m.status !== 'REPLIED'" type="button" class="btn btn-ghost min-h-10 px-4 text-sm" @click="setStatus(m, 'REPLIED')">
                <Icon name="lucide:check" class="size-4" aria-hidden="true" />
                Mark as replied
              </button>
              <button v-if="m.status !== 'UNREAD'" type="button" class="btn btn-ghost min-h-10 px-4 text-sm" @click="setStatus(m, 'UNREAD')">
                Mark as unread
              </button>
              <AdminConfirmButton :busy="busy" @confirm="remove(m)" />
            </div>
          </div>
        </li>
      </ul>
      <AdminEmpty v-else-if="!pending" icon="lucide:mail-open" title="No messages" :text="q || status ? 'Try another search or filter.' : 'Messages sent from the website will appear here.'" />
      <AdminPagination v-if="data" v-model:page="page" class="mt-5" :limit="data.limit" :total="data.total" />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Messages' })

const route = useRoute()
const settings = useSiteSettings()
const { notify } = useAdminNotices()

const q = ref('')
const status = ref('')
const page = ref(1)
const debouncedQ = useDebounced(q, 300)
watch([debouncedQ, status], () => { page.value = 1 })

const filters = [{ value: '', label: 'All' }, ...Object.entries(MESSAGE_STATUS).map(([value, s]) => ({ value, label: s.label }))]

const { data, pending, refresh } = await useAsyncData(
  'adm-messages',
  () => adminFetch<Paged<AdminMessage>>('/api/messages', { query: { q: debouncedQ.value || undefined, status: status.value || undefined, page: page.value } }),
  { watch: [debouncedQ, status, page] },
)

const open = ref<string | null>(typeof route.query.open === 'string' ? route.query.open : null)
const busy = ref(false)

async function setStatus(m: AdminMessage, next: MessageStatus) {
  try {
    await adminFetch(`/api/messages/${m.id}/status`, { method: 'PATCH', body: { status: next } })
    m.status = next
  } catch (err) {
    notify(apiError(err), 'error')
  }
}

function toggle(m: AdminMessage) {
  open.value = open.value === m.id ? null : m.id
  if (open.value && m.status === 'UNREAD') setStatus(m, 'READ')
}

// The message opened from the dashboard is marked as read too
watch(data, (d) => {
  const m = d?.items.find((x) => x.id === open.value)
  if (m?.status === 'UNREAD') setStatus(m, 'READ')
}, { immediate: true })

function replyLink(m: AdminMessage) {
  const quoted = m.message.split('\n').map((l: string) => `> ${l}`).join('\n')
  return `mailto:${m.email}?subject=${encodeURIComponent(`Re: ${m.subject}`)}&body=${encodeURIComponent(`Dear ${m.fullName},\n\n\n\nKind regards,\n${settings.value.siteName}\n\n${quoted}`)}`
}

async function remove(m: AdminMessage) {
  busy.value = true
  try {
    await adminFetch(`/api/messages/${m.id}`, { method: 'DELETE' })
    notify('Message deleted')
    await refresh()
  } catch (err) {
    notify(apiError(err), 'error')
  } finally {
    busy.value = false
  }
}
</script>
