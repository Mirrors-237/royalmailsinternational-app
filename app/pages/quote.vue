<template>
  <div>
    <PageHeader
      title="Get a quote"
      intro="Tell us what you're sending and where. We'll reply with a price within 24 hours, with no obligation."
      :crumbs="[{ label: 'Get a quote' }]"
      :image="media.air"
    />

    <div class="container-site grid gap-8 py-20 lg:grid-cols-12 lg:gap-10 lg:py-24">
      <!-- Confirmation -->
      <div v-if="done" class="lg:col-span-8" role="status">
        <div class="card p-8 sm:p-10">
          <span class="grid size-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-700"><Icon name="lucide:circle-check-big" class="size-7" aria-hidden="true" /></span>
          <h2 class="mt-5 text-3xl">Thank you, {{ firstName }}</h2>
          <p class="mt-3 text-lg text-steel">
            We've received your quote request for {{ form.originCity }} to {{ form.destinationCity }}.
            We'll reply to <span class="font-semibold text-ink">{{ form.email }}</span> within 24 hours.
          </p>
          <div class="mt-8 flex flex-wrap gap-3">
            <NuxtLink to="/" class="btn btn-dark">Back to the home page</NuxtLink>
            <NuxtLink to="/send" class="btn btn-ghost">Shipping options</NuxtLink>
          </div>
        </div>
      </div>

      <!-- Form -->
      <form v-else class="space-y-6 lg:col-span-8" novalidate @submit.prevent="send">
        <p v-if="formError" class="flex items-start gap-3 rounded-xl bg-red-50 p-4 font-semibold text-red-800" role="alert">
          <Icon name="lucide:triangle-alert" class="mt-0.5 size-5 shrink-0" aria-hidden="true" />
          {{ formError }}
        </p>

        <fieldset class="card p-6 sm:p-8">
          <legend class="float-left w-full">
            <span class="flex items-center gap-3 text-2xl font-extrabold tracking-tight">
              <span class="grid size-9 place-items-center rounded-xl bg-night text-base text-white" aria-hidden="true">1</span>
              Your shipment
            </span>
          </legend>
          <div class="clear-both" />

          <p class="mt-7 font-semibold">Service <span class="font-normal text-steel">(optional)</span></p>
          <div class="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-5" role="radiogroup" aria-label="Service">
            <label v-for="m in modes" :key="m.value" class="group relative cursor-pointer">
              <input v-model="form.transportMode" type="radio" name="transportMode" :value="m.value" class="peer sr-only">
              <span class="flex h-full flex-col items-center gap-2 rounded-xl border border-line bg-white px-3 py-4 text-center text-sm font-semibold transition-all group-hover:border-field peer-checked:border-brand peer-checked:bg-brand-wash peer-checked:text-brand peer-checked:shadow-[0_0_0_3px_color-mix(in_oklab,var(--brand)_18%,transparent)] peer-focus-visible:outline-3 peer-focus-visible:outline-brand">
                <Icon :name="m.icon" class="size-6" aria-hidden="true" />
                {{ m.label }}
              </span>
            </label>
          </div>

          <p class="mt-7 font-semibold">What are you sending? <span class="font-normal text-steel">(optional)</span></p>
          <div class="mt-3 flex flex-wrap gap-2" role="radiogroup" aria-label="What are you sending?">
            <label v-for="(label, key) in CATEGORY_LABEL" :key="key" class="cursor-pointer">
              <input v-model="form.category" type="radio" name="category" :value="key" class="peer sr-only">
              <span class="inline-flex rounded-full border border-line bg-white px-4 py-2 text-sm font-semibold transition-colors hover:border-field peer-checked:border-night peer-checked:bg-night peer-checked:text-white peer-focus-visible:outline-3 peer-focus-visible:outline-brand">{{ label }}</span>
            </label>
          </div>

          <div class="mt-7 grid gap-6 sm:grid-cols-2">
            <FormField id="weightKg" label="Total weight (kg)" :error="errors.weightKg">
              <template #default="{ field }"><input v-bind="field" v-model="form.weightKg" type="number" inputmode="decimal" min="0.01" max="100000" step="0.01"></template>
            </FormField>
            <fieldset>
              <legend class="font-semibold">Dimensions in cm <span class="font-normal text-steel">(optional)</span></legend>
              <div class="mt-2 grid grid-cols-3 gap-2">
                <label v-for="d in dimensions" :key="d.key" class="block">
                  <span class="sr-only">{{ d.label }}</span>
                  <input v-model="form[d.key]" type="number" inputmode="numeric" min="1" max="10000" :placeholder="d.label" class="field px-3 py-2.5">
                </label>
              </div>
            </fieldset>
          </div>
        </fieldset>

        <fieldset class="card p-6 sm:p-8">
          <legend class="float-left w-full">
            <span class="flex items-center gap-3 text-2xl font-extrabold tracking-tight">
              <span class="grid size-9 place-items-center rounded-xl bg-night text-base text-white" aria-hidden="true">2</span>
              Route
            </span>
          </legend>
          <div class="clear-both" />
          <div class="mt-7 grid gap-6 sm:grid-cols-2">
            <FormField id="originCity" label="From (town or city)" :error="errors.originCity">
              <template #default="{ field }"><input v-bind="field" v-model.trim="form.originCity" maxlength="100"></template>
            </FormField>
            <FormField id="originCountry" label="From (country)" :error="errors.originCountry">
              <template #default="{ field }"><input v-bind="field" v-model.trim="form.originCountry" autocomplete="country-name" maxlength="100"></template>
            </FormField>
            <FormField id="destinationCity" label="To (town or city)" :error="errors.destinationCity">
              <template #default="{ field }"><input v-bind="field" v-model.trim="form.destinationCity" maxlength="100"></template>
            </FormField>
            <FormField id="destinationCountry" label="To (country)" :error="errors.destinationCountry">
              <template #default="{ field }"><input v-bind="field" v-model.trim="form.destinationCountry" maxlength="100"></template>
            </FormField>
          </div>
        </fieldset>

        <fieldset class="card p-6 sm:p-8">
          <legend class="float-left w-full">
            <span class="flex items-center gap-3 text-2xl font-extrabold tracking-tight">
              <span class="grid size-9 place-items-center rounded-xl bg-night text-base text-white" aria-hidden="true">3</span>
              Your details
            </span>
          </legend>
          <div class="clear-both" />
          <div class="mt-7 grid gap-6 sm:grid-cols-2">
            <FormField id="fullName" label="Full name" :error="errors.fullName">
              <template #default="{ field }"><input v-bind="field" v-model.trim="form.fullName" autocomplete="name" maxlength="120"></template>
            </FormField>
            <FormField id="company" label="Company" optional>
              <template #default="{ field }"><input v-bind="field" v-model.trim="form.company" autocomplete="organization" maxlength="120"></template>
            </FormField>
            <FormField id="email" label="Email address" :error="errors.email">
              <template #default="{ field }"><input v-bind="field" v-model.trim="form.email" type="email" autocomplete="email" maxlength="254"></template>
            </FormField>
            <FormField id="phone" label="Phone number" :error="errors.phone">
              <template #default="{ field }"><input v-bind="field" v-model.trim="form.phone" type="tel" autocomplete="tel" maxlength="40"></template>
            </FormField>
          </div>
          <FormField id="message" label="Anything else we should know?" hint="Contents, required delivery date, special handling…" optional class="mt-6">
            <template #default="{ field }"><textarea v-bind="field" v-model.trim="form.message" rows="4" maxlength="5000" /></template>
          </FormField>

          <div class="mt-8 flex flex-wrap items-center gap-4 border-t border-line pt-7">
            <button type="submit" class="btn btn-accent px-8 text-lg" :disabled="sending">
              <Icon v-if="sending" name="lucide:refresh-cw" class="size-5 animate-spin" aria-hidden="true" />
              {{ sending ? 'Sending…' : 'Send quote request' }}
              <Icon v-if="!sending" name="lucide:arrow-right" class="size-5" aria-hidden="true" />
            </button>
            <p class="text-sm text-steel">
              We only use your details to answer this request. See our <NuxtLink to="/privacy" class="link">privacy notice</NuxtLink>.
            </p>
          </div>
        </fieldset>
      </form>

      <aside class="lg:col-span-4">
        <div class="space-y-6 lg:sticky lg:top-28">
          <div class="night-backdrop overflow-hidden rounded-3xl text-white shadow-[var(--shadow-lift)]">
            <div class="bg-white/95 px-8 pt-6"><Illustration name="send" class="mx-auto h-40" /></div>
            <div class="p-7 sm:p-8">
            <h2 class="text-2xl">What happens next</h2>
            <ol class="mt-6 space-y-5">
              <li v-for="(s, i) in nextSteps" :key="s" class="flex gap-4">
                <span class="grid size-8 shrink-0 place-items-center rounded-full bg-accent text-sm font-extrabold text-on-accent" aria-hidden="true">{{ i + 1 }}</span>
                <p class="pt-1 text-white/80">{{ s }}</p>
              </li>
            </ol>
            <ul class="mt-7 space-y-2 border-t border-white/10 pt-6 text-sm text-white/75">
              <li v-for="p in promises" :key="p" class="flex items-center gap-2">
                <Icon name="lucide:check" class="size-4 text-emerald-400" aria-hidden="true" />
                {{ p }}
              </li>
            </ul>
            </div>
          </div>
          <div v-if="settings.phone" class="card p-6">
            <h2 class="text-xl">Prefer to talk?</h2>
            <p class="mt-2 text-steel">Call us{{ settings.openingHours ? `, ${settings.openingHours}` : '' }}.</p>
            <a :href="`tel:${settings.phone.replace(/\s/g, '')}`" class="btn btn-ghost mt-5 w-full">
              <Icon name="lucide:phone" class="size-5 text-brand" aria-hidden="true" />
              {{ settings.phone }}
            </a>
          </div>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
