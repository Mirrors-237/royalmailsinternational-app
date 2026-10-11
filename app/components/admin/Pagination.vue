<template>
  <nav v-if="pages > 1" aria-label="Pages" class="flex items-center justify-between gap-4 text-sm">
    <p class="text-steel">{{ from }}–{{ to }} of {{ total }}</p>
    <div class="flex gap-2">
      <button type="button" class="btn btn-ghost min-h-10 px-3" :disabled="page <= 1" @click="$emit('update:page', page - 1)">
        <Icon name="lucide:chevron-left" class="size-4" aria-hidden="true" />
        Previous
      </button>
      <button type="button" class="btn btn-ghost min-h-10 px-3" :disabled="page >= pages" @click="$emit('update:page', page + 1)">
        Next
        <Icon name="lucide:chevron-right" class="size-4" aria-hidden="true" />
      </button>
    </div>
  </nav>
</template>

<script setup lang="ts">
const props = defineProps<{ page: number; limit: number; total: number }>()
defineEmits<{ 'update:page': [number] }>()
const pages = computed(() => Math.ceil(props.total / props.limit))
const from = computed(() => (props.page - 1) * props.limit + 1)
const to = computed(() => Math.min(props.total, props.page * props.limit))
</script>
