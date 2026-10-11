<template>
  <!-- Dark band at the top of inner pages, over a photo; the fixed header sits over it -->
  <section class="night-backdrop relative isolate overflow-hidden text-white">
    <template v-if="image">
      <img :src="image.src" alt="" class="absolute inset-0 -z-20 size-full object-cover opacity-55" fetchpriority="high">
      <div class="absolute inset-0 -z-10 bg-gradient-to-r from-night via-night/85 to-night/25" aria-hidden="true" />
      <div class="absolute inset-x-0 bottom-0 -z-10 h-24 bg-gradient-to-t from-night/60 to-transparent" aria-hidden="true" />
    </template>

    <div class="container-site pb-16 pt-32 lg:pb-24 lg:pt-44">
      <nav aria-label="Breadcrumb" class="text-sm text-white/65">
        <ol class="flex flex-wrap items-center gap-1.5">
          <li><NuxtLink to="/" class="hover:text-white">Home</NuxtLink></li>
          <template v-for="(c, i) in crumbs" :key="c.label">
            <li aria-hidden="true"><Icon name="lucide:chevron-right" class="size-4" /></li>
            <li v-if="c.to && i < crumbs.length - 1"><NuxtLink :to="c.to" class="hover:text-white">{{ c.label }}</NuxtLink></li>
            <li v-else aria-current="page" class="text-white">{{ c.label }}</li>
          </template>
        </ol>
      </nav>
      <h1 class="mt-5 max-w-3xl text-4xl sm:text-5xl lg:text-6xl">{{ title }}</h1>
      <p v-if="intro" class="mt-5 max-w-2xl text-lg text-white/75 sm:text-xl">{{ intro }}</p>
      <slot />
    </div>
  </section>
</template>

<script setup lang="ts">
defineProps<{
  title: string
  intro?: string
  crumbs: { label: string; to?: string }[]
  image?: { src: string; alt: string }
}>()
</script>
