<template>
  <div>
    <PageHeader
      title="Contact us"
      intro="A question about a shipment, a quote or customs? Send us a message and we'll reply as soon as we can."
      :crumbs="[{ label: 'Contact us' }]"
      :image="media.receive"
    />

    <div class="container-site grid gap-8 py-20 lg:grid-cols-12 lg:gap-10 lg:py-24">
      <div class="lg:col-span-7">
        <!-- Confirmation -->
        <div v-if="done" class="card p-8 sm:p-10" role="status">
          <span class="grid size-14 place-items-center rounded-2xl bg-emerald-50 text-emerald-700"><Icon name="lucide:circle-check-big" class="size-7" aria-hidden="true" /></span>
          <h2 class="mt-4 text-3xl">Message sent</h2>
          <p class="mt-3 text-lg text-steel">
            Thank you, {{ form.fullName.split(' ')[0] }}. We'll reply to <span class="font-semibold text-ink">{{ form.email }}</span> as soon as possible.
          </p>
          <NuxtLink to="/" class="btn btn-dark mt-8">Back to the home page</NuxtLink>
        </div>

        <!-- Form -->
        <form v-else class="card space-y-6 p-7 sm:p-10" novalidate @submit.prevent="send">
          <div>
            <h2 class="text-3xl">Send us a message</h2>
            <p class="mt-2 text-steel">All fields are required unless marked optional.</p>
          </div>

          <p v-if="formError" class="flex items-start gap-3 rounded-card bg-red-50 p-4 font-semibold text-red-800" role="alert">
            <Icon name="lucide:triangle-alert" class="mt-0.5 size-5 shrink-0" aria-hidden="true" />
            {{ formError }}
          </p>

          <FormField id="subject" label="What is it about?" :error="errors.subject">
            <template #default="{ field }">
              <select v-bind="field" v-model="form.subject">
                <option value="">Select a topic</option>
                <option v-for="s in subjects" :key="s" :value="s">{{ s }}</option>
              </select>
            </template>
          </FormField>

          <FormField
            v-if="form.subject === 'Tracking a shipment' || form.subject === 'Customs and duties'"
            id="trackingNumber"
            label="Tracking number"
            optional
          >
            <template #default="{ field }">
              <input v-bind="field" v-model.trim="form.trackingNumber" maxlength="40" class="tracking-code uppercase" autocapitalize="characters" spellcheck="false">
            </template>
          </FormField>

          <div class="grid gap-6 sm:grid-cols-2">
            <FormField id="fullName" label="Full name" :error="errors.fullName">
              <template #default="{ field }"><input v-bind="field" v-model.trim="form.fullName" autocomplete="name" maxlength="120"></template>
            </FormField>
            <FormField id="phone" label="Phone number" optional>
              <template #default="{ field }"><input v-bind="field" v-model.trim="form.phone" type="tel" autocomplete="tel" maxlength="40"></template>
            </FormField>
          </div>

          <FormField id="email" label="Email address" :error="errors.email">
            <template #default="{ field }"><input v-bind="field" v-model.trim="form.email" type="email" autocomplete="email" maxlength="254"></template>
          </FormField>

          <FormField id="message" label="Your message" :error="errors.message">
            <template #default="{ field }"><textarea v-bind="field" v-model.trim="form.message" rows="6" maxlength="4900" /></template>
          </FormField>

          <div class="flex flex-wrap items-center gap-4 border-t border-line pt-6">
            <button type="submit" class="btn btn-accent px-8 text-lg" :disabled="sending">
              <Icon v-if="sending" name="lucide:refresh-cw" class="size-5 animate-spin" aria-hidden="true" />
              {{ sending ? 'Sending…' : 'Send message' }}
            </button>
            <p class="text-sm text-steel">See our <NuxtLink to="/privacy" class="link">privacy notice</NuxtLink>.</p>
          </div>
        </form>
      </div>

      <aside class="space-y-6 lg:col-span-5">
        <div class="night-backdrop rounded-3xl p-7 text-white shadow-[var(--shadow-lift)] sm:p-8">
          <h2 class="text-2xl">Other ways to reach us</h2>
          <dl class="mt-6 space-y-4">
            <div v-if="settings.phone" class="flex gap-3">
              <dt><Icon name="lucide:phone" class="mt-0.5 size-5 text-accent" aria-hidden="true" /><span class="sr-only">Phone</span></dt>
              <dd><a :href="`tel:${settings.phone.replace(/\s/g, '')}`" class="text-lg font-bold hover:underline">{{ settings.phone }}</a></dd>
            </div>
            <div v-if="settings.email" class="flex gap-3">
              <dt><Icon name="lucide:mail" class="mt-0.5 size-5 text-accent" aria-hidden="true" /><span class="sr-only">Email</span></dt>
              <dd><a :href="`mailto:${settings.email}`" class="font-semibold break-all hover:underline">{{ settings.email }}</a></dd>
            </div>
            <div v-if="settings.openingHours" class="flex gap-3">
              <dt><Icon name="lucide:clock" class="mt-0.5 size-5 text-accent" aria-hidden="true" /><span class="sr-only">Opening hours</span></dt>
              <dd class="text-white/80">{{ settings.openingHours }}</dd>
            </div>
            <div v-if="fullAddress" class="flex gap-3">
              <dt><Icon name="lucide:map-pin" class="mt-0.5 size-5 text-accent" aria-hidden="true" /><span class="sr-only">Address</span></dt>
              <dd class="text-white/80">{{ fullAddress }}</dd>
            </div>
          </dl>
        </div>

        <div v-if="settings.mapEmbedUrl" class="card overflow-hidden">
          <iframe
            :src="settings.mapEmbedUrl"
            title="Map showing our office"
            class="h-64 w-full"
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          />
        </div>

        <div class="flex gap-3 rounded-2xl bg-emerald-50 p-5 text-emerald-950">
          <Icon name="lucide:shield-check" class="mt-0.5 size-6 shrink-0 text-emerald-700" aria-hidden="true" />
          <p class="text-sm">
            <span class="font-bold">Stay safe from scams.</span>
            We never ask for payment or card details by text message, or through a link in an email you weren't expecting.
          </p>
        </div>
      </aside>
    </div>
  </div>
