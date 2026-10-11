<template>
  <!-- Decorative illustration (unDraw, see assets/illustrations/CREDITS.md); its highlight colour follows the brand -->
  <span class="illustration block" v-html="svg" />
</template>

<script setup lang="ts">
export type IllustrationName = 'send' | 'receive' | 'track' | 'business' | 'customs' | 'support' | 'worldwide' | 'insurance' | 'courier'

const props = defineProps<{ name: IllustrationName }>()

// Our own static files, inlined so the brand colour can be applied with CSS
const files = import.meta.glob<string>('~/assets/illustrations/*.svg', { query: '?raw', import: 'default', eager: true })

const svg = computed(() => Object.entries(files).find(([path]) => path.endsWith(`/${props.name}.svg`))?.[1] ?? '')
</script>
