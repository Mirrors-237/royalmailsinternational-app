<template>
  <NuxtLink
    :to="to"
    class="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[0.9375rem] font-semibold text-white/75 transition-colors hover:bg-white/10 hover:text-white"
    :class="{ '!bg-white/15 !text-white': active }"
    :aria-current="active ? 'page' : undefined"
  >
    <Icon :name="icon" class="size-5 shrink-0" aria-hidden="true" />
    <span class="flex-1">{{ label }}</span>
    <span v-if="count" class="grid min-w-6 place-items-center rounded-full bg-accent px-1.5 text-xs font-bold text-on-accent">
      {{ count }}<span class="sr-only"> to handle</span>
    </span>
  </NuxtLink>
</template>

<script setup lang="ts">
const props = defineProps<{ to: string; icon: string; label: string; count?: number; exact?: boolean }>()
const route = useRoute()
const active = computed(() => (props.exact ? route.path === props.to : route.path.startsWith(props.to)))
</script>
