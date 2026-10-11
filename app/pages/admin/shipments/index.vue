<template>
  <div>
    <AdminPageTitle title="Shipments" description="Create shipments, add tracking events and follow their progress.">
      <NuxtLink to="/admin/shipments/new" class="btn btn-brand">
        <Icon name="lucide:plus" class="size-5" aria-hidden="true" />
        New shipment
      </NuxtLink>
    </AdminPageTitle>

    <form class="mt-8 flex flex-wrap gap-3" role="search" @submit.prevent>
      <label class="relative min-w-60 flex-1">
        <span class="sr-only">Search</span>
        <Icon name="lucide:search" class="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-steel" aria-hidden="true" />
        <input v-model="q" type="search" placeholder="Tracking number, name or city" class="field min-h-11 pl-10 pr-3">
      </label>
      <label>
        <span class="sr-only">Status</span>
        <select v-model="status" class="field min-h-11 px-3 pr-8">
          <option value="">All statuses</option>
          <option v-for="(s, key) in SHIPMENT_STATUS" :key="key" :value="key">{{ s.label }}</option>
        </select>
      </label>
    </form>

    <div class="mt-5">
      <div v-if="data?.items.length" class="card overflow-x-auto">
        <table class="w-full min-w-[46rem] text-left text-sm">
          <thead class="border-b border-line bg-surface text-xs font-semibold text-steel">
            <tr>
              <th scope="col" class="px-5 py-3">Tracking number</th>
              <th scope="col" class="px-5 py-3">Route</th>
              <th scope="col" class="px-5 py-3">Recipient</th>
              <th scope="col" class="px-5 py-3">Status</th>
              <th scope="col" class="px-5 py-3">Created</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-line">
            <tr v-for="s in data.items" :key="s.id" class="hover:bg-surface">
              <td class="px-5 py-3.5">
                <NuxtLink :to="`/admin/shipments/${s.id}`" class="tracking-code text-brand hover:underline">{{ s.trackingNumber }}</NuxtLink>
              </td>
              <td class="px-5 py-3.5">
                <span class="inline-flex items-center gap-2">
                  <Icon :name="TRANSPORT_MODE[s.transportMode]?.icon ?? 'lucide:package'" class="size-4 text-steel" aria-hidden="true" />
                  {{ s.senderCity }} → {{ s.receiverCity }}
                </span>
              </td>
              <td class="px-5 py-3.5">{{ s.receiverName }}</td>
              <td class="px-5 py-3.5"><AdminBadge :tone="SHIPMENT_TONE[s.status]">{{ SHIPMENT_STATUS[s.status].label }}</AdminBadge></td>
              <td class="whitespace-nowrap px-5 py-3.5 text-steel">{{ formatDateTime(s.createdAt) }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <AdminEmpty v-else-if="!pending" icon="lucide:package-search" :title="q || status ? 'No shipment matches' : 'No shipments yet'" :text="q || status ? 'Try another search or status.' : 'Create the first one: its tracking number is generated automatically.'">
        <NuxtLink v-if="!q && !status" to="/admin/shipments/new" class="btn btn-brand">New shipment</NuxtLink>
      </AdminEmpty>

      <AdminPagination v-if="data" v-model:page="page" class="mt-5" :limit="data.limit" :total="data.total" />
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Shipments' })

const route = useRoute()
const router = useRouter()

// Search, filter and page live in the address so they survive a reload or the back button
const q = ref(String(route.query.q ?? ''))
const status = ref(String(route.query.status ?? ''))
const page = ref(Number(route.query.page ?? 1) || 1)
const debouncedQ = useDebounced(q, 300)

watch([debouncedQ, status], () => { page.value = 1 })
watch([debouncedQ, status, page], () => {
  router.replace({ query: { ...(debouncedQ.value && { q: debouncedQ.value }), ...(status.value && { status: status.value }), ...(page.value > 1 && { page: page.value }) } })
})

const { data, pending } = await useAsyncData(
  'adm-shipments',
  () => adminFetch<Paged<AdminShipment>>('/api/shipments', { query: { q: debouncedQ.value || undefined, status: status.value || undefined, page: page.value, limit: 20 } }),
  { watch: [debouncedQ, status, page] },
)
</script>
