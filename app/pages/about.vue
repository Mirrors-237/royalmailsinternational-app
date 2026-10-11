<template>
  <div>
    <PageHeader
      :title="`About ${settings.siteName}`"
      :intro="settings.description || undefined"
      :crumbs="[{ label: 'About us' }]"
      :image="media.sorting"
    />

    <section class="container-site py-24" aria-labelledby="values-title">
      <div class="grid items-center gap-14 lg:grid-cols-[1fr_1.5fr]">
        <Illustration name="worldwide" class="mx-auto w-full max-w-md" />
        <div>
      <h2 id="values-title" class="section-title">How we work</h2>
      <ul class="mt-10 space-y-4">
        <li v-for="v in values" :key="v.title" class="card flex gap-5 p-6">
          <span class="grid size-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand to-night text-white" aria-hidden="true"><Icon :name="v.icon" class="size-6" /></span>
          <div>
            <h3 class="text-xl">{{ v.title }}</h3>
            <p class="mt-1 text-steel">{{ v.text }}</p>
          </div>
        </li>
      </ul>
        </div>
      </div>
    </section>

    <section id="find-us" class="scroll-mt-24 bg-surface py-24" aria-labelledby="where-title">
      <div class="container-site grid items-center gap-10 lg:grid-cols-2">
      <div>
        <h2 id="where-title" class="section-title">Where to find us</h2>
        <address v-if="fullAddress" class="mt-5 text-lg not-italic">{{ fullAddress }}</address>
        <p v-if="settings.openingHours" class="mt-2 text-steel">{{ settings.openingHours }}</p>
        <NuxtLink to="/contact" class="btn btn-dark mt-8">Contact us</NuxtLink>
      </div>
      <div v-if="settings.mapEmbedUrl" class="card overflow-hidden p-2">
        <iframe :src="settings.mapEmbedUrl" title="Map showing our office" class="h-80 w-full rounded-xl" loading="lazy" referrerpolicy="no-referrer-when-downgrade" />
      </div>
      <div v-else class="relative min-h-80 overflow-hidden rounded-3xl shadow-[var(--shadow-lift)]">
        <img :src="media.port.src" :alt="media.port.alt" class="absolute inset-0 size-full object-cover" loading="lazy">
      </div>
      </div>
    </section>

    <CtaBand
      title="Ship with us"
      text="Tell us what you need to send. We'll reply with a price within 24 hours."
      :action="{ to: '/quote', label: 'Get a quote' }"
    />
  </div>
</template>

<script setup lang="ts">
const media = useMedia()
const settings = useSiteSettings()

useSeoMeta({
  title: 'About us',
  description: () => settings.value.description,
})

const fullAddress = computed(() => {
  const s = settings.value
  return [s.address, [s.postalCode, s.city].filter(Boolean).join(' '), s.country].filter(Boolean).join(', ')
})

const values = [
  { icon: 'lucide:eye',          title: 'Transparency', text: 'Clear prices, and tracking you can check at any time.' },
  { icon: 'lucide:handshake',    title: 'Reliability',  text: 'Trusted partners at every stage of the journey.' },
  { icon: 'lucide:headset',      title: 'Availability', text: 'A team that answers and knows your shipments.' },
]
</script>
