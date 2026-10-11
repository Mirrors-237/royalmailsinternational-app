<template>
  <NuxtLayout>
    <section class="night-backdrop text-white">
      <div class="container-site flex min-h-[80svh] flex-col justify-center pb-24 pt-36">
      <p class="font-semibold text-accent">Error {{ error.statusCode }}</p>
      <h1 class="mt-3 max-w-3xl text-5xl sm:text-6xl">{{ notFound ? 'We can’t find that page' : 'The service isn’t responding' }}</h1>
      <p class="mt-6 max-w-xl text-lg text-white/70">
        {{ notFound
          ? 'The link may be incomplete or the page may have moved. You can track a parcel or go back to the home page.'
          : 'Try again in a few moments. If the problem continues, contact us.' }}
      </p>
      <div class="mt-10 flex flex-wrap gap-3">
        <button type="button" class="btn btn-accent" @click="clearError({ redirect: '/' })">Back to the home page</button>
        <button type="button" class="btn btn-glass" @click="clearError({ redirect: '/track' })">Track a parcel</button>
      </div>
      </div>
    </section>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{ error: NuxtError }>()
const notFound = computed(() => props.error.statusCode === 404)

useHead({ title: () => (notFound.value ? 'Page not found' : 'Error') })
</script>