</template>

<script setup lang="ts">
const media = useMedia()
useSeoMeta({
  title: 'Contact us',
  description: 'Contact our customer service team about a shipment, a quote or customs.',
})

const settings = useSiteSettings()

const fullAddress = computed(() => {
  const s = settings.value
  return [s.address, [s.postalCode, s.city].filter(Boolean).join(' '), s.country].filter(Boolean).join(', ')
})

const subjects = ['Tracking a shipment', 'Quote or pricing', 'Customs and duties', 'Business account', 'Something else']

// Pre-select the topic and number when coming from a tracking page (/contact?tracking=…)
const route = useRoute()
const form = reactive({
  subject: route.query.tracking ? 'Tracking a shipment' : '',
  trackingNumber: String(route.query.tracking ?? '').toUpperCase().slice(0, 40),
  fullName: '',
  phone: '',
  email: '',
  message: '',
})

const errors = reactive<Record<string, string>>({})
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function validate() {
  for (const key of Object.keys(errors)) delete errors[key]
  if (!form.subject) errors.subject = 'Choose what your message is about.'
  if (!form.fullName) errors.fullName = 'Enter your full name.'
  if (!EMAIL.test(form.email)) errors.email = 'Enter an email address in the format name@example.com.'
  if (form.message.length < 10) errors.message = 'Your message must be at least 10 characters long.'
  return Object.keys(errors).length === 0
}

const { sending, done, formError, submit } = useFormSubmit('/api/messages')

async function send() {
  if (!validate()) {
    nextTick(() => document.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus())
    return
  }
  // The tracking number has no field of its own in the API: it goes at the top of the message
  const message = form.trackingNumber ? `Tracking number: ${form.trackingNumber}\n\n${form.message}` : form.message
  await submit({
    subject: form.subject,
    fullName: form.fullName,
    phone: form.phone || undefined,
    email: form.email,
    message,
  })
  if (done.value) window.scrollTo({ top: 0 })
}
</script>
