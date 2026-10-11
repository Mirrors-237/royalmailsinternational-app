<template>
  <!-- Two-step button for destructive actions: the first click asks for confirmation -->
  <button
    type="button"
    class="btn min-h-10 px-3.5 text-sm"
    :class="armed ? 'bg-red-700 text-white hover:bg-red-800' : 'btn-ghost !text-red-700'"
    :disabled="busy"
    @click="onClick"
    @blur="armed = false"
  >
    <Icon :name="armed ? 'lucide:triangle-alert' : 'lucide:trash-2'" class="size-4" aria-hidden="true" />
    <span :class="{ 'sr-only': !armed && !label }">{{ armed ? confirmLabel : label || 'Delete' }}</span>
  </button>
</template>

<script setup lang="ts">
withDefaults(defineProps<{ label?: string; confirmLabel?: string; busy?: boolean }>(), {
  label: 'Delete',
  confirmLabel: 'Click again to confirm',
})
const emit = defineEmits<{ confirm: [] }>()
const armed = ref(false)
let timer: ReturnType<typeof setTimeout> | undefined

function onClick() {
  if (!armed.value) {
    armed.value = true
    clearTimeout(timer)
    timer = setTimeout(() => { armed.value = false }, 4000)
    return
  }
  armed.value = false
  emit('confirm')
}
onBeforeUnmount(() => clearTimeout(timer))
</script>
