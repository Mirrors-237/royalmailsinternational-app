<template>
  <!-- One point per event added in the admin, in order: no step is shown before it has happened -->
  <!-- Long journeys scroll sideways; row-reverse makes the scroll start on the latest step -->
  <div
    v-if="steps.length"
    class="-mx-1 flex flex-row-reverse overflow-x-auto rounded-xl px-1 pb-2 focus-visible:outline-2"
    :class="dark ? 'focus-visible:outline-white/40' : 'focus-visible:outline-brand'"
    role="region"
    aria-label="Shipment progress"
    tabindex="0"
  >
    <div class="flex w-max min-w-full shrink-0">
      <ol class="flex">
        <li
          v-for="(cp, i) in steps"
          :key="`${cp.occurredAt}-${i}`"
          class="relative flex w-32 shrink-0 flex-col items-center text-center sm:w-36"
          :aria-current="i === lastIndex ? 'step' : undefined"
        >
          <!-- Line to the next step -->
          <span v-if="i < lastIndex" class="absolute left-1/2 top-4 h-1 w-full rounded-full" :class="tone.line" aria-hidden="true" />
          <!-- Still on its way: the line goes on, without naming the next step -->
          <span v-else-if="ongoing" class="absolute left-1/2 top-[1.0625rem] w-1/2 border-t-2 border-dashed" :class="tone.dash" aria-hidden="true" />

          <span class="relative grid size-9 place-items-center rounded-full" :class="dotClass(cp, i === lastIndex)" aria-hidden="true">
            <Icon :name="CHECKPOINT_ICON[cp.status]" class="size-4" />
          </span>
          <span class="mt-2.5 px-2 text-sm leading-tight wrap-anywhere" :class="labelClass(cp, i === lastIndex)">{{ checkpointName(cp) }}</span>
          <span class="mt-1 px-2 text-xs leading-snug" :class="tone.muted">
            {{ cp.city }}<br>
            <time :datetime="cp.occurredAt" class="tabular-nums">{{ formatShortDay(cp.occurredAt) }}, {{ formatTime(cp.occurredAt) }}</time>
          </span>
        </li>
      </ol>
      <span v-if="ongoing" class="relative min-w-10 flex-1" aria-hidden="true">
        <span class="absolute inset-x-0 top-[1.0625rem] border-t-2 border-dashed [mask-image:linear-gradient(to_right,black,transparent)]" :class="tone.dash" />
      </span>
    </div>
  </div>

  <p v-else class="flex items-center gap-3 text-sm" :class="tone.muted">
    <Icon name="lucide:hourglass" class="size-5 shrink-0" aria-hidden="true" />
    The first step will appear here as soon as the parcel is handed over to us.
  </p>
</template>

<script setup lang="ts">
const props = defineProps<{ checkpoints: TrackingCheckpoint[]; dark?: boolean }>()

const steps     = computed(() => [...props.checkpoints].sort((a, b) => a.occurredAt.localeCompare(b.occurredAt)))
const lastIndex = computed(() => steps.value.length - 1)
const isProblem = (cp: TrackingCheckpoint) => cp.status === 'EXCEPTION' || cp.status === 'RETURNED'
// The journey goes on unless the latest event ends it
const ongoing   = computed(() => !['DELIVERED', 'RETURNED'].includes(steps.value[lastIndex.value]?.status ?? ''))

const tone = computed(() => props.dark
  ? { line: 'bg-accent', dash: 'border-white/30', dot: 'bg-accent text-on-accent', ring: 'ring-4 ring-accent/25', current: 'font-bold text-white', past: 'font-semibold text-white/80', muted: 'text-white/60', problem: 'font-bold text-red-300' }
  : { line: 'bg-brand', dash: 'border-steel/40', dot: 'bg-brand text-on-brand', ring: 'ring-4 ring-brand/15', current: 'font-bold text-ink', past: 'font-semibold text-ink', muted: 'text-steel', problem: 'font-bold text-red-700' })

function dotClass(cp: TrackingCheckpoint, latest: boolean) {
  if (isProblem(cp)) return ['bg-red-600 text-white', latest && 'ring-4 ring-red-500/25']
  if (cp.status === 'DELIVERED') return ['bg-emerald-500 text-white', latest && 'ring-4 ring-emerald-400/25']
  return [tone.value.dot, latest && tone.value.ring]
}

function labelClass(cp: TrackingCheckpoint, latest: boolean) {
  if (isProblem(cp)) return tone.value.problem
  return latest ? tone.value.current : tone.value.past
}
</script>
