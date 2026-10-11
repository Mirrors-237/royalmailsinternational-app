<template>
  <div>
    <PageHeader
      title="Receiving a parcel"
      intro="Everything you need to know when a parcel is on its way to you: tracking, customs and delivery."
      :crumbs="[{ label: 'Receive' }]"
      :image="media.road"
    >
      <TrackForm dark class="mt-9 max-w-xl" />
    </PageHeader>

    <section class="container-site py-24" aria-labelledby="steps-title">
      <div class="grid items-center gap-14 lg:grid-cols-[1fr_1.4fr]">
        <Illustration name="receive" class="mx-auto w-full max-w-md" />
        <div>
          <h2 id="steps-title" class="section-title">Three things to do</h2>
          <p class="section-intro">So your parcel arrives without surprises.</p>
          <ol class="mt-10 space-y-4">
            <li v-for="(step, i) in RECEIVE_STEPS" :key="step.title" class="card flex gap-5 p-6">
              <span class="grid size-11 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-brand to-night text-lg font-extrabold text-white" aria-hidden="true">{{ i + 1 }}</span>
              <div>
                <h3 class="text-lg">{{ step.title }}</h3>
                <p class="mt-1 text-steel">{{ step.text }}</p>
              </div>
            </li>
          </ol>
        </div>
      </div>
    </section>

    <section class="bg-surface py-24" aria-label="Customs and delivery">
      <div class="container-site grid gap-6 lg:grid-cols-2">
        <div id="customs" class="card scroll-mt-24 overflow-hidden">
          <div class="flex h-52 items-end justify-center bg-violet-50 px-10 pt-6">
            <Illustration name="customs" class="h-full w-full max-w-[14rem]" />
          </div>
          <div class="p-8 lg:p-10">
            <h2 class="text-3xl">Customs duties and taxes</h2>
            <div class="mt-4 space-y-4 text-steel">
              <p>When a parcel crosses a customs border, the destination country may charge import duties and taxes such as VAT. The amount depends on what's inside, its value and where it's coming from.</p>
              <p>If duties apply and the sender hasn't paid them, we contact the recipient before delivery to explain the amount and how to pay.</p>
            </div>
            <div class="mt-7 flex gap-3 rounded-2xl bg-emerald-50 p-5 text-emerald-950">
              <Icon name="lucide:shield-check" class="mt-0.5 size-6 shrink-0 text-emerald-700" aria-hidden="true" />
              <p>
                <span class="font-bold">Beware of scams.</span>
                We never ask for payment by text message or through a link in an unexpected email. If in doubt, check your tracking on this website or <NuxtLink to="/contact" class="link">contact us</NuxtLink>.
              </p>
            </div>
          </div>
        </div>

        <div class="card overflow-hidden">
          <div class="flex h-52 items-end justify-center bg-amber-50 px-10 pt-6">
            <Illustration name="courier" class="h-full w-full max-w-[18rem]" />
          </div>
          <div class="p-8 lg:p-10">
            <h2 class="text-3xl">On delivery day</h2>
            <ul class="mt-6 space-y-6">
              <li v-for="item in delivery" :key="item.title" class="flex gap-4">
                <span class="grid size-10 shrink-0 place-items-center rounded-xl bg-brand-wash text-brand">
                  <Icon :name="item.icon" class="size-5" aria-hidden="true" />
                </span>
                <div>
                  <h3 class="text-base">{{ item.title }}</h3>
                  <p class="mt-0.5 text-steel">{{ item.text }}</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </section>

    <section class="container-site py-24" aria-labelledby="receive-faq-title">
      <div class="mx-auto max-w-3xl">
        <h2 id="receive-faq-title" class="section-title text-center">Common questions</h2>
        <FaqList :items="faq.filter((q) => q.topic === 'Receiving' || q.topic === 'Tracking')" class="mt-10" />
      </div>
    </section>

    <CtaBand
      title="Expecting a parcel?"
      text="Enter the tracking number from the sender to see where it is and when it's due."
      :action="{ to: '/track', label: 'Track a parcel' }"
      :secondary="{ to: '/contact', label: 'Contact us' }"
      :image="media.receive"
    />
  </div>
</template>

<script setup lang="ts">
const media = useMedia()
useSeoMeta({
  title: 'Receiving a parcel',
  description: 'Tracking, customs duties and delivery: what to expect when a parcel is on its way to you.',
})

const faq = useFaq()

const delivery = [
  { icon: 'lucide:phone',          title: 'Keep your phone nearby', text: 'Our delivery partner may call to confirm the time or find the address.' },
  { icon: 'lucide:id-card',        title: 'Have ID ready',          text: 'Some shipments, especially valuable ones, need a signature and proof of identity.' },
  { icon: 'lucide:package-search', title: 'Check the parcel',       text: 'If the packaging is damaged, say so to the driver before signing and take a photo.' },
]
</script>
