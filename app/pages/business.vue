<template>
  <div>
    <PageHeader
      title="Shipping for businesses"
      intro="From your first parcel to regular freight, we build a solution around your volumes, routes and deadlines."
      :crumbs="[{ label: 'Business' }]"
      :image="media.sorting"
    >
      <div class="mt-9 flex flex-wrap gap-3">
        <NuxtLink to="/quote" class="btn btn-accent">
          Get a tailored quote
          <Icon name="lucide:arrow-right" class="size-5" aria-hidden="true" />
        </NuxtLink>
        <NuxtLink to="/contact" class="btn btn-glass">
          <Icon name="lucide:headset" class="size-5" aria-hidden="true" />
          Talk to our team
        </NuxtLink>
      </div>
    </PageHeader>

    <section class="container-site py-24" aria-labelledby="benefits-title">
      <div class="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
        <div>
          <h2 id="benefits-title" class="section-title">Why businesses ship with us</h2>
          <p class="section-intro">A single partner for every mode of transport, with pricing built around your activity.</p>
          <ul class="mt-10 grid gap-5 sm:grid-cols-2">
            <li v-for="b in benefits" :key="b.title" class="card p-6">
              <span class="grid size-11 place-items-center rounded-xl bg-brand-wash text-brand" aria-hidden="true"><Icon :name="b.icon" class="size-5" /></span>
              <h3 class="mt-4 text-lg">{{ b.title }}</h3>
              <p class="mt-1.5 text-steel">{{ b.text }}</p>
            </li>
          </ul>
        </div>
        <div class="rounded-3xl bg-gradient-to-b from-brand-wash to-white p-8 lg:p-12">
          <Illustration name="business" class="mx-auto w-full max-w-lg" />
          <div class="card mt-8 flex items-center gap-4 p-5">
            <span class="grid size-12 shrink-0 place-items-center rounded-xl bg-accent text-on-accent"><Icon name="lucide:file-check" class="size-6" aria-hidden="true" /></span>
            <p><span class="block font-bold">A tailored offer within 24 hours</span><span class="text-sm text-steel">Based on your routes, volumes and deadlines.</span></p>
          </div>
        </div>
      </div>
    </section>

    <section class="night-backdrop py-24 text-white" aria-labelledby="how-title">
      <div class="container-site">
        <div class="mx-auto max-w-2xl text-center">
          <h2 id="how-title" class="section-title">How it works</h2>
          <p class="mt-4 text-lg text-white/70">Getting started takes one conversation.</p>
        </div>
        <ol class="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <li v-for="(s, i) in steps" :key="s.title" class="glass rounded-2xl p-7">
            <div class="flex items-center justify-between">
              <span class="grid size-12 place-items-center rounded-xl bg-white/10"><Icon :name="s.icon" class="size-6" aria-hidden="true" /></span>
              <span class="grid size-7 place-items-center rounded-full bg-accent text-xs font-extrabold text-on-accent" aria-hidden="true">{{ i + 1 }}</span>
            </div>
            <h3 class="mt-5 text-lg">{{ s.title }}</h3>
            <p class="mt-2 text-white/70">{{ s.text }}</p>
          </li>
        </ol>
      </div>
    </section>

    <section class="container-site py-24" aria-labelledby="business-services-title">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <h2 id="business-services-title" class="section-title">Services for every flow</h2>
        <NuxtLink to="/send" class="btn btn-ghost">
          See all shipping services
          <Icon name="lucide:arrow-right" class="size-4" aria-hidden="true" />
        </NuxtLink>
      </div>
      <ul class="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <li v-for="s in SHIPPING_SERVICES" :key="s.id"><ServiceCard :service="s" /></li>
      </ul>
    </section>

    <CtaBand
      title="Let's talk about your shipments"
      text="Describe your routes and volumes. We'll come back with a tailored offer within 24 hours."
      :action="{ to: '/quote', label: 'Get a tailored quote' }"
      :secondary="{ to: '/contact', label: 'Talk to our team' }"
      :points="['No obligation', 'Volume-based pricing', 'One point of contact']"
      :image="media.business"
    />
  </div>
</template>

<script setup lang="ts">
const media = useMedia()
useSeoMeta({
  title: 'Shipping for businesses',
  description: 'Tailored air, sea and road freight for businesses, with customs clearance and consolidated tracking.',
})

const benefits = [
  { icon: 'lucide:file-text',    title: 'Tailored pricing',     text: 'Rates based on your volumes and regular routes.' },
  { icon: 'lucide:headset',      title: 'One point of contact', text: 'A named contact who knows your shipments.' },
  { icon: 'lucide:landmark',     title: 'Customs handled',      text: 'Declarations and duties prepared for you.' },
  { icon: 'lucide:shield-check', title: 'Insured shipments',    text: 'Cover available on every consignment.' },
]

const steps = [
  { icon: 'lucide:message-square-text', title: 'Tell us about your flows', text: 'Routes, volumes, frequency and any special requirements.' },
  { icon: 'lucide:file-check',          title: 'Receive a tailored offer', text: 'A clear price and service plan, usually within 24 hours.' },
  { icon: 'lucide:package-check',       title: 'Start shipping',           text: 'We arrange collection and keep you updated at every step.' },
  { icon: 'lucide:chart-line',          title: 'Review together',          text: 'We review performance with you and adjust as your business grows.' },
]
</script>
