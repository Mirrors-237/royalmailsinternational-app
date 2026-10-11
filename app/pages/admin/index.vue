<template>
  <div>
    <AdminPageTitle title="Dashboard" :description="`Signed in as ${user?.email ?? ''}`">
      <NuxtLink to="/admin/shipments/new" class="btn btn-brand">
        <Icon name="lucide:plus" class="size-5" aria-hidden="true" />
        New shipment
      </NuxtLink>
    </AdminPageTitle>

    <ul class="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <li v-for="k in kpis" :key="k.label">
        <NuxtLink :to="k.to" class="card card-link flex items-center gap-4 p-5">
          <span class="grid size-12 shrink-0 place-items-center rounded-xl" :class="k.tone">
            <Icon :name="k.icon" class="size-6" aria-hidden="true" />
          </span>
          <span>
            <span class="block text-2xl font-extrabold">{{ k.value ?? '–' }}</span>
            <span class="block text-sm text-steel">{{ k.label }}</span>
          </span>
        </NuxtLink>
      </li>
    </ul>

    <div class="mt-8 grid gap-6 xl:grid-cols-5">
      <section class="card overflow-hidden xl:col-span-3" aria-labelledby="recent-shipments">
        <div class="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 id="recent-shipments" class="text-lg">Latest shipments</h2>
          <NuxtLink to="/admin/shipments" class="link-arrow text-sm">All shipments <Icon name="lucide:arrow-right" class="size-4" aria-hidden="true" /></NuxtLink>
        </div>
        <ul v-if="shipments?.items.length" class="divide-y divide-line">
          <li v-for="s in shipments.items" :key="s.id">
            <NuxtLink :to="`/admin/shipments/${s.id}`" class="flex flex-wrap items-center gap-x-4 gap-y-1 px-6 py-3.5 hover:bg-surface">
              <span class="tracking-code w-36 text-sm">{{ s.trackingNumber }}</span>
              <span class="min-w-0 flex-1 truncate text-sm text-steel">{{ s.senderCity }} → {{ s.receiverCity }}</span>
              <AdminBadge :tone="SHIPMENT_TONE[s.status]">{{ SHIPMENT_STATUS[s.status].label }}</AdminBadge>
            </NuxtLink>
          </li>
        </ul>
        <p v-else class="px-6 py-8 text-steel">No shipments yet.</p>
      </section>

      <div class="space-y-6 xl:col-span-2">
        <section class="card overflow-hidden" aria-labelledby="recent-leads">
          <div class="flex items-center justify-between border-b border-line px-6 py-4">
            <h2 id="recent-leads" class="text-lg">New quote requests</h2>
            <NuxtLink to="/admin/leads" class="link-arrow text-sm">All <Icon name="lucide:arrow-right" class="size-4" aria-hidden="true" /></NuxtLink>
          </div>
          <ul v-if="leads?.items.length" class="divide-y divide-line">
            <li v-for="l in leads.items" :key="l.id">
              <NuxtLink :to="`/admin/leads/${l.id}`" class="block px-6 py-3.5 hover:bg-surface">
                <span class="block text-sm font-bold">{{ l.fullName }}</span>
                <span class="block text-sm text-steel">{{ l.originCity }} → {{ l.destinationCity }} · {{ formatDateTime(l.createdAt) }}</span>
              </NuxtLink>
            </li>
          </ul>
          <p v-else class="px-6 py-6 text-sm text-steel">No new requests.</p>
        </section>

        <section class="card overflow-hidden" aria-labelledby="recent-messages">
          <div class="flex items-center justify-between border-b border-line px-6 py-4">
            <h2 id="recent-messages" class="text-lg">Unread messages</h2>
            <NuxtLink to="/admin/messages" class="link-arrow text-sm">All <Icon name="lucide:arrow-right" class="size-4" aria-hidden="true" /></NuxtLink>
          </div>
          <ul v-if="messages?.items.length" class="divide-y divide-line">
            <li v-for="m in messages.items" :key="m.id">
              <NuxtLink :to="{ path: '/admin/messages', query: { open: m.id } }" class="block px-6 py-3.5 hover:bg-surface">
                <span class="block text-sm font-bold">{{ m.subject }}</span>
                <span class="block truncate text-sm text-steel">{{ m.fullName }} · {{ formatDateTime(m.createdAt) }}</span>
              </NuxtLink>
            </li>
          </ul>
          <p v-else class="px-6 py-6 text-sm text-steel">Nothing to read.</p>
        </section>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'Dashboard' })

const user = useAdminUser()

const [{ data: shipStats }, { data: leadStats }, { data: msgStats }, { data: shipments }, { data: leads }, { data: messages }] = await Promise.all([
  useAsyncData('adm-ship-stats', () => adminFetch<{ total: number; inTransit: number; inCustoms: number; delivered: number }>('/api/shipments/stats')),
  useAsyncData('adm-lead-stats', () => adminFetch<{ new: number }>('/api/leads/stats')),
  useAsyncData('adm-msg-stats', () => adminFetch<{ unread: number }>('/api/messages/stats')),
  useAsyncData('adm-ships', () => adminFetch<Paged<AdminShipment>>('/api/shipments?limit=6')),
  useAsyncData('adm-leads', () => adminFetch<Paged<AdminLead>>('/api/leads?limit=4&status=NEW')),
  useAsyncData('adm-msgs', () => adminFetch<Paged<AdminMessage>>('/api/messages?limit=4&status=UNREAD')),
])

const kpis = computed(() => [
  { to: '/admin/shipments', label: 'Shipments in transit', value: shipStats.value ? shipStats.value.inTransit + shipStats.value.inCustoms : null, icon: 'lucide:truck', tone: 'bg-sky-50 text-sky-700' },
  { to: '/admin/shipments', label: 'Delivered', value: shipStats.value?.delivered, icon: 'lucide:circle-check-big', tone: 'bg-emerald-50 text-emerald-700' },
  { to: '/admin/leads', label: 'New quote requests', value: leadStats.value?.new, icon: 'lucide:file-text', tone: 'bg-amber-50 text-amber-800' },
  { to: '/admin/messages', label: 'Unread messages', value: msgStats.value?.unread, icon: 'lucide:mail', tone: 'bg-violet-50 text-violet-700' },
])
</script>
