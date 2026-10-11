<template>
  <section class="night-backdrop relative isolate overflow-hidden text-white" :aria-labelledby="headingId">
    <img :src="(image ?? media.port).src" alt="" class="absolute inset-0 -z-20 size-full object-cover opacity-30" loading="lazy">
    <div class="absolute inset-0 -z-10 bg-gradient-to-b from-night/40 via-night/70 to-night" aria-hidden="true" />

    <div class="container-site py-24 text-center lg:py-28">
      <h2 :id="headingId" class="mx-auto max-w-3xl text-4xl sm:text-5xl">{{ title }}</h2>
      <p class="mx-auto mt-5 max-w-xl text-lg text-white/70">{{ text }}</p>

      <ul v-if="points?.length" class="mt-8 flex flex-wrap justify-center gap-2">
        <li v-for="p in points" :key="p" class="glass inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm text-white/85">
          <Icon name="lucide:check" class="size-4 text-accent" aria-hidden="true" />
          {{ p }}
        </li>
      </ul>

      <div class="mt-10 flex flex-wrap justify-center gap-3">
        <NuxtLink :to="action.to" class="btn btn-accent px-8">
          {{ action.label }}
          <Icon name="lucide:arrow-right" class="size-5" aria-hidden="true" />
        </NuxtLink>
        <NuxtLink v-if="secondary" :to="secondary.to" class="btn btn-glass px-8">
          <Icon name="lucide:headset" class="size-5" aria-hidden="true" />
          {{ secondary.label }}
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const media = useMedia()
defineProps<{
  title: string
  text: string
  action: { to: string; label: string }
  secondary?: { to: string; label: string }
  points?: string[]
  image?: { src: string; alt: string }
}>()

const headingId = useId()
</script>
