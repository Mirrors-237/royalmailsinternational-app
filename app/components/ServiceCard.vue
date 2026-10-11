<template>
  <NuxtLink :to="`/send#${service.id}`" class="card card-link group flex h-full flex-col overflow-hidden">
    <div class="relative h-44 overflow-hidden">
      <img :src="media[service.id].src" :alt="media[service.id].alt" width="1200" height="800" class="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-105" loading="lazy">
      <span class="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white to-transparent" aria-hidden="true" />
    </div>
    <div class="flex flex-1 flex-col px-6 pb-6">
      <span class="relative -mt-6 grid size-12 place-items-center rounded-xl shadow-[var(--shadow-card)]" :class="SERVICE_TONE[service.id]">
        <Icon :name="service.icon" class="size-6" aria-hidden="true" />
      </span>
      <h3 class="mt-4 text-xl">{{ service.title }}</h3>
      <p class="mt-2 flex-1 text-steel">{{ service.summary }}</p>
      <span class="mt-5 inline-flex items-center gap-1.5 text-sm font-bold text-ink group-hover:text-brand">
        Learn more
        <Icon name="lucide:arrow-right" class="size-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
      </span>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
const media = useMedia()
defineProps<{ service: ShippingService }>()
</script>
