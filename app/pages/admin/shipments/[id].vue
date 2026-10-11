<template>
  <div v-if="shipment">
    <AdminPageTitle :title="shipment.trackingNumber" :back="{ to: '/admin/shipments', label: 'Shipments' }">
      <NuxtLink :to="`/track/${shipment.trackingNumber}`" target="_blank" class="btn btn-ghost">
        <Icon name="lucide:external-link" class="size-4" aria-hidden="true" />
        Customer tracking page
      </NuxtLink>
      <button type="button" class="btn btn-ghost" @click="copyLink">
        <Icon :name="copied ? 'lucide:check' : 'lucide:link'" class="size-4" aria-hidden="true" />
        {{ copied ? 'Link copied' : 'Copy tracking link' }}
      </button>
    </AdminPageTitle>

    <div class="mt-3 flex flex-wrap items-center gap-2 text-sm text-steel">
      <AdminBadge :tone="SHIPMENT_TONE[shipment.status]">{{ SHIPMENT_STATUS[shipment.status].label }}</AdminBadge>
      <span>{{ shipment.senderCity }}, {{ shipment.senderCountry }} → {{ shipment.receiverCity }}, {{ shipment.receiverCountry }}</span>
      <span aria-hidden="true">·</span>
      <span>Created {{ formatDateTime(shipment.createdAt) }}</span>
    </div>

    <div class="mt-8 grid gap-6 xl:grid-cols-5">
      <!-- Tracking events -->
      <section class="space-y-6 xl:col-span-3" aria-labelledby="events-title">
        <div class="card p-6">
          <div class="flex items-center justify-between gap-4">
            <h2 id="events-title" class="text-xl">Tracking events</h2>
            <button v-if="!adding" type="button" class="btn btn-brand min-h-10 px-4 text-sm" @click="adding = true">
              <Icon name="lucide:plus" class="size-4" aria-hidden="true" />
              Add an event
            </button>
          </div>
          <p class="mt-1 text-sm text-steel">Each event appears on the customer's tracking page and updates the shipment status.</p>

          <div v-if="adding" class="mt-5 rounded-2xl border border-brand-soft bg-brand-wash/50 p-5">
            <h3 class="mb-4 text-base">New event</h3>
            <AdminCheckpointForm submit-label="Add event" cancellable :initial="nextEventDefaults" :busy="busy" :error="eventError" @save="addEvent" @cancel="adding = false" />
          </div>

          <ol v-if="events.length" class="mt-6 space-y-3">
            <li v-for="cp in events" :key="cp.id" class="rounded-2xl border border-line">
              <div v-if="editing !== cp.id" class="flex gap-4 p-4">
                <span class="grid size-10 shrink-0 place-items-center rounded-xl" :class="cp.status === 'EXCEPTION' || cp.status === 'RETURNED' ? 'bg-red-50 text-red-700' : 'bg-brand-wash text-brand'">
                  <Icon :name="CHECKPOINT_ICON[cp.status]" class="size-5" aria-hidden="true" />
                </span>
                <div class="min-w-0 flex-1">
                  <p class="font-bold">{{ cp.statusLabel }}</p>
                  <p class="text-sm text-steel">
                    {{ CHECKPOINT_TYPE[cp.status].label }} · {{ [cp.facility, cp.city, cp.country].filter(Boolean).join(', ') }}
                  </p>
                  <p class="text-sm text-steel">{{ formatDateTime(cp.occurredAt) }}</p>
                </div>
                <div class="flex shrink-0 items-start gap-1">
                  <button type="button" class="grid size-9 place-items-center rounded-lg text-steel hover:bg-surface hover:text-brand" @click="editing = cp.id">
                    <Icon name="lucide:pencil" class="size-4" aria-hidden="true" />
                    <span class="sr-only">Edit this event</span>
                  </button>
                  <AdminConfirmButton label="" confirm-label="Delete?" :busy="busy" @confirm="removeEvent(cp.id)" />
                </div>
              </div>
              <div v-else class="p-5">
                <AdminCheckpointForm submit-label="Save event" cancellable :initial="cp" :busy="busy" :error="eventError" @save="(b) => updateEvent(cp.id, b)" @cancel="editing = null" />
              </div>
            </li>
          </ol>
          <p v-else-if="!adding" class="mt-6 rounded-2xl border border-dashed border-line p-6 text-center text-steel">
            No events yet. Add the first one when the parcel is collected.
          </p>
        </div>
      </section>

      <!-- Details -->
      <aside class="space-y-6 xl:col-span-2">
        <div class="card p-6">
          <h2 class="text-xl">Details</h2>
          <dl class="mt-4 space-y-4 text-sm">
            <div v-for="p in parties" :key="p.title">
              <dt class="font-bold">{{ p.title }}</dt>
              <dd class="mt-1 text-steel">
                {{ p.name }}<br>{{ p.address }}<br>{{ p.city }}, {{ p.country }}<br>
                <a :href="`mailto:${p.email}`" class="text-brand hover:underline">{{ p.email }}</a> · <a :href="`tel:${p.phone}`" class="hover:underline">{{ p.phone }}</a>
              </dd>
            </div>
            <div>
              <dt class="font-bold">Parcel</dt>
              <dd class="mt-1 text-steel">
                {{ TRANSPORT_MODE[shipment.transportMode]?.label }} · {{ CATEGORY_LABEL[shipment.category] }} · {{ Number(shipment.weightKg) }} kg
                <template v-if="shipment.estimatedDelivery"><br>Estimated delivery: {{ formatDate(shipment.estimatedDelivery) }}</template>
                <template v-if="shipment.notes"><br><span class="text-ink">Notes:</span> {{ shipment.notes }}</template>
              </dd>
            </div>
          </dl>
          <button type="button" class="btn btn-ghost mt-5 w-full" @click="editingDetails = !editingDetails">
            <Icon name="lucide:pencil" class="size-4" aria-hidden="true" />
            {{ editingDetails ? 'Close the form' : 'Edit details' }}
          </button>
        </div>

        <div class="card p-6">
          <h2 class="text-base">Delete this shipment</h2>
          <p class="mt-1 text-sm text-steel">The tracking page will stop working. This cannot be undone.</p>
          <AdminConfirmButton class="mt-4" label="Delete shipment" :busy="busy" @confirm="removeShipment" />
        </div>
      </aside>
    </div>

    <section v-if="editingDetails" class="mt-8" aria-label="Edit details">
      <AdminShipmentForm :initial="shipment" submit-label="Save details" :busy="busy" :error="detailsError" @save="saveDetails">
        <template #actions>
          <button type="button" class="btn btn-ghost" @click="editingDetails = false">Cancel</button>
        </template>
      </AdminShipmentForm>
    </section>
  </div>
  <p v-else-if="error" class="card p-6 text-red-700">{{ apiError(error, 'Shipment not found.') }}</p>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const route = useRoute()
