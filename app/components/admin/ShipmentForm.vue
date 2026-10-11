<template>
  <form class="space-y-6" novalidate @submit.prevent="submit">
    <p v-if="error" class="flex items-start gap-3 rounded-xl bg-red-50 p-4 text-sm font-semibold text-red-800" role="alert">
      <Icon name="lucide:triangle-alert" class="mt-0.5 size-5 shrink-0" aria-hidden="true" />
      {{ error }}
    </p>

    <div class="grid gap-6 xl:grid-cols-2">
      <fieldset v-for="party in parties" :key="party.prefix" class="card p-6">
        <legend class="float-left w-full text-lg font-extrabold tracking-tight">{{ party.title }}</legend>
        <div class="clear-both grid gap-4 pt-4 sm:grid-cols-2">
          <FormField :id="`${party.prefix}Name`" label="Full name" :error="errors[`${party.prefix}Name`]" class="sm:col-span-2">
            <template #default="{ field }"><input v-bind="field" v-model.trim="model[`${party.prefix}Name`]" maxlength="120"></template>
          </FormField>
          <FormField :id="`${party.prefix}Email`" label="Email address" :error="errors[`${party.prefix}Email`]">
            <template #default="{ field }"><input v-bind="field" v-model.trim="model[`${party.prefix}Email`]" type="email" maxlength="254"></template>
          </FormField>
          <FormField :id="`${party.prefix}Phone`" label="Phone number" :error="errors[`${party.prefix}Phone`]">
            <template #default="{ field }"><input v-bind="field" v-model.trim="model[`${party.prefix}Phone`]" type="tel" maxlength="40"></template>
          </FormField>
          <FormField :id="`${party.prefix}Address`" label="Address" :error="errors[`${party.prefix}Address`]" class="sm:col-span-2">
            <template #default="{ field }"><input v-bind="field" v-model.trim="model[`${party.prefix}Address`]" maxlength="200"></template>
          </FormField>
          <FormField :id="`${party.prefix}City`" label="Town or city" :error="errors[`${party.prefix}City`]">
            <template #default="{ field }"><input v-bind="field" v-model.trim="model[`${party.prefix}City`]" maxlength="120"></template>
          </FormField>
          <FormField :id="`${party.prefix}Country`" label="Country" :error="errors[`${party.prefix}Country`]">
            <template #default="{ field }"><input v-bind="field" v-model.trim="model[`${party.prefix}Country`]" maxlength="120"></template>
          </FormField>
        </div>
      </fieldset>
    </div>

    <fieldset class="card p-6">
      <legend class="float-left w-full text-lg font-extrabold tracking-tight">Parcel and delivery</legend>
      <div class="clear-both grid gap-4 pt-4 sm:grid-cols-2 lg:grid-cols-4">
        <FormField id="transportMode" label="Service">
          <template #default="{ field }">
            <select v-bind="field" v-model="model.transportMode">
              <option v-for="(m, key) in TRANSPORT_MODE" :key="key" :value="key">{{ m.label }}</option>
            </select>
          </template>
        </FormField>
        <FormField id="category" label="Contents type">
          <template #default="{ field }">
            <select v-bind="field" v-model="model.category">
              <option v-for="(label, key) in CATEGORY_LABEL" :key="key" :value="key">{{ label }}</option>
            </select>
          </template>
        </FormField>
        <FormField id="status" label="Status" hint="Updated automatically when you add a tracking event.">
          <template #default="{ field }">
            <select v-bind="field" v-model="model.status">
              <option v-for="(s, key) in SHIPMENT_STATUS" :key="key" :value="key">{{ s.label }}</option>
            </select>
          </template>
        </FormField>
        <FormField id="estimatedDelivery" label="Estimated delivery" optional>
          <template #default="{ field }"><input v-bind="field" v-model="model.estimatedDelivery" type="date"></template>
        </FormField>

        <FormField id="weightKg" label="Weight (kg)" :error="errors.weightKg">
          <template #default="{ field }"><input v-bind="field" v-model="model.weightKg" type="number" min="0.01" max="100000" step="0.01" inputmode="decimal"></template>
        </FormField>
        <fieldset class="sm:col-span-1 lg:col-span-2">
          <legend class="font-semibold">Dimensions in cm <span class="font-normal text-steel">(optional)</span></legend>
          <div class="mt-2 grid grid-cols-3 gap-2">
            <label v-for="d in dims" :key="d.key">
              <span class="sr-only">{{ d.label }}</span>
              <input v-model="model[d.key]" type="number" min="1" max="10000" :placeholder="d.label" class="field px-3 py-2.5">
            </label>
          </div>
        </fieldset>
        <FormField id="declaredValue" label="Declared value" optional>
          <template #default="{ field }">
            <div class="flex gap-2">
              <input v-bind="field" v-model="model.declaredValue" type="number" min="0" step="0.01" inputmode="decimal" class="field min-w-0 flex-1 px-3.5 py-2.5">
              <select v-model="model.currency" aria-label="Currency" class="field w-24 px-2 py-2.5">
                <option v-for="c in CURRENCIES" :key="c" :value="c">{{ c }}</option>
              </select>
            </div>
          </template>
        </FormField>

        <FormField id="description" label="Description of the contents" optional class="sm:col-span-2">
          <template #default="{ field }"><input v-bind="field" v-model.trim="model.description" maxlength="500"></template>
        </FormField>
        <label class="flex items-center gap-3 self-end py-3 font-semibold sm:col-span-2">
          <input v-model="model.isInsured" type="checkbox" class="size-5 accent-[var(--brand)]">
          Insured shipment
        </label>
        <FormField id="notes" label="Internal notes" hint="Never shown to customers." optional class="sm:col-span-2 lg:col-span-4">
          <template #default="{ field }"><textarea v-bind="field" v-model.trim="model.notes" rows="3" maxlength="2000" /></template>
        </FormField>
      </div>
    </fieldset>

    <div class="flex flex-wrap items-center gap-3">
      <button type="submit" class="btn btn-brand px-7" :disabled="busy">
        <Icon :name="busy ? 'lucide:refresh-cw' : 'lucide:check'" class="size-5" :class="{ 'animate-spin': busy }" aria-hidden="true" />
        {{ submitLabel }}
      </button>
      <slot name="actions" />
    </div>
  </form>
