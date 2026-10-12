<template>
  <div>
    <!-- ─── Hero: photo, tracking first, example tracking card ─── -->
    <section class="night-backdrop relative isolate flex min-h-[min(100svh,60rem)] items-center overflow-hidden text-white" aria-labelledby="hero-title">
      <img :src="media.hero.src" alt="" width="2400" height="1600" class="absolute inset-0 -z-20 size-full object-cover object-[60%_50%] opacity-75" fetchpriority="high">
      <div class="absolute inset-0 -z-10 bg-gradient-to-r from-night via-night/80 to-night/20" aria-hidden="true" />
      <div class="absolute inset-x-0 bottom-0 -z-10 h-40 bg-gradient-to-t from-night to-transparent" aria-hidden="true" />

      <div class="container-site grid w-full items-center gap-16 pb-24 pt-32 lg:grid-cols-[1.05fr_1fr] lg:gap-12 lg:pb-28 lg:pt-36 xl:gap-20">
        <div class="animate-rise">
          <p v-if="home.heroBadge" class="inline-flex items-center gap-2.5 rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-sm font-semibold text-emerald-200 backdrop-blur">
            <span class="relative flex size-2">
              <span class="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span class="relative inline-flex size-2 rounded-full bg-emerald-400" />
            </span>
            {{ home.heroBadge }}
          </p>

          <h1 id="hero-title" class="mt-7 text-5xl leading-[1.04] sm:text-6xl xl:text-7xl">
            {{ home.heroTitle }}
            <span v-if="home.heroHighlight" class="bg-gradient-to-r from-accent to-accent-glow bg-clip-text text-transparent">{{ home.heroHighlight }}</span>
          </h1>

          <p v-if="home.heroText" class="mt-6 max-w-lg text-lg text-white/75">{{ home.heroText }}</p>

          <TrackForm dark class="mt-9 max-w-xl" />

          <div class="mt-6 flex flex-wrap gap-3">
            <NuxtLink to="/quote" class="btn btn-light">
              <Icon name="lucide:file-text" class="size-4" aria-hidden="true" />
              Free quote in 24 hours
            </NuxtLink>
            <NuxtLink to="/send" class="btn btn-glass">
              Our services
              <Icon name="lucide:arrow-right" class="size-4" aria-hidden="true" />
            </NuxtLink>
          </div>

          <dl class="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-white/15 pt-8">
            <div v-for="s in stats" :key="s.label" class="flex flex-col-reverse">
              <dt class="mt-0.5 text-xs text-white/60 sm:text-sm">{{ s.label }}</dt>
              <dd class="text-2xl font-extrabold sm:text-3xl">{{ s.value }}</dd>
            </div>
          </dl>
        </div>

        <div class="hidden pb-10 lg:block">
          <HeroTrackingMockup />
        </div>
      </div>
    </section>

    <!-- ─── The right service for you (illustrated) ─── -->
    <section class="relative z-10 -mt-14 lg:-mt-20" aria-labelledby="journeys-title">
      <div class="container-site">
        <h2 id="journeys-title" class="sr-only">What would you like to do?</h2>
        <ul class="grid gap-6 lg:grid-cols-3">
          <li v-for="j in journeys" :key="j.title" class="card flex flex-col overflow-hidden !shadow-[var(--shadow-lift)]">
            <div class="flex h-52 items-end justify-center bg-gradient-to-b from-brand-wash to-white px-10 pt-8">
              <Illustration :name="j.illustration" class="h-full w-full max-w-[16rem]" />
            </div>
            <div class="flex flex-1 flex-col p-7">
              <h3 class="text-2xl">{{ j.title }}</h3>
              <p class="mt-2 text-steel">{{ j.text }}</p>
              <ul class="mt-5 flex-1 space-y-2">
                <li v-for="l in j.links" :key="l.to">
                  <NuxtLink :to="l.to" class="link-arrow group">
                    {{ l.label }}
                    <Icon name="lucide:arrow-right" class="size-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </NuxtLink>
                </li>
              </ul>
              <NuxtLink :to="j.cta.to" class="btn btn-dark mt-7 w-full">
                <Icon :name="j.cta.icon" class="size-5" aria-hidden="true" />
                {{ j.cta.label }}
              </NuxtLink>
            </div>
          </li>
        </ul>
      </div>
    </section>

    <!-- ─── Transport services ─── -->
    <section class="container-site py-24 lg:py-28" aria-labelledby="services-title">
      <div class="flex flex-wrap items-end justify-between gap-6">
        <div class="max-w-2xl">
          <p class="kicker">Our services</p>
          <h2 id="services-title" class="section-title mt-2">Every way to ship, under one roof</h2>
          <p class="section-intro">From collection to final delivery, we handle the whole journey, customs included.</p>
        </div>
        <NuxtLink to="/send" class="btn btn-ghost">
          Compare services
          <Icon name="lucide:arrow-right" class="size-4" aria-hidden="true" />
        </NuxtLink>
      </div>

      <ul class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <li v-for="svc in SHIPPING_SERVICES" :key="svc.id"><ServiceCard :service="svc" /></li>
      </ul>
    </section>

    <!-- ─── Why us: full-width photo with a card over it ─── -->
    <section class="relative isolate overflow-hidden py-16 lg:py-28" aria-labelledby="why-title">
      <img :src="media.port.src" :alt="media.port.alt" width="1600" height="1067" class="absolute inset-0 -z-10 size-full object-cover" loading="lazy">
      <div class="absolute inset-0 -z-10 bg-gradient-to-r from-transparent via-night/20 to-night/70" aria-hidden="true" />
      <div class="container-site flex lg:justify-end">
        <div class="w-full max-w-xl rounded-3xl bg-white p-7 shadow-[var(--shadow-float)] sm:p-10">
          <p class="kicker">Why ship with us</p>
          <h2 id="why-title" class="mt-2 text-3xl lg:text-4xl">One partner from the first mile to the last</h2>
          <ul class="mt-7 space-y-4">
            <li v-for="item in advantages" :key="item.title" class="flex gap-4">
              <span class="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-wash text-brand">
                <Icon :name="item.icon" class="size-5" aria-hidden="true" />
              </span>
              <div>
                <h3 class="text-base">{{ item.title }}</h3>
                <p class="text-sm text-steel">{{ item.text }}</p>
              </div>
            </li>
          </ul>
          <dl class="mt-8 grid grid-cols-3 gap-3 border-t border-line pt-6 text-center">
            <div v-for="k in stats" :key="k.label" class="flex flex-col-reverse">
              <dt class="text-xs text-steel">{{ k.label }}</dt>
              <dd class="text-2xl font-extrabold text-brand">{{ k.value }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>

    <!-- ─── Tracking statuses ─── -->
    <section class="night-backdrop py-24 text-white lg:py-28" aria-labelledby="steps-title">
      <div class="container-site">
        <div class="flex flex-wrap items-end justify-between gap-6">
          <div class="max-w-2xl">
            <p class="kicker !text-accent">Tracking</p>
            <h2 id="steps-title" class="section-title mt-2">Every step, as it happens</h2>
            <p class="mt-4 text-lg text-white/70">Your parcel is scanned at every stage. Here's what each status on your tracking page means.</p>
          </div>
          <NuxtLink to="/track" class="btn btn-brand">
            <Icon name="lucide:search" class="size-5" aria-hidden="true" />
            Track a parcel
          </NuxtLink>
        </div>

        <ol class="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <li v-for="(s, i) in journey" :key="s.label" class="glass relative rounded-2xl p-6">
            <div class="flex items-center justify-between">
              <span class="grid size-11 place-items-center rounded-xl" :class="i === journey.length - 1 ? 'bg-emerald-400/15 text-emerald-300' : 'bg-white/10 text-white'">
                <Icon :name="s.icon" class="size-5" aria-hidden="true" />
              </span>
              <span class="grid size-7 place-items-center rounded-full bg-accent text-xs font-extrabold text-on-accent" aria-hidden="true">{{ i + 1 }}</span>
            </div>
            <h3 class="mt-5 text-lg">{{ s.label }}</h3>
            <p class="mt-1.5 text-sm text-white/65">{{ s.summary }}</p>
          </li>
        </ol>
      </div>
    </section>

    <!-- ─── Help is at hand (illustrated) ─── -->
    <section class="container-site py-24 lg:py-28" aria-labelledby="help-title">
      <div class="max-w-2xl">
        <p class="kicker">Help and advice</p>
        <h2 id="help-title" class="section-title mt-2">Answers before you even ask</h2>
      </div>
      <ul class="mt-12 grid gap-6 md:grid-cols-3">
        <li v-for="h in helpCards" :key="h.title">
          <NuxtLink :to="h.to" class="card card-link group flex h-full flex-col overflow-hidden">
            <div class="flex h-44 items-end justify-center px-10 pt-6" :class="h.tone">
              <Illustration :name="h.illustration" class="h-full w-full max-w-[13rem]" />
            </div>
            <div class="flex flex-1 flex-col p-6">
              <h3 class="flex items-center justify-between gap-2 text-xl">
                {{ h.title }}
                <Icon name="lucide:arrow-right" class="size-5 text-brand transition-transform group-hover:translate-x-1" aria-hidden="true" />
              </h3>
              <p class="mt-2 text-steel">{{ h.text }}</p>
            </div>
          </NuxtLink>
        </li>
      </ul>
    </section>

    <!-- ─── Testimonials and partners ─── -->
    <section v-if="testimonials?.length || partners?.length" class="bg-surface py-24 lg:py-28" aria-labelledby="reviews-title">
      <div class="container-site">
        <template v-if="testimonials?.length">
          <div class="mx-auto max-w-2xl text-center">
            <p class="kicker">Customer reviews</p>
            <h2 id="reviews-title" class="section-title mt-2">What our customers say</h2>
          </div>
          <ul class="mt-14 grid gap-6 md:grid-cols-3">
            <li v-for="t in testimonials.slice(0, 3)" :key="t.id" class="card flex flex-col p-7">
              <div class="flex items-center justify-between">
                <p class="flex gap-0.5 text-amber-400" :aria-label="`Rated ${t.rating} out of 5`">
                  <Icon v-for="n in 5" :key="n" name="lucide:star" class="size-4" :class="n <= t.rating ? 'fill-current' : 'text-line'" aria-hidden="true" />
                </p>
                <Icon name="lucide:quote" class="size-8 text-brand-soft" aria-hidden="true" />
              </div>
              <blockquote class="mt-5 flex-1 text-lg leading-relaxed">{{ t.content }}</blockquote>
              <div class="mt-7 flex items-center gap-3 border-t border-line pt-5">
                <span class="grid size-11 shrink-0 place-items-center rounded-full bg-gradient-to-br from-brand to-night text-sm font-bold text-white" aria-hidden="true">{{ t.avatarInitials || t.name[0] }}</span>
                <span>
                  <span class="block font-bold">{{ t.name }}</span>
                  <span v-if="t.role || t.company" class="block text-sm text-steel">{{ [t.role, t.company].filter(Boolean).join(', ') }}</span>
                </span>
              </div>
            </li>
          </ul>
        </template>

        <div v-if="partners?.length" :class="{ 'mt-20': testimonials?.length }" class="text-center">
          <h2 class="text-sm font-semibold text-steel">Our transport partners</h2>
          <ul class="mt-6 flex flex-wrap items-center justify-center gap-x-12 gap-y-5">
            <li v-for="p in partners" :key="p.id">
              <component :is="p.websiteUrl ? 'a' : 'span'" :href="p.websiteUrl || undefined" rel="noopener" target="_blank" class="block opacity-55 transition-opacity hover:opacity-100">
                <img v-if="p.logoUrl" :src="p.logoUrl" :alt="p.name" class="h-8 w-auto max-w-[9rem] object-contain grayscale" loading="lazy">
                <span v-else class="text-lg font-extrabold tracking-tight text-ink">{{ p.name }}</span>
              </component>
            </li>
          </ul>
        </div>
      </div>
    </section>

    <CtaBand
      title="Your next shipment, delivered on time"
      text="Tell us what you're sending and where. We'll reply with a tailored price within 24 hours."
      :action="{ to: '/quote', label: 'Get a free quote' }"
      :secondary="{ to: '/contact', label: 'Talk to an expert' }"
      :points="['No obligation', 'Reply within 24 hours', 'Insured shipments', '150+ countries']"
      :image="media.sea"
    />
  </div>
</template>

<script setup lang="ts">
const media = useMedia()
interface Partner { id: number; name: string; logoUrl: string; websiteUrl: string }
interface Testimonial { id: number; name: string; role: string; company: string; content: string; rating: number; avatarInitials: string }

// No page title: the template in app.vue then shows the SEO title set in the admin

// The company and the website, for search engines (name, logo, contacts, social profiles)
const settings = useSiteSettings()
const siteUrl = useSiteUrl()
useStructuredData('organization', () => {
  const s = settings.value
  const logo = brandingSrc(s.logoUrl)
  return {
    '@context': 'https://schema.org',
    '@graph': [
      compact({
        '@type': 'Organization',
        '@id': `${siteUrl}/#organization`,
        name: s.siteName,
        url: `${siteUrl}/`,
        logo: logo ? `${siteUrl}${logo}` : undefined,
        description: s.metaDescription || s.description,
        email: s.email,
        telephone: s.phone,
        address: s.address || s.city
          ? compact({ '@type': 'PostalAddress', streetAddress: s.address, postalCode: s.postalCode, addressLocality: s.city, addressCountry: s.country })
          : undefined,
        sameAs: [s.socialFacebook, s.socialLinkedin, s.socialTwitter].filter(Boolean),
      }),
      { '@type': 'WebSite', '@id': `${siteUrl}/#website`, url: `${siteUrl}/`, name: s.siteName, publisher: { '@id': `${siteUrl}/#organization` } },
    ],
  }
})

// Content managed in the admin; the page stays complete if the API doesn't respond
const { data: partners }     = await useFetch<Partner[]>('/api/partners', { default: () => [] })
const { data: testimonials } = await useFetch<Testimonial[]>('/api/testimonials', { default: () => [] })

// Hero texts, key figures and example shipments are edited in the admin (Settings → Home page)
const home = useHomeContent()
const stats = computed(() => home.value.stats)

const journeys = [
  {
    illustration: 'send' as const,
    title: 'Sending a parcel or freight?',
    text: 'Air, sea or road to over 150 countries, with the customs paperwork prepared for you.',
    links: [
      { to: '/send', label: 'Services and timescales' },
      { to: '/send#prepare', label: 'Preparing your shipment' },
      { to: '/send#restricted', label: "Items we can't carry" },
    ],
    cta: { to: '/quote', label: 'Get a quote', icon: 'lucide:file-text' },
  },
  {
    illustration: 'receive' as const,
    title: 'Receiving a parcel?',
    text: 'Follow it step by step, prepare for customs and know what happens on delivery day.',
    links: [
      { to: '/track', label: 'What each status means' },
      { to: '/receive#customs', label: 'Customs duties and taxes' },
      { to: '/receive', label: 'On delivery day' },
    ],
    cta: { to: '/track', label: 'Track a parcel', icon: 'lucide:search' },
  },
  {
    illustration: 'business' as const,
    title: 'Shipping for a business?',
    text: 'Regular shipments, volume-based pricing and one point of contact who knows your flows.',
    links: [
      { to: '/business', label: 'Business solutions' },
      { to: '/send#customs', label: 'Customs clearance' },
      { to: '/contact', label: 'Talk to our team' },
    ],
    cta: { to: '/quote', label: 'Get a tailored quote', icon: 'lucide:briefcase' },
  },
]

const advantages = [
  { icon: 'lucide:radar',        title: 'Tracking at every step', text: 'Every scan shows up on your tracking page, from collection to delivery.' },
  { icon: 'lucide:shield-check', title: 'Insured shipments',      text: 'Cover is available on every consignment, whatever the mode of transport.' },
  { icon: 'lucide:globe',        title: 'A worldwide network',    text: 'Trusted partners in over 150 countries for collection and delivery.' },
  { icon: 'lucide:headset',      title: 'People you can reach',   text: 'A team that answers the phone and knows your shipments.' },
]

// Shipment statuses in journey order
const journey = (['PICKED_UP', 'IN_TRANSIT', 'IN_CUSTOMS', 'OUT_FOR_DELIVERY', 'DELIVERED'] as const).map((k) => SHIPMENT_STATUS[k])

const helpCards = [
  { to: '/receive#customs', illustration: 'customs' as const,   tone: 'bg-violet-50',  title: 'Customs, explained',     text: 'Duties, taxes and documents: what to expect when a parcel crosses a border.' },
  { to: '/help',            illustration: 'worldwide' as const, tone: 'bg-sky-50',     title: 'Where we deliver',       text: 'Over 150 countries, with trusted partners for collection and delivery.' },
  { to: '/contact',         illustration: 'support' as const,   tone: 'bg-amber-50',   title: 'Talk to a real person',  text: 'Our customer service team knows your shipment and answers quickly.' },
]
</script>
