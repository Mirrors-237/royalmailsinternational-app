<template>
  <div>
    <section class="night-backdrop relative isolate overflow-hidden text-white">
      <img :src="media.hero.src" alt="" class="absolute inset-0 -z-20 size-full object-cover opacity-25">
      <div class="absolute inset-0 -z-10 bg-gradient-to-b from-night/60 to-night" aria-hidden="true" />
      <div class="container-site pb-14 pt-32 lg:pb-16 lg:pt-36">
        <nav aria-label="Breadcrumb" class="text-sm text-white/65">
          <ol class="flex flex-wrap items-center gap-1.5">
            <li><NuxtLink to="/" class="hover:text-white">Home</NuxtLink></li>
            <li aria-hidden="true"><Icon name="lucide:chevron-right" class="size-4" /></li>
            <li><NuxtLink to="/track" class="hover:text-white">Track</NuxtLink></li>
            <li aria-hidden="true"><Icon name="lucide:chevron-right" class="size-4" /></li>
            <li aria-current="page" class="tracking-code text-white">{{ number }}</li>
          </ol>
        </nav>

        <!-- Shipment found -->
        <template v-if="tracking">
          <div class="mt-6 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p class="text-sm font-semibold text-white/60">Tracking number</p>
              <div class="mt-1 flex items-center gap-2">
                <h1 class="tracking-code text-3xl sm:text-5xl">{{ tracking.trackingNumber }}</h1>
                <button type="button" class="grid size-10 place-items-center rounded-xl text-white/65 hover:bg-white/10 hover:text-white" @click="copyNumber">
                  <Icon :name="copied ? 'lucide:check' : 'lucide:copy'" class="size-5" aria-hidden="true" />
                  <span class="sr-only">{{ copied ? 'Number copied' : 'Copy tracking number' }}</span>
                </button>
                <span class="sr-only" aria-live="polite">{{ copied ? 'Number copied' : '' }}</span>
              </div>
              <ul class="mt-4 flex flex-wrap gap-2 text-sm">
                <li class="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1.5"><Icon :name="mode.icon" class="size-4 text-accent" aria-hidden="true" />{{ mode.label }}</li>
                <li v-if="tracking.weightKg != null" class="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1.5"><Icon name="lucide:weight" class="size-4 text-accent" aria-hidden="true" />{{ tracking.weightKg.toLocaleString(LOCALE) }} kg</li>
                <li class="glass inline-flex items-center gap-1.5 rounded-full px-3 py-1.5"><Icon name="lucide:package" class="size-4 text-accent" aria-hidden="true" />{{ CATEGORY_LABEL[tracking.category] ?? tracking.category }}</li>
              </ul>
            </div>
            <button type="button" class="btn btn-glass" :aria-expanded="searchOpen" aria-controls="another-search" @click="searchOpen = !searchOpen">
              <Icon name="lucide:search" class="size-5" aria-hidden="true" />
              Track another parcel
            </button>
          </div>

          <div v-show="searchOpen" id="another-search" class="mt-6 max-w-xl">
            <TrackForm dark />
          </div>

          <!-- Status -->
          <div class="glass mt-8 rounded-3xl p-6 lg:p-8" :class="{ '!border-red-400/50 !bg-red-500/10': blocked }">
            <div class="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-start">
              <div class="flex gap-4">
                <span class="grid size-14 shrink-0 place-items-center rounded-2xl" :class="blocked ? 'bg-red-500/20 text-red-200' : step === 5 ? 'bg-emerald-400/15 text-emerald-300' : 'bg-accent/15 text-accent'" aria-hidden="true">
                  <Icon :name="status.icon" class="size-7" />
                </span>
                <div>
                  <h2 class="text-2xl sm:text-3xl">{{ status.label }}</h2>
                  <p class="mt-1 text-lg text-white/75">{{ status.summary }}</p>
                  <p v-if="lastEvent" class="mt-3 text-sm text-white/65">
                    <span class="font-semibold text-white/90">Latest update:</span>
                    {{ lastEvent.statusLabel }}, {{ lastEvent.city }}, on {{ formatDate(lastEvent.occurredAt) }} at {{ formatTime(lastEvent.occurredAt) }}
                  </p>
                </div>
              </div>

              <div v-if="deliveryBox" class="rounded-2xl bg-white px-5 py-4 text-ink lg:min-w-64">
                <p class="text-sm font-semibold text-steel">{{ deliveryBox.title }}</p>
                <p class="mt-1 text-xl font-extrabold">{{ deliveryBox.value }}</p>
              </div>
            </div>

            <div class="mt-8 border-t border-white/10 pt-7">
              <TrackingProgress :step="step" :blocked="blocked" dark />
            </div>

            <div v-if="blocked" class="mt-7 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-4 text-ink">
              <p class="font-semibold">Questions about this delay? Our customer service team can help.</p>
              <NuxtLink :to="{ path: '/contact', query: { tracking: tracking.trackingNumber } }" class="btn bg-red-700 text-white hover:bg-red-800">Contact customer service</NuxtLink>
            </div>
          </div>

          <!-- Route -->
          <div class="mt-6 grid items-center gap-3 sm:grid-cols-[1fr_auto_1fr]">
            <div class="glass rounded-2xl px-5 py-3">
              <p class="text-xs text-white/55">From</p>
              <p class="font-bold">{{ tracking.origin.city }} <span class="font-normal text-white/65">{{ tracking.origin.country }}</span></p>
            </div>
            <span class="flex items-center justify-center gap-2 text-accent" :title="mode.label">
              <span class="h-px w-8 bg-current opacity-50" aria-hidden="true" />
              <Icon :name="mode.icon" class="size-5" aria-hidden="true" />
              <span class="sr-only">to</span>
              <span class="h-px w-8 bg-current opacity-50" aria-hidden="true" />
            </span>
            <div class="glass rounded-2xl px-5 py-3 sm:text-right">
              <p class="text-xs text-white/55">To</p>
              <p class="font-bold">{{ tracking.destination.city }} <span class="font-normal text-white/65">{{ tracking.destination.country }}</span></p>
            </div>
          </div>
        </template>

        <!-- Too many searches -->
        <div v-else-if="rateLimited" class="mt-8 max-w-2xl">
          <span class="grid size-14 place-items-center rounded-2xl bg-accent/15 text-accent"><Icon name="lucide:clock" class="size-7" aria-hidden="true" /></span>
          <h1 class="mt-6 text-4xl sm:text-5xl">Too many searches in a short time</h1>
          <p class="mt-4 text-lg text-white/75">Please wait a minute, then try again.</p>
          <button type="button" class="btn btn-accent mt-8" :disabled="pending" @click="refresh()">
            <Icon name="lucide:refresh-cw" class="size-5" aria-hidden="true" />
            Try again
          </button>
        </div>

        <!-- Unknown number -->
        <div v-else-if="notFound" class="mt-8 grid items-center gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div>
            <span class="grid size-14 place-items-center rounded-2xl bg-white/10"><Icon name="lucide:search-x" class="size-7" aria-hidden="true" /></span>
            <h1 class="mt-6 text-4xl sm:text-5xl">We can't find a shipment with this number</h1>
            <p class="mt-4 text-lg text-white/75">
              Check the number <span class="tracking-code text-white">{{ number }}</span> against your receipt or confirmation email.
              A shipment created in the last few hours may not appear yet.
            </p>
            <TrackForm :initial="number" dark class="mt-8" />
            <p class="mt-6 text-white/75">Still nothing? <NuxtLink to="/contact" class="font-semibold text-white underline underline-offset-4">Contact us</NuxtLink> with the sender's name.</p>
          </div>
          <div class="hidden rounded-3xl bg-white/95 p-8 lg:block"><Illustration name="track" class="mx-auto h-64" /></div>
        </div>

        <!-- API unreachable -->
        <div v-else class="mt-8 max-w-2xl">
          <span class="grid size-14 place-items-center rounded-2xl bg-red-500/20 text-red-200"><Icon name="lucide:triangle-alert" class="size-7" aria-hidden="true" /></span>
          <h1 class="mt-6 text-4xl sm:text-5xl">Tracking is temporarily unavailable</h1>
          <p class="mt-4 text-lg text-white/75">We couldn't retrieve this shipment's details. Please try again in a few moments.</p>
          <button type="button" class="btn btn-accent mt-8" :disabled="pending" @click="refresh()">
            <Icon name="lucide:refresh-cw" class="size-5" :class="{ 'animate-spin': pending }" aria-hidden="true" />
            Try again
          </button>
        </div>
      </div>
    </section>

    <section v-if="tracking" class="bg-surface py-14 lg:py-16">
      <div class="container-site grid gap-6 lg:grid-cols-12">
        <div class="card p-6 sm:p-8 lg:col-span-7">
          <div class="flex flex-wrap items-baseline justify-between gap-2">
            <h2 class="text-2xl">Shipment history</h2>
            <p class="text-sm text-steel">Times shown in {{ TIME_ZONE_LABEL }}</p>
          </div>
          <div class="mt-8">
            <TrackingTimeline :checkpoints="tracking.checkpoints" />
          </div>
        </div>

        <aside class="space-y-6 lg:col-span-5">
          <div v-if="tracking.checkpoints.length" class="card overflow-hidden p-2">
            <ClientOnly>
              <TrackingMap :checkpoints="tracking.checkpoints" :label="`Map of the route from ${tracking.origin.city} to ${tracking.destination.city}`" />
              <template #fallback>
                <div class="h-72 w-full animate-pulse rounded-xl bg-surface lg:h-80" />
              </template>
            </ClientOnly>
          </div>

          <div class="card p-6 sm:p-7">
            <h2 class="text-xl">Shipment details</h2>
            <dl class="mt-4 divide-y divide-line">
              <div v-for="row in details" :key="row.label" class="flex items-center justify-between gap-4 py-3">
                <dt class="flex items-center gap-2 text-steel">
                  <Icon :name="row.icon" class="size-4" aria-hidden="true" />
                  {{ row.label }}
                </dt>
                <dd class="text-right font-semibold">{{ row.value }}</dd>
              </div>
            </dl>
          </div>

          <div class="night-backdrop overflow-hidden rounded-3xl text-white">
            <div class="bg-white/95 px-8 pt-5"><Illustration name="support" class="mx-auto h-32" /></div>
            <div class="p-6 sm:p-7">
              <h2 class="text-xl">Need help?</h2>
              <ul class="mt-4 space-y-1">
                <li v-for="h in helpLinks" :key="h.to">
                  <NuxtLink :to="h.to" class="group -mx-3 flex items-center justify-between rounded-xl px-3 py-2.5 text-white/85 hover:bg-white/10 hover:text-white">
                    {{ h.label }}
                    <Icon name="lucide:arrow-right" class="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </NuxtLink>
                </li>
              </ul>
            </div>
          </div>
        </aside>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const media = useMedia()