const media = useMedia()
usePageSeo({
  title: 'Get a quote',
  description: 'Request a free quote for air, sea or road freight. We reply within 24 hours.',
})

const settings = useSiteSettings()

const form = reactive({
  fullName: '', company: '', email: '', phone: '',
  originCity: '', originCountry: '', destinationCity: '', destinationCountry: '',
  transportMode: '', category: '', weightKg: '' as string | number,
  lengthCm: '' as string | number, widthCm: '' as string | number, heightCm: '' as string | number,
  message: '',
})

const dimensions = [
  { key: 'lengthCm', label: 'Length' },
  { key: 'widthCm',  label: 'Width' },
  { key: 'heightCm', label: 'Height' },
] as const

const modes = [
  ...Object.entries(TRANSPORT_MODE).map(([value, m]) => ({ value, label: m.label, icon: m.icon })),
  { value: '', label: 'Not sure', icon: 'lucide:circle-help' },
]

const promises = ['No obligation', 'Reply within 24 hours', 'Customs paperwork included']

const nextSteps = [
  'We check your request and the best route.',
  'You receive a detailed price by email within 24 hours.',
  'Once you accept, we arrange collection.',
]

const errors = reactive<Record<string, string>>({})
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate() {
  for (const key of Object.keys(errors)) delete errors[key]
  if (!form.fullName) errors.fullName = 'Enter your full name.'
  if (!EMAIL.test(form.email)) errors.email = 'Enter an email address in the format name@example.com.'
  if (!form.phone) errors.phone = 'Enter a phone number so we can reach you about the quote.'
  if (!form.originCity) errors.originCity = 'Enter the town or city the shipment leaves from.'
  if (!form.originCountry) errors.originCountry = 'Enter the country the shipment leaves from.'
  if (!form.destinationCity) errors.destinationCity = 'Enter the destination town or city.'
  if (!form.destinationCountry) errors.destinationCountry = 'Enter the destination country.'
  const weight = Number(form.weightKg)
  if (!(weight > 0)) errors.weightKg = 'Enter the total weight in kilograms, for example 12.5.'
  return Object.keys(errors).length === 0
}

const { sending, done, formError, submit } = useFormSubmit('/api/leads')

const firstName = computed(() => form.fullName.split(' ')[0])

async function send() {
  if (!validate()) {
    // Move focus to the first field with an error
    nextTick(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
    return
  }
  const optionalNumber = (v: string | number) => (v === '' ? undefined : Number(v))
  await submit({
    fullName: form.fullName,
    company: form.company || undefined,
    email: form.email,
    phone: form.phone,
    originCity: form.originCity,
    originCountry: form.originCountry,
    destinationCity: form.destinationCity,
    destinationCountry: form.destinationCountry,
    transportMode: form.transportMode || undefined,
    category: form.category || undefined,
    weightKg: Number(form.weightKg),
    lengthCm: optionalNumber(form.lengthCm),
    widthCm: optionalNumber(form.widthCm),
    heightCm: optionalNumber(form.heightCm),
    message: form.message || undefined,
  })
  if (done.value) window.scrollTo({ top: 0 })
}
</script>