</template>

<script setup lang="ts">
export interface ShipmentInput {
  senderName: string; senderEmail: string; senderPhone: string; senderAddress: string; senderCity: string; senderCountry: string
  receiverName: string; receiverEmail: string; receiverPhone: string; receiverAddress: string; receiverCity: string; receiverCountry: string
  weightKg: string | number; lengthCm: string | number | null; widthCm: string | number | null; heightCm: string | number | null
  category: string; transportMode: string; status: string; estimatedDelivery: string | null
  description: string | null; declaredValue: string | number | null; currency: string | null; isInsured: boolean; notes: string | null
}

const props = defineProps<{ initial?: Partial<ShipmentInput>; submitLabel: string; busy?: boolean; error?: string }>()
const emit = defineEmits<{ save: [Record<string, unknown>] }>()

const CURRENCIES = ['EUR', 'GBP', 'USD', 'XOF', 'XAF', 'MAD', 'DZD', 'CNY']

const model = reactive<ShipmentInput>({
  senderName: '', senderEmail: '', senderPhone: '', senderAddress: '', senderCity: '', senderCountry: '',
  receiverName: '', receiverEmail: '', receiverPhone: '', receiverAddress: '', receiverCity: '', receiverCountry: '',
  weightKg: '', lengthCm: '', widthCm: '', heightCm: '',
  category: 'PARCEL', transportMode: 'AIR', status: 'PENDING', estimatedDelivery: '',
  description: '', declaredValue: '', currency: 'EUR', isInsured: false, notes: '',
  ...props.initial,
})
if (model.estimatedDelivery) model.estimatedDelivery = String(model.estimatedDelivery).slice(0, 10)

const parties = [
  { prefix: 'sender' as const,   title: 'Sender' },
  { prefix: 'receiver' as const, title: 'Recipient' },
]
const dims = [
  { key: 'lengthCm', label: 'Length' },
  { key: 'widthCm',  label: 'Width' },
  { key: 'heightCm', label: 'Height' },
] as const

const errors = reactive<Record<string, string>>({})
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate() {
  for (const k of Object.keys(errors)) delete errors[k]
  for (const p of ['sender', 'receiver'] as const) {
    for (const f of ['Name', 'Phone', 'Address', 'City', 'Country'] as const) {
      if (!model[`${p}${f}`]) errors[`${p}${f}`] = 'Required.'
    }
    if (!EMAIL.test(model[`${p}Email`])) errors[`${p}Email`] = 'Enter a valid email address.'
  }
  if (!(Number(model.weightKg) > 0)) errors.weightKg = 'Enter the weight, for example 12.5.'
  return !Object.keys(errors).length
}

// Empty optional fields are sent as null, so clearing a field also clears it in the database
const num = (v: unknown) => (v === '' || v === null || v === undefined ? null : Number(v))
const text = (v: unknown) => (v === '' || v === null || v === undefined ? null : String(v))

function submit() {
  if (!validate()) {
    nextTick(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
    return
  }
  emit('save', {
    senderName: model.senderName, senderEmail: model.senderEmail, senderPhone: model.senderPhone,
    senderAddress: model.senderAddress, senderCity: model.senderCity, senderCountry: model.senderCountry,
    receiverName: model.receiverName, receiverEmail: model.receiverEmail, receiverPhone: model.receiverPhone,
    receiverAddress: model.receiverAddress, receiverCity: model.receiverCity, receiverCountry: model.receiverCountry,
    weightKg: Number(model.weightKg), lengthCm: num(model.lengthCm), widthCm: num(model.widthCm), heightCm: num(model.heightCm),
    category: model.category, transportMode: model.transportMode, status: model.status,
    estimatedDelivery: text(model.estimatedDelivery), description: text(model.description),
    declaredValue: num(model.declaredValue), currency: text(model.currency), isInsured: model.isInsured, notes: text(model.notes),
  })
}
</script>