const route = useRoute()
const number = computed(() => String(route.params.number ?? '').replace(/\s+/g, '').toUpperCase())

const { data: tracking, error, pending, refresh } = await useFetch<PublicTracking>(
  () => `/api/shipments/track/${encodeURIComponent(number.value)}`,
  { key: () => `track-${number.value}` },
)

const notFound    = computed(() => error.value?.statusCode === 404)
const rateLimited = computed(() => error.value?.statusCode === 429)

// Personal page: never indexed
useSeoMeta({
  title: () => `Tracking ${number.value}`,
  robots: 'noindex, nofollow',
})

const status  = computed(() => SHIPMENT_STATUS[tracking.value!.status])
const blocked = computed(() => tracking.value?.status === 'EXCEPTION')
const step    = computed(() => (tracking.value ? journeyStep(tracking.value) : 0))
const mode    = computed(() => TRANSPORT_MODE[tracking.value!.transportMode] ?? TRANSPORT_MODE.MULTI)

const lastEvent = computed(() =>
  [...(tracking.value?.checkpoints ?? [])].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))[0],
)

const deliveryBox = computed(() => {
  const t = tracking.value
  if (!t) return null
  if (t.status === 'DELIVERED') {
    const delivered = t.checkpoints.find((c) => c.status === 'DELIVERED') ?? lastEvent.value
    return delivered ? { title: 'Delivered on', value: formatDay(delivered.occurredAt) } : null
  }
  if (t.estimatedDelivery) return { title: 'Estimated delivery', value: formatDeliveryDay(t.estimatedDelivery) }
  return null
})

const details = computed(() => {
  const t = tracking.value!
  return [
    { label: 'Service',       icon: mode.value.icon,       value: mode.value.label },
    { label: 'Contents type', icon: 'lucide:package',       value: CATEGORY_LABEL[t.category] ?? t.category },
    ...(t.weightKg != null ? [{ label: 'Weight', icon: 'lucide:weight', value: `${t.weightKg.toLocaleString(LOCALE)} kg` }] : []),
    { label: 'Registered on', icon: 'lucide:calendar-days', value: formatDate(t.createdAt) },
  ]
})

const copied = ref(false)
async function copyNumber() {
  try {
    await navigator.clipboard.writeText(tracking.value!.trackingNumber)
    copied.value = true
    setTimeout(() => (copied.value = false), 2000)
  } catch {
    // Clipboard unavailable (insecure context): nothing to do
  }
}

const helpLinks = computed(() => [
  { to: '/help', label: "My tracking hasn't updated" },
  { to: '/receive', label: 'Duties and taxes on delivery' },
  { to: `/contact?tracking=${encodeURIComponent(number.value)}`, label: 'Contact customer service' },
])

const searchOpen = ref(false)
watch(() => route.fullPath, () => { searchOpen.value = false })
</script>
