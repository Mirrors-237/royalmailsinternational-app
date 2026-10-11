<template>
  <aside class="night-backdrop self-start overflow-hidden rounded-3xl text-white shadow-[var(--shadow-lift)]" aria-labelledby="contact-card-title">
    <div class="bg-white/95 px-8 pt-6">
      <Illustration name="support" class="mx-auto h-40" />
    </div>
    <div class="p-7">
      <h2 id="contact-card-title" class="text-2xl">Need help with a shipment?</h2>
      <p class="mt-2 text-white/70">Have your tracking number to hand and we'll be able to help you faster.</p>
      <dl class="mt-6 space-y-3">
        <div v-if="settings.phone" class="flex items-center gap-3">
          <dt class="glass grid size-9 place-items-center rounded-lg"><Icon name="lucide:phone" class="size-4 text-accent" aria-hidden="true" /><span class="sr-only">Phone</span></dt>
          <dd><a :href="`tel:${settings.phone.replace(/\s/g, '')}`" class="text-lg font-bold hover:underline">{{ settings.phone }}</a></dd>
        </div>
        <div v-if="settings.email" class="flex items-center gap-3">
          <dt class="glass grid size-9 place-items-center rounded-lg"><Icon name="lucide:mail" class="size-4 text-accent" aria-hidden="true" /><span class="sr-only">Email</span></dt>
          <dd><a :href="`mailto:${settings.email}`" class="break-all font-semibold hover:underline">{{ settings.email }}</a></dd>
        </div>
        <div v-if="settings.openingHours" class="flex items-center gap-3">
          <dt class="glass grid size-9 place-items-center rounded-lg"><Icon name="lucide:clock" class="size-4 text-accent" aria-hidden="true" /><span class="sr-only">Opening hours</span></dt>
          <dd class="text-white/80">{{ settings.openingHours }}</dd>
        </div>
      </dl>
      <NuxtLink to="/contact" class="btn btn-accent mt-7 w-full">Message customer service</NuxtLink>
    </div>
  </aside>
</template>

<script setup lang="ts">
const settings = useSiteSettings()
</script>
