<template>
  <form class="space-y-4" novalidate @submit.prevent="submit">
    <p v-if="error" class="flex items-start gap-2.5 rounded-xl bg-red-50 p-3.5 text-sm font-semibold text-red-800" role="alert">
      <Icon name="lucide:circle-alert" class="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      {{ error }}
    </p>

    <div class="grid gap-4 sm:grid-cols-2">
      <FormField :id="`${uid}-status`" label="Event">
        <template #default="{ field }">
          <select v-bind="field" v-model="model.status">
            <option v-for="(t, key) in CHECKPOINT_TYPE" :key="key" :value="key">{{ t.label }}</option>
          </select>
        </template>
      </FormField>
      <FormField :id="`${uid}-occurredAt`" label="Date and time" :error="errors.occurredAt">
        <template #default="{ field }"><input v-bind="field" v-model="model.occurredAt" type="datetime-local"></template>
      </FormField>

      <FormField :id="`${uid}-city`" label="Town or city" :error="errors.city">
        <template #default="{ field }"><input v-bind="field" v-model.trim="model.city" maxlength="100" @change="located = ''"></template>
      </FormField>
      <FormField :id="`${uid}-country`" label="Country" :error="errors.country">
        <template #default="{ field }"><input v-bind="field" v-model.trim="model.country" maxlength="100" @change="located = ''"></template>
      </FormField>
    </div>

    <!-- Map position -->
    <div class="rounded-xl bg-surface p-4">
      <div class="flex flex-wrap items-center gap-3">
        <button type="button" class="btn btn-ghost min-h-10 px-3.5 text-sm" :disabled="locating || !model.city" @click="locate">
          <Icon :name="locating ? 'lucide:refresh-cw' : 'lucide:map-pin'" class="size-4" :class="{ 'animate-spin': locating }" aria-hidden="true" />
          {{ locating ? 'Searching…' : 'Find on the map' }}
        </button>
        <p class="min-w-0 flex-1 text-sm" :class="geoError ? 'font-semibold text-red-700' : 'text-steel'" aria-live="polite">
          <template v-if="geoError">{{ geoError }}</template>
          <template v-else-if="located">Found: {{ located }}</template>
          <template v-else-if="hasCoords">Position: {{ model.lat }}, {{ model.lng }}</template>
          <template v-else>Places the event on the map of the tracking page.</template>
        </p>
      </div>
      <details class="mt-3 text-sm" :open="!!errors.lat">
        <summary class="cursor-pointer font-semibold text-steel">Enter the coordinates by hand</summary>
        <div class="mt-3 grid max-w-md grid-cols-2 gap-3">
          <FormField :id="`${uid}-lat`" label="Latitude" :error="errors.lat">
            <template #default="{ field }"><input v-bind="field" v-model="model.lat" type="number" step="0.000001" min="-90" max="90"></template>
          </FormField>
          <FormField :id="`${uid}-lng`" label="Longitude">
            <template #default="{ field }"><input v-bind="field" v-model="model.lng" type="number" step="0.000001" min="-180" max="180"></template>
          </FormField>
        </div>
      </details>
    </div>

    <div class="grid gap-4 sm:grid-cols-2">
      <FormField :id="`${uid}-label`" label="Text shown to the customer" :error="errors.statusLabel" class="sm:col-span-2">
        <template #default="{ field }"><input v-bind="field" v-model="model.statusLabel" maxlength="200" @input="labelEdited = true"></template>
      </FormField>
      <FormField :id="`${uid}-facility`" label="Site" hint="Airport, port, depot…" optional class="sm:col-span-2">
        <template #default="{ field }"><input v-bind="field" v-model.trim="model.facility" maxlength="200"></template>
      </FormField>
    </div>

    <div class="flex flex-wrap gap-3">
      <button type="submit" class="btn btn-brand" :disabled="busy">
        <Icon :name="busy ? 'lucide:refresh-cw' : 'lucide:check'" class="size-5" :class="{ 'animate-spin': busy }" aria-hidden="true" />
        {{ submitLabel }}
      </button>
      <button v-if="cancellable" type="button" class="btn btn-ghost" @click="$emit('cancel')">Cancel</button>
    </div>
  </form>
</template>

<script setup lang="ts">
export interface CheckpointValue {
  status: CheckpointStatus; city: string; country: string; lat: number | string; lng: number | string
  statusLabel: string; facility?: string | null; occurredAt: string
}

const props = defineProps<{ initial?: Partial<CheckpointValue>; submitLabel: string; busy?: boolean; error?: string; cancellable?: boolean }>()
const emit = defineEmits<{ save: [Record<string, unknown>]; cancel: [] }>()
const uid = useId()

// datetime-local works in the browser's local time
const toLocalInput = (iso?: string) => {
  const d = iso ? new Date(iso) : new Date()
  return new Date(d.getTime() - d.getTimezoneOffset() * 60_000).toISOString().slice(0, 16)
}

const model = reactive({
  status: (props.initial?.status ?? 'DEPARTED') as CheckpointStatus,
  city: props.initial?.city ?? '',
  country: props.initial?.country ?? '',
  lat: props.initial?.lat ?? '',
  lng: props.initial?.lng ?? '',
  statusLabel: props.initial?.statusLabel ?? '',
  facility: props.initial?.facility ?? '',
  occurredAt: toLocalInput(props.initial?.occurredAt),
})

// Suggests the customer text from the event and the town, until it is edited by hand
const labelEdited = ref(!!props.initial?.statusLabel)
watch(() => [model.status, model.city], () => {
  if (!labelEdited.value) model.statusLabel = model.city ? CHECKPOINT_TYPE[model.status].example(model.city) : ''
}, { immediate: true })

const hasCoords = computed(() => model.lat !== '' && model.lng !== '')

const locating = ref(false)
const located = ref('')
const geoError = ref('')
async function locate() {
  locating.value = true
  geoError.value = ''
  try {
    const r = await adminFetch<{ lat: number; lng: number; label: string }>('/api/geocode', { query: { q: [model.city, model.country].filter(Boolean).join(', ') } })
    model.lat = r.lat
    model.lng = r.lng
    located.value = r.label
  } catch (err) {
    geoError.value = apiError(err, 'Place not found.')
  } finally {
    locating.value = false
  }
}

const errors = reactive<Record<string, string>>({})
async function submit() {
  for (const k of Object.keys(errors)) delete errors[k]
  if (!model.city) errors.city = 'Required.'
  if (!model.country) errors.country = 'Required.'
  if (!model.statusLabel.trim()) errors.statusLabel = 'Required.'
  if (!model.occurredAt) errors.occurredAt = 'Required.'
  if (Object.keys(errors).length) return

  // Position the event automatically if it has not been located yet
  if (!hasCoords.value) await locate()
  if (!hasCoords.value) {
    errors.lat = 'Find the place on the map or enter its coordinates.'
    return
  }

  emit('save', {
    status: model.status,
    city: model.city,
    country: model.country,
    lat: Number(model.lat),
    lng: Number(model.lng),
    statusLabel: model.statusLabel.trim(),
    facility: model.facility ?? '',
    occurredAt: new Date(model.occurredAt).toISOString(),
  })
}
</script>
