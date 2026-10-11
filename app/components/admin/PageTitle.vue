<template>
  <div class="flex flex-wrap items-end justify-between gap-4">
    <div>
      <nav v-if="back" class="mb-2 text-sm">
        <NuxtLink :to="back.to" class="inline-flex items-center gap-1 font-semibold text-steel hover:text-brand">
          <Icon name="lucide:arrow-left" class="size-4" aria-hidden="true" />
          {{ back.label }}
        </NuxtLink>
      </nav>
      <h1 class="text-3xl">{{ title }}</h1>
      <p v-if="description" class="mt-1.5 max-w-2xl text-steel">{{ description }}</p>
    </div>
    <div v-if="$slots.default" class="flex flex-wrap gap-2"><slot /></div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string; description?: string; back?: { to: string; label: string } }>()
</script>
