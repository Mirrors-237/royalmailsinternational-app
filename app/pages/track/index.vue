<template>
  <div>
    <section class="night-backdrop relative isolate overflow-hidden text-white" aria-labelledby="track-title">
      <img :src="media.road.src" alt="" class="absolute inset-0 -z-20 size-full object-cover opacity-45" fetchpriority="high">
      <div class="absolute inset-0 -z-10 bg-gradient-to-r from-night via-night/85 to-night/30" aria-hidden="true" />
      <div class="container-site grid items-center gap-16 pb-24 pt-32 lg:grid-cols-[1.1fr_1fr] lg:pb-28 lg:pt-40">
        <div class="animate-rise">
          <nav aria-label="Breadcrumb" class="text-sm text-white/65">
            <ol class="flex items-center gap-1.5">
              <li><NuxtLink to="/" class="hover:text-white">Home</NuxtLink></li>
              <li aria-hidden="true"><Icon name="lucide:chevron-right" class="size-4" /></li>
              <li aria-current="page" class="text-white">Track</li>
            </ol>
          </nav>
          <h1 id="track-title" class="mt-5 text-5xl sm:text-6xl">Track a parcel</h1>
          <p class="mt-5 max-w-lg text-lg text-white/75">
            Enter your tracking number to see where your shipment is and when it's due to arrive.
          </p>
          <TrackForm dark class="mt-9 max-w-xl" />
        </div>

        <div class="hidden pb-10 lg:block">
          <HeroTrackingMockup />
        </div>
      </div>
    </section>

    <!-- Where to find the number -->
    <section class="container-site py-24" aria-labelledby="number-title">
      <div class="grid items-center gap-14 lg:grid-cols-[1.4fr_1fr]">
        <div>
          <h2 id="number-title" class="section-title">Where to find your tracking number</h2>
          <p v-if="prefix" class="section-intro">
            Our tracking numbers start with <span class="tracking-code text-ink">{{ prefix }}</span>, followed by letters and numbers.
          </p>
          <ul class="mt-10 space-y-4">
            <li v-for="place in places" :key="place.title" class="card flex gap-5 p-6">
              <span class="grid size-12 shrink-0 place-items-center rounded-xl bg-brand-wash text-brand" aria-hidden="true"><Icon :name="place.icon" class="size-6" /></span>
              <div>
                <h3 class="text-lg">{{ place.title }}</h3>
                <p class="mt-1 text-steel">{{ place.text }}</p>
              </div>
            </li>
          </ul>
        </div>
        <Illustration name="track" class="mx-auto w-full max-w-sm" />
      </div>
    </section>

    <!-- Statuses -->
    <section class="bg-surface py-24" aria-labelledby="statuses-title">
      <div class="container-site grid gap-12 lg:grid-cols-12">
        <div class="lg:col-span-4">
          <h2 id="statuses-title" class="section-title">What each status means</h2>
          <p class="section-intro">Your parcel's status updates every time it passes through our network.</p>
          <NuxtLink to="/help" class="link-arrow mt-6">
            My tracking hasn't updated
            <Icon name="lucide:arrow-right" class="size-4" aria-hidden="true" />
          </NuxtLink>
        </div>
        <dl class="grid gap-4 sm:grid-cols-2 lg:col-span-8">
          <div v-for="s in statuses" :key="s.label" class="card flex gap-4 p-5">
            <span class="grid size-11 shrink-0 place-items-center rounded-xl" :class="s.danger ? 'bg-red-50 text-red-700' : 'bg-brand-wash text-brand'">
              <Icon :name="s.icon" class="size-5" aria-hidden="true" />
            </span>
            <div>
              <dt class="font-bold">{{ s.label }}</dt>
              <dd class="mt-0.5 text-sm text-steel">{{ s.summary }}</dd>
            </div>
          </div>
        </dl>
      </div>
    </section>

    <CtaBand
      title="Don't have a tracking number?"
      text="Contact us with the sender's name and the date it was sent, and we'll find your parcel."
      :action="{ to: '/contact', label: 'Contact customer service' }"
    />
  </div>
</template>

<script setup lang="ts">
const media = useMedia()
const settings = useSiteSettings()
const prefix = computed(() => settings.value.trackingPrefix?.toUpperCase())

usePageSeo({
  title: 'Track a parcel',
  description: () => `Track your ${settings.value.siteName} shipment step by step, from collection to delivery.`,
})

const places = [
  { icon: 'lucide:file-text', title: 'On your receipt',               text: 'The receipt you were given when you dropped off the parcel shows the tracking number.' },
  { icon: 'lucide:mail',      title: 'In your confirmation email',    text: 'We send it as soon as your shipment is registered.' },
  { icon: 'lucide:user',      title: 'From the sender',               text: "Waiting for a parcel? Ask the person who's sending it for the number." },
]

// Statuses in journey order, with the delay status last
const statuses = (['PENDING', 'PICKED_UP', 'IN_TRANSIT', 'IN_CUSTOMS', 'OUT_FOR_DELIVERY', 'DELIVERED', 'EXCEPTION'] as const)
  .map((key) => ({ ...SHIPMENT_STATUS[key], danger: key === 'EXCEPTION' }))
</script>
