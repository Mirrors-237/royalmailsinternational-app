<template>
  <div class="card flex flex-col items-center px-6 py-14 text-center">
    <Icon :name="icon" class="size-10 text-brand-soft" aria-hidden="true" />
    <p class="mt-4 text-lg font-bold">{{ title }}</p>
    <p v-if="text" class="mt-1 max-w-md text-steel">{{ text }}</p>
    <div v-if="$slots.default" class="mt-6"><slot /></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ icon: string; title: string; text?: string }>()
</script>
