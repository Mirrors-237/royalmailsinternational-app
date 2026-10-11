<template>
  <ol class="grid grid-cols-5" aria-label="Shipment progress">
    <li
      v-for="(label, i) in JOURNEY_STEPS"
      :key="label"
      class="relative flex flex-col items-center text-center"
      :aria-current="i + 1 === step ? 'step' : undefined"
    >
      <!-- Segment to the next stage -->
      <span
        v-if="i < JOURNEY_STEPS.length - 1"
        class="absolute left-1/2 top-3.5 h-1 w-full rounded-full"
        :class="i + 1 < step ? (dark ? 'bg-accent' : 'bg-brand') : (dark ? 'bg-white/15' : 'bg-line')"
        aria-hidden="true"
      />
      <span
        class="relative grid size-8 place-items-center rounded-full border-2"
        :class="[dotClass(i + 1), { 'ring-4': i + 1 === step }, dark ? 'ring-accent/25' : 'ring-brand/15']"
        aria-hidden="true"
      >
        <Icon v-if="i + 1 < step || (i + 1 === step && !blocked)" name="lucide:check" class="size-4" />
        <Icon v-else-if="i + 1 === step && blocked" name="lucide:triangle-alert" class="size-4" />
      </span>
      <span class="mt-2.5 px-1 text-xs leading-tight sm:text-sm" :class="labelClass(i + 1)">
        {{ label }}
        <span class="sr-only">{{ i + 1 < step ? '(completed)' : i + 1 === step ? (blocked ? '(delayed)' : '(current)') : '(upcoming)' }}</span>
      </span>
    </li>
  </ol>
</template>

<script setup lang="ts">
// step: number of stages reached (0 = none yet, 5 = delivered); blocked: issue at the current stage
const props = defineProps<{ step: number; blocked?: boolean; dark?: boolean }>()

function dotClass(n: number) {
  if (n === props.step && props.blocked) return 'border-red-500 bg-red-600 text-white'
  if (n <= props.step) return props.dark ? 'border-accent bg-accent text-on-accent' : 'border-brand bg-brand text-on-brand'
  return props.dark ? 'border-white/25 bg-transparent' : 'border-line bg-white'
}

function labelClass(n: number) {
  if (props.dark) return n === props.step ? 'font-bold text-white' : n < props.step ? 'font-semibold text-white/80' : 'text-white/45'
  return n === props.step ? 'font-bold text-ink' : n < props.step ? 'font-semibold text-ink' : 'text-steel'
}
</script>
