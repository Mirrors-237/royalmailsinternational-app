<template>
  <div v-if="lead">
    <AdminPageTitle :title="lead.fullName" :description="`Received ${formatDateTime(lead.createdAt)}`" :back="{ to: '/admin/leads', label: 'Quote requests' }">
      <a :href="replyLink" class="btn btn-brand">
        <Icon name="lucide:reply" class="size-5" aria-hidden="true" />
        Reply by email
      </a>
    </AdminPageTitle>

    <div class="mt-8 grid gap-6 xl:grid-cols-5">
      <div class="space-y-6 xl:col-span-3">
        <section class="card p-6" aria-labelledby="shipment-title">
          <h2 id="shipment-title" class="text-xl">Shipment</h2>
          <dl class="mt-4 grid gap-x-6 gap-y-4 text-sm sm:grid-cols-2">
            <div v-for="row in shipmentRows" :key="row.label">
              <dt class="text-steel">{{ row.label }}</dt>
              <dd class="mt-0.5 font-semibold">{{ row.value }}</dd>
            </div>
          </dl>
          <div v-if="lead.message" class="mt-6 rounded-xl bg-surface p-4">
            <p class="text-sm font-bold">Message</p>
            <p class="mt-1 whitespace-pre-line">{{ lead.message }}</p>
          </div>
        </section>

        <section class="card p-6" aria-labelledby="contact-title">
          <h2 id="contact-title" class="text-xl">Contact</h2>
          <dl class="mt-4 grid gap-x-6 gap-y-4 text-sm sm:grid-cols-2">
            <div><dt class="text-steel">Name</dt><dd class="mt-0.5 font-semibold">{{ lead.fullName }}</dd></div>
            <div v-if="lead.company"><dt class="text-steel">Company</dt><dd class="mt-0.5 font-semibold">{{ lead.company }}</dd></div>
            <div><dt class="text-steel">Email</dt><dd class="mt-0.5"><a :href="`mailto:${lead.email}`" class="font-semibold text-brand hover:underline">{{ lead.email }}</a></dd></div>
            <div><dt class="text-steel">Phone</dt><dd class="mt-0.5"><a :href="`tel:${lead.phone}`" class="font-semibold hover:underline">{{ lead.phone }}</a></dd></div>
          </dl>
        </section>
      </div>

      <aside class="space-y-6 xl:col-span-2">
        <form class="card space-y-5 p-6" @submit.prevent="save">
          <h2 class="text-xl">Follow-up</h2>
          <fieldset>
            <legend class="font-bold">Status</legend>
            <div class="mt-2 flex flex-wrap gap-1.5">
              <label v-for="(s, key) in LEAD_STATUS" :key="key" class="cursor-pointer">
                <input v-model="status" type="radio" name="lead-status" :value="key" class="peer sr-only">
                <span class="inline-flex rounded-full px-3.5 py-2 text-sm font-semibold ring-1 ring-line transition-colors peer-checked:bg-night peer-checked:text-white peer-checked:ring-night peer-focus-visible:outline-3 peer-focus-visible:outline-brand">{{ s.label }}</span>
              </label>
            </div>
          </fieldset>
          <FormField id="adminNotes" label="Internal notes" hint="Price sent, next call… Never shown to the customer." optional>
            <template #default="{ field }"><textarea v-bind="field" v-model="notes" rows="5" maxlength="5000" /></template>
          </FormField>
          <button type="submit" class="btn btn-brand w-full" :disabled="busy">Save</button>
        </form>

        <div class="card p-6">
          <h2 class="text-base">Turn into a shipment</h2>
          <p class="mt-1 text-sm text-steel">Opens a new shipment with the route and parcel details filled in.</p>
          <NuxtLink :to="{ path: '/admin/shipments/new', query: { lead: lead.id } }" class="btn btn-ghost mt-4 w-full">
            <Icon name="lucide:package-plus" class="size-4" aria-hidden="true" />
            Create shipment
          </NuxtLink>
        </div>

        <div class="card p-6">
          <h2 class="text-base">Delete this request</h2>
          <AdminConfirmButton class="mt-3" label="Delete request" :busy="busy" @confirm="remove" />
        </div>
      </aside>
    </div>
  </div>
  <p v-else-if="error" class="card p-6 text-red-700">{{ apiError(error, 'Request not found.') }}</p>
</template>

<script setup lang="ts">
definePageMeta({ layout: 'admin', middleware: 'admin' })

const route = useRoute()
const settings = useSiteSettings()
const { notify } = useAdminNotices()
const id = String(route.params.id)

const { data: lead, error, refresh } = await useAsyncData(`adm-lead-${id}`, () => adminFetch<AdminLead>(`/api/leads/${id}`))
useHead({ title: () => lead.value?.fullName ?? 'Quote request' })

const status = ref<LeadStatus>('NEW')
const notes = ref('')
watch(lead, (l) => { if (l) { status.value = l.status; notes.value = l.adminNotes ?? '' } }, { immediate: true })

// Only used once the request is loaded (the template is under v-if="lead")
const shipmentRows = computed(() => {
  const l = lead.value!
  const dims = [l.lengthCm, l.widthCm, l.heightCm].filter((v: unknown) => v != null)
  return [
    { label: 'From', value: `${l.originCity}, ${l.originCountry}` },
    { label: 'To', value: `${l.destinationCity}, ${l.destinationCountry}` },
    { label: 'Weight', value: `${Number(l.weightKg)} kg` },
    { label: 'Dimensions', value: dims.length === 3 ? `${dims.map(Number).join(' × ')} cm` : 'Not given' },
    { label: 'Service', value: l.transportMode ? TRANSPORT_MODE[l.transportMode as TransportMode]?.label ?? l.transportMode : 'Not sure' },
    { label: 'Contents', value: l.category ? CATEGORY_LABEL[l.category] ?? l.category : 'Not given' },
  ]
})

const replyLink = computed(() => {
  const l = lead.value!
  const subject = `Your quote request: ${l.originCity} to ${l.destinationCity}`
  return `mailto:${l.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Dear ${l.fullName},\n\nThank you for your request.\n\nKind regards,\n${settings.value.siteName}`)}`
})

const busy = ref(false)
async function save() {
  busy.value = true
  try {
    await adminFetch(`/api/leads/${id}/status`, { method: 'PUT', body: { status: status.value, adminNotes: notes.value } })
    await refresh()
    notify('Follow-up saved')
  } catch (err) {
    notify(apiError(err), 'error')
  } finally {
    busy.value = false
  }
}

async function remove() {
  busy.value = true
  try {
    await adminFetch(`/api/leads/${id}`, { method: 'DELETE' })
    notify('Request deleted')
    await navigateTo('/admin/leads')
  } catch (err) {
    notify(apiError(err), 'error')
  } finally {
    busy.value = false
  }
}
</script>
