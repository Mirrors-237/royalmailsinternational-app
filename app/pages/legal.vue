<template>
  <div>
    <PageHeader title="Legal notice" :crumbs="[{ label: 'Legal notice' }]" />

    <article class="container-site max-w-3xl space-y-10 py-20 text-lg leading-relaxed">
      <section>
        <h2 class="text-2xl">Website publisher</h2>
        <p class="mt-3">
          This website is published by <strong>{{ settings.siteName }}</strong><template v-if="settings.legalForm">, {{ settings.legalForm }}</template><template v-if="settings.registrationNumber">, registered under number {{ settings.registrationNumber }}</template><template v-if="settings.vatNumber">, VAT number {{ settings.vatNumber }}</template>.
        </p>
        <p v-if="fullAddress" class="mt-3">Registered office: {{ fullAddress }}.</p>
        <p v-if="settings.email || settings.phone" class="mt-3">
          Contact:
          <a v-if="settings.email" :href="`mailto:${settings.email}`" class="link">{{ settings.email }}</a>
          <template v-if="settings.email && settings.phone">, </template>
          <template v-if="settings.phone">{{ settings.phone }}</template>
        </p>
        <p v-if="settings.publicationDirector" class="mt-3">Publication director: {{ settings.publicationDirector }}.</p>
      </section>

      <section v-if="settings.hostingProvider">
        <h2 class="text-2xl">Hosting</h2>
        <p class="mt-3 whitespace-pre-line">{{ settings.hostingProvider }}</p>
      </section>

      <section>
        <h2 class="text-2xl">Intellectual property</h2>
        <p class="mt-3">
          The content of this website (text, logos, layout) is the property of {{ settings.siteName }} unless stated otherwise.
          Photographs are used under the Pexels licence. Map data © OpenStreetMap contributors.
        </p>
      </section>

      <section>
        <h2 class="text-2xl">Personal data</h2>
        <p class="mt-3">How we handle your personal data is explained in our <NuxtLink to="/privacy" class="link">privacy notice</NuxtLink>.</p>
      </section>
    </article>
  </div>
</template>

<script setup lang="ts">
usePageSeo({
  title: 'Legal notice',
  description: 'Who publishes and hosts this website, and how its content may be used.',
})

const settings = useSiteSettings()
const fullAddress = computed(() => {
  const s = settings.value
  return [s.address, [s.postalCode, s.city].filter(Boolean).join(' '), s.country].filter(Boolean).join(', ')
})
</script>
