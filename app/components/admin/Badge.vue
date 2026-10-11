<template>
  <span class="inline-flex items-center whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-bold" :class="tone">
    <slot />
  </span>
</template>

<script setup lang="ts">
defineProps<{ tone: string }>()
</script>
