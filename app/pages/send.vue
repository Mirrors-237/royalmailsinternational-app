<template>
  <div>
    <PageHeader
      title="Send a parcel or freight"
      intro="Air, sea or road, with customs clearance handled for you. Compare our services and get a price within 24 hours."
      :crumbs="[{ label: 'Send' }]"
      :image="media.sea"
    >
      <div class="mt-9 flex flex-wrap gap-3">
        <NuxtLink to="/quote" class="btn btn-accent">
          Get a quote
          <Icon name="lucide:arrow-right" class="size-5" aria-hidden="true" />
        </NuxtLink>
        <a href="#air" class="btn btn-glass">Compare services</a>
      </div>
    </PageHeader>

    <!-- One row per service, photo and text alternating sides -->
    <section
      v-for="(s, i) in SHIPPING_SERVICES"
      :id="s.id"
      :key="s.id"
      class="scroll-mt-20 py-20 lg:py-24"
      :class="{ 'bg-surface': i % 2 }"
      :aria-labelledby="`${s.id}-title`"
    >
      <div class="container-site grid items-center gap-12 lg:grid-cols-2 lg:gap-20">
        <div :class="{ 'lg:order-2': i % 2 }">
          <span class="grid size-12 place-items-center rounded-xl" :class="SERVICE_TONE[s.id]">
            <Icon :name="s.icon" class="size-6" aria-hidden="true" />
          </span>
          <h2 :id="`${s.id}-title`" class="section-title mt-5">{{ s.title }}</h2>
          <p class="section-intro">{{ s.description }}</p>
          <h3 class="mt-8 text-sm font-bold text-steel">Best for</h3>
          <ul class="mt-3 space-y-2.5">
            <li v-for="b in s.bestFor" :key="b" class="flex items-center gap-3 font-medium">
              <span class="grid size-5 shrink-0 place-items-center rounded-full bg-emerald-100 text-emerald-700">
                <Icon name="lucide:check" class="size-3.5" aria-hidden="true" />
              </span>
              {{ b }}
            </li>
          </ul>
          <NuxtLink to="/quote" class="btn btn-dark mt-9">
            Get a quote
            <Icon name="lucide:arrow-right" class="size-4" aria-hidden="true" />
          </NuxtLink>
        </div>

        <div class="group relative min-h-80 overflow-hidden rounded-3xl shadow-[var(--shadow-lift)] lg:min-h-[26rem]">
          <img :src="media[s.id].src" :alt="media[s.id].alt" width="1200" height="800" class="absolute inset-0 size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" loading="lazy">
          <div class="absolute inset-0 bg-gradient-to-t from-night/75 via-transparent to-transparent" aria-hidden="true" />
          <p class="glass absolute bottom-5 left-5 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold text-white">
            <Icon name="lucide:clock" class="size-4 text-accent" aria-hidden="true" />
            {{ s.detail }}
          </p>
        </div>
      </div>
    </section>

    <!-- Prepare -->
    <section id="prepare" class="night-backdrop scroll-mt-20 py-24 text-white" aria-labelledby="prepare-title">
      <div class="container-site grid items-center gap-14 lg:grid-cols-[1fr_1.5fr]">
        <div>
          <div class="rounded-3xl bg-white/95 p-8">
            <Illustration name="send" class="mx-auto h-64 max-w-xs" />
          </div>
        </div>
        <div>
          <h2 id="prepare-title" class="section-title">Preparing your shipment</h2>
          <p class="mt-4 text-lg text-white/70">A few checks before you send it help avoid delays in transit and at customs.</p>
          <ol class="mt-10 space-y-4">
            <li v-for="(tip, i) in PREPARE_TIPS" :key="tip.title" class="glass flex gap-5 rounded-2xl p-6">
              <span class="grid size-10 shrink-0 place-items-center rounded-full bg-accent text-sm font-extrabold text-on-accent" aria-hidden="true">{{ i + 1 }}</span>
              <div>
                <h3 class="flex items-center gap-2 text-lg"><Icon :name="tip.icon" class="size-5 text-accent" aria-hidden="true" />{{ tip.title }}</h3>
                <p class="mt-1.5 text-white/70">{{ tip.text }}</p>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </section>

    <!-- Restricted items -->
    <section id="restricted" class="container-site scroll-mt-20 py-24" aria-labelledby="restricted-title">
      <div class="grid gap-10 lg:grid-cols-[1fr_1.4fr] lg:gap-16">
        <div>
          <h2 id="restricted-title" class="section-title">Items we can't carry</h2>
          <p class="section-intro">
            For safety and legal reasons, some goods are banned or need special handling. If you're unsure, ask us before you send.
          </p>
          <NuxtLink to="/contact" class="link-arrow mt-6">
            Ask about an item
            <Icon name="lucide:arrow-right" class="size-4" aria-hidden="true" />
          </NuxtLink>
        </div>
        <div class="grid gap-5 sm:grid-cols-2">
          <div v-for="list in itemLists" :key="list.title" class="card p-7">
            <h3 class="flex items-center gap-3 text-lg">
              <span class="grid size-10 place-items-center rounded-xl" :class="list.tone">
                <Icon :name="list.icon" class="size-5" aria-hidden="true" />
              </span>
              {{ list.title }}
            </h3>
            <ul class="mt-5 space-y-2.5">
              <li v-for="item in list.items" :key="item" class="flex items-center gap-3 text-steel">
                <span class="size-1.5 shrink-0 rounded-full bg-current" aria-hidden="true" />
                {{ item }}
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <CtaBand
      title="Ready to send?"
      text="Tell us the origin, destination and weight. We'll reply with a price within 24 hours."
      :action="{ to: '/quote', label: 'Get a quote' }"
      :secondary="{ to: '/contact', label: 'Talk to an expert' }"
      :points="['No obligation', 'Customs paperwork included', 'Tracking at every step']"
    />
  </div>
</template>

<script setup lang="ts">
const media = useMedia()
usePageSeo({
  title: 'Send a parcel or freight',
  description: 'Air, sea and road freight with customs clearance. Compare services and get a quote within 24 hours.',
})

const itemLists = [
  { title: 'Not accepted', icon: 'lucide:circle-x',       tone: 'bg-red-50 text-red-700',     items: ['Explosives and weapons', 'Drugs and narcotics', 'Counterfeit goods', 'Cash and bearer bonds'] },
  { title: 'Ask us first', icon: 'lucide:triangle-alert', tone: 'bg-amber-50 text-amber-700', items: ['Lithium batteries', 'Food and perishables', 'Medicines', 'Liquids and aerosols'] },
]
</script>
