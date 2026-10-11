<template>
  <div>
    <AdminPageTitle title="Quote requests" description="Requests sent from the Get a quote page. Keep their status up to date to follow your pipeline." />

    <div class="mt-8 flex flex-wrap gap-3">
      <label class="relative min-w-60 flex-1">
        <span class="sr-only">Search</span>
        <Icon name="lucide:search" class="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-steel" aria-hidden="true" />
        <input v-model="q" type="search" placeholder="Name, email, company or city" class="field min-h-11 pl-10 pr-3">
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
      <ul v-if="data?.items.length" class="card divide-y divide-line overflow-hidden">
        <li v-for="l in data.items" :key="l.id">
          <NuxtLink :to="`/admin/leads/${l.id}`" class="grid gap-1 px-5 py-4 hover:bg-surface sm:grid-cols-[1fr_auto] sm:items-center sm:gap-6">
            <span class="min-w-0">
              <span class="flex flex-wrap items-center gap-2">
                <span class="font-bold">{{ l.fullName }}</span>
                <span v-if="l.company" class="text-sm text-steel">{{ l.company }}</span>
              </span>
              <span class="mt-0.5 block text-sm text-steel">
                {{ l.originCity }}, {{ l.originCountry }} → {{ l.destinationCity }}, {{ l.destinationCountry }} · {{ Number(l.weightKg) }} kg
                <template v-if="l.transportMode"> · {{ TRANSPORT_MODE[l.transportMode as TransportMode]?.label }}</template>
              </span>
            </span>
            <span class="flex items-center gap-3 sm:justify-end">
              <span class="text-sm text-steel">{{ formatDateTime(l.createdAt) }}</span>
              <AdminBadge :tone="LEAD_STATUS[l.status].tone">{{ LEAD_STATUS[l.status].label }}</AdminBadge>
            </span>
          </NuxtLink>
        </li>
      </ul>
      <AdminEmpty v-else-if="!pending" icon="lucide:inbox" title="No quote requests" :text="q || status ? 'Try another search or filter.' : 'Requests sent from the website will appear here.'" />
      <AdminPagination v-if="data" v-model:page="page" class="mt-5" :limit="data.limit" :total="data.total" />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Quote requests' })

const route = useRoute()
const q = ref(String(route.query.q ?? ''))
const status = ref(String(route.query.status ?? ''))
const page = ref(1)
const debouncedQ = useDebounced(q, 300)
watch([debouncedQ, status], () => { page.value = 1 })

const filters = [{ value: '', label: 'All' }, ...Object.entries(LEAD_STATUS).map(([value, s]) => ({ value, label: s.label }))]

const { data, pending } = await useAsyncData(
  'adm-leads-list',
  () => adminFetch<Paged<AdminLead>>('/api/leads', { query: { q: debouncedQ.value || undefined, status: status.value || undefined, page: page.value } }),
  { watch: [debouncedQ, status, page] },
)
</script>
