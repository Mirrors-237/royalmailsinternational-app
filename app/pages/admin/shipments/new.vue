<template>
  <div>
    <AdminPageTitle
      title="New shipment"
      description="The tracking number is generated when you save. You can then add tracking events."
      :back="{ to: '/admin/shipments', label: 'Shipments' }"
    />
    <p v-if="lead" class="mt-6 flex items-center gap-2.5 rounded-xl bg-brand-wash p-4 text-sm">
      <Icon name="lucide:info" class="size-5 shrink-0 text-brand" aria-hidden="true" />
      Filled in from the quote request of {{ lead.fullName }}. Complete the addresses before saving.
    </p>
    <AdminShipmentForm v-if="ready" class="mt-8" :initial="initial" submit-label="Create shipment" :busy="busy" :error="error" @save="create" />
  </div>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })
useHead({ title: 'New shipment' })

const route = useRoute()
const { notify } = useAdminNotices()

// Coming from a quote request (?lead=…): start from its details
const leadId = typeof route.query.lead === 'string' ? route.query.lead : ''
const { data: lead, status: leadStatus } = await useAsyncData('adm-new-from-lead', () => (leadId ? adminFetch<AdminLead>(`/api/leads/${leadId}`) : Promise.resolve(null)))
const ready = computed(() => !leadId || leadStatus.value !== 'pending')
const initial = computed(() => {
  const l = lead.value
  if (!l) return undefined
  return {
    senderName: l.fullName, senderEmail: l.email, senderPhone: l.phone,
    senderCity: l.originCity, senderCountry: l.originCountry,
    receiverCity: l.destinationCity, receiverCountry: l.destinationCountry,
    weightKg: Number(l.weightKg), lengthCm: l.lengthCm, widthCm: l.widthCm, heightCm: l.heightCm,
    ...(l.transportMode && l.transportMode in TRANSPORT_MODE && { transportMode: l.transportMode }),
    ...(l.category && l.category in CATEGORY_LABEL && { category: l.category }),
  }
})
const busy = ref(false)
const error = ref('')

async function create(body: Record<string, unknown>) {
  busy.value = true
  error.value = ''
  try {
    const s = await adminFetch<{ id: string; trackingNumber: string }>('/api/shipments', { method: 'POST', body })
    notify(`Shipment ${s.trackingNumber} created`)
    await navigateTo(`/admin/shipments/${s.id}`)
  } catch (err) {
    error.value = apiError(err)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } finally {
    busy.value = false
  }
}
</script>
