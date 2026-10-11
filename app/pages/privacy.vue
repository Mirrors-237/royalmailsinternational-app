<template>
  <div>
    <PageHeader
      title="Privacy notice"
      intro="What personal data we collect through this website, why, and the rights you have over it."
      :crumbs="[{ label: 'Privacy' }]"
    />

    <article class="container-site max-w-3xl space-y-10 py-20 text-lg leading-relaxed">
      <p class="rounded-card bg-amber-50 p-5 text-base text-amber-900">
        This notice is a starting point. Have it reviewed against your actual processing and the law that applies to you
        (for example UK GDPR and the Data Protection Act 2018) before publishing.
      </p>

      <section>
        <h2 class="text-2xl">Who is responsible for your data</h2>
        <p class="mt-3">
          {{ settings.siteName }}<template v-if="fullAddress">, {{ fullAddress }}</template>, is the data controller.
          You can contact us about your data at
          <a v-if="settings.email" :href="`mailto:${settings.email}`" class="link">{{ settings.email }}</a>.
        </p>
      </section>

      <section>
        <h2 class="text-2xl">What we collect and why</h2>
        <ul class="mt-3 list-disc space-y-3 pl-6">
          <li><strong>Quote requests:</strong> your name, company, email, phone number and shipment details, to send you a price and follow up on it.</li>
          <li><strong>Contact messages:</strong> your name, email, phone number and message, to answer your question.</li>
          <li><strong>Tracking:</strong> the tracking number you enter, to show your shipment's progress. Tracking pages show no names or addresses.</li>
          <li><strong>Technical data:</strong> your IP address is used briefly to protect the website against abuse (limiting repeated requests).</li>
        </ul>
      </section>

      <section>
        <h2 class="text-2xl">How long we keep it</h2>
        <p class="mt-3"><ToComplete>retention period for quote requests and contact messages</ToComplete></p>
      </section>

      <section>
        <h2 class="text-2xl">Who we share it with</h2>
        <p class="mt-3">
          We share shipment details only with the carriers and customs agents needed to deliver your shipment.
          <ToComplete>other processors, e.g. email or hosting providers, and any transfers outside your country</ToComplete>
        </p>
      </section>

      <section>
        <h2 class="text-2xl">Cookies</h2>
        <p class="mt-3">
          This website uses no advertising or analytics cookies. A single essential cookie is set when staff sign in to the administration area.
        </p>
      </section>

      <section>
        <h2 class="text-2xl">Your rights</h2>
        <p class="mt-3">
          You can ask to access, correct or delete your data, or object to how we use it, by emailing
          <a v-if="settings.email" :href="`mailto:${settings.email}`" class="link">{{ settings.email }}</a>.
          You also have the right to complain to the data protection authority <ToComplete>name of the authority, e.g. the ICO in the UK</ToComplete>.
        </p>
      </section>
    </article>
  </div>
</template>

<script setup lang="ts">
useSeoMeta({ title: 'Privacy notice' })

const settings = useSiteSettings()
const fullAddress = computed(() => {
  const s = settings.value
  return [s.address, [s.postalCode, s.city].filter(Boolean).join(' '), s.country].filter(Boolean).join(', ')
})
</script>
