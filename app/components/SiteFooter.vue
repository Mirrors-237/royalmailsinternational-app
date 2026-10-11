<template>
  <footer class="border-t border-white/10 bg-night text-white">
    <div class="container-site grid gap-12 pb-12 pt-16 lg:grid-cols-12 lg:pt-20">
      <div class="lg:col-span-4">
        <BrandMark on-dark />
        <p v-if="settings.description" class="mt-5 max-w-sm text-white/60">{{ settings.description }}</p>

        <ul v-if="socials.length" class="mt-6 flex gap-2">
          <li v-for="s in socials" :key="s.label">
            <a :href="s.href" class="glass grid size-10 place-items-center rounded-xl text-white/80 hover:text-white" rel="noopener" target="_blank">
              <Icon :name="s.icon" class="size-5" aria-hidden="true" />
              <span class="sr-only">{{ s.label }}</span>
            </a>
          </li>
        </ul>
      </div>

      <nav aria-label="Site map" class="grid grid-cols-2 gap-8 sm:grid-cols-4 lg:col-span-8">
        <div v-for="group in FOOTER_NAV" :key="group.title">
          <h2 class="text-sm font-bold text-white">{{ group.title }}</h2>
          <ul class="mt-4 space-y-3 text-sm">
            <li v-for="link in group.links" :key="link.label">
              <NuxtLink :to="link.to" class="text-white/60 transition-colors hover:text-white">{{ link.label }}</NuxtLink>
            </li>
          </ul>
        </div>
      </nav>
    </div>

    <div v-if="hasContact" class="container-site">
      <address class="glass grid gap-5 rounded-2xl p-6 text-sm not-italic sm:grid-cols-2 lg:grid-cols-4">
        <p v-if="fullAddress" class="flex gap-3">
          <Icon name="lucide:map-pin" class="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
          <span class="text-white/80">{{ fullAddress }}</span>
        </p>
        <p v-if="settings.phone" class="flex gap-3">
          <Icon name="lucide:phone" class="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
          <a :href="`tel:${settings.phone.replace(/\s/g, '')}`" class="font-semibold hover:underline">{{ settings.phone }}</a>
        </p>
        <p v-if="settings.email" class="flex gap-3">
          <Icon name="lucide:mail" class="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
          <a :href="`mailto:${settings.email}`" class="break-all font-semibold hover:underline">{{ settings.email }}</a>
        </p>
        <p v-if="settings.openingHours" class="flex gap-3">
          <Icon name="lucide:clock" class="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
          <span class="text-white/80">{{ settings.openingHours }}</span>
        </p>
      </address>
    </div>

    <div class="container-site flex flex-col gap-4 py-8 text-sm text-white/50 sm:flex-row sm:items-center sm:justify-between">
      <p>© {{ year }} {{ settings.siteName }}</p>
      <ul class="flex flex-wrap gap-x-6 gap-y-2">
        <li v-for="link in LEGAL_NAV" :key="link.to">
          <NuxtLink :to="link.to" class="hover:text-white">{{ link.label }}</NuxtLink>
        </li>
      </ul>
    </div>
  </footer>
</template>

<script setup lang="ts">
const settings = useSiteSettings()
const year = new Date().getFullYear()

const fullAddress = computed(() => {
  const s = settings.value
  return [s.address, [s.postalCode, s.city].filter(Boolean).join(' '), s.country].filter(Boolean).join(', ')
})

const hasContact = computed(() => !!(fullAddress.value || settings.value.phone || settings.value.email))

const socials = computed(() => [
  { href: settings.value.socialFacebook, icon: 'lucide:facebook', label: 'Facebook' },
  { href: settings.value.socialLinkedin, icon: 'lucide:linkedin', label: 'LinkedIn' },
  { href: settings.value.socialTwitter,  icon: 'lucide:twitter',  label: 'X (Twitter)' },
].filter((s) => s.href))
</script>
