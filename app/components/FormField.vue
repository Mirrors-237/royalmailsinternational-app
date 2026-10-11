<template>
  <div>
    <label :for="id" class="block font-bold">
      {{ label }}
      <span v-if="optional" class="font-normal text-steel">(optional)</span>
    </label>
    <p v-if="hint" :id="`${id}-hint`" class="mt-0.5 text-sm text-steel">{{ hint }}</p>
    <div class="mt-2">
      <!-- The slot receives the attributes to bind on the input -->
      <slot :field="{ id, 'aria-invalid': !!error || undefined, 'aria-describedby': describedBy, class: inputClass }" />
    </div>
    <p v-if="error" :id="`${id}-error`" class="mt-1.5 flex items-center gap-1.5 text-sm font-semibold text-red-700">
      <Icon name="lucide:circle-alert" class="size-4 shrink-0" aria-hidden="true" />
      {{ error }}
    </p>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ id: string; label: string; hint?: string; error?: string; optional?: boolean }>()

const describedBy = computed(() =>
  [props.hint && `${props.id}-hint`, props.error && `${props.id}-error`].filter(Boolean).join(' ') || undefined,
)

const inputClass = 'field px-3.5 py-2.5'
</script>