const { notify } = useAdminNotices()
const id = computed(() => String(route.params.id))

const { data: shipment, error, refresh } = await useAsyncData(`adm-ship-${id.value}`, () => adminFetch<AdminShipment>(`/api/shipments/${id.value}`))
useHead({ title: () => shipment.value?.trackingNumber ?? 'Shipment' })

// Newest first
const events = computed(() => [...(shipment.value?.checkpoints ?? [])].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt)))

// A new event starts from the place of the latest one
const nextEventDefaults = computed(() => {
  const last = events.value[0]
  return last ? { status: 'ARRIVED' as CheckpointStatus } : { status: 'PICKED_UP' as CheckpointStatus, city: shipment.value?.senderCity, country: shipment.value?.senderCountry }
})

// Only used once the shipment is loaded (the template is under v-if="shipment")
const parties = computed(() => {
  const s = shipment.value!
  return [
    { title: 'Sender', name: s.senderName, address: s.senderAddress, city: s.senderCity, country: s.senderCountry, email: s.senderEmail, phone: s.senderPhone },
    { title: 'Recipient', name: s.receiverName, address: s.receiverAddress, city: s.receiverCity, country: s.receiverCountry, email: s.receiverEmail, phone: s.receiverPhone },
  ]
})

const busy = ref(false)
const adding = ref(false)
const editing = ref<string | null>(null)
const editingDetails = ref(false)
const eventError = ref('')
const detailsError = ref('')

async function run(action: () => Promise<unknown>, done: string, onError: (msg: string) => void) {
  busy.value = true
  try {
    await action()
    await refresh()
    notify(done)
    return true
  } catch (err) {
    onError(apiError(err))
    return false
  } finally {
    busy.value = false
  }
}

async function addEvent(body: Record<string, unknown>) {
  eventError.value = ''
  if (await run(() => adminFetch('/api/checkpoints', { method: 'POST', body: { ...body, shipmentId: id.value } }), 'Event added', (m) => (eventError.value = m))) adding.value = false
}

async function updateEvent(cpId: string, body: Record<string, unknown>) {
  eventError.value = ''
  if (await run(() => adminFetch(`/api/checkpoints/${cpId}`, { method: 'PATCH', body }), 'Event updated', (m) => (eventError.value = m))) editing.value = null
}

async function removeEvent(cpId: string) {
  await run(() => adminFetch(`/api/checkpoints/${cpId}`, { method: 'DELETE' }), 'Event deleted', (m) => notify(m, 'error'))
}

async function saveDetails(body: Record<string, unknown>) {
  detailsError.value = ''
  if (await run(() => adminFetch(`/api/shipments/${id.value}`, { method: 'PUT', body }), 'Details saved', (m) => (detailsError.value = m))) editingDetails.value = false
}

async function removeShipment() {
  busy.value = true
  try {
    await adminFetch(`/api/shipments/${id.value}`, { method: 'DELETE' })
    notify(`Shipment ${shipment.value!.trackingNumber} deleted`)
    await navigateTo('/admin/shipments')
  } catch (err) {
    notify(apiError(err), 'error')
  } finally {
    busy.value = false
  }
}

const copied = ref(false)
async function copyLink() {
  try {
    await navigator.clipboard.writeText(`${window.location.origin}/track/${shipment.value!.trackingNumber}`)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    notify('Copy is not available in this browser.', 'error')
  }
}
</script>
