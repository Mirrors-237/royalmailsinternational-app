<template>
  <div v-if="days.length" class="space-y-8">
    <section v-for="day in days" :key="day.key" :aria-label="day.label">
      <h3 class="text-base font-bold text-steel first-letter:uppercase">{{ day.label }}</h3>
      <ol class="mt-3">
        <li v-for="(cp, i) in day.events" :key="cp.occurredAt + cp.status" class="relative flex gap-4 pb-6 last:pb-0">
          <!-- Vertical line between two events -->
          <span
            v-if="!(day.isLast && i === day.events.length - 1)"
            class="absolute left-[1.1875rem] top-11 bottom-0 w-0.5 bg-line"
            aria-hidden="true"
          />
          <span
            class="relative grid size-10 shrink-0 place-items-center rounded-full"
            :class="iconClass(cp, day.isFirst && i === 0)"
            aria-hidden="true"
          >
            <Icon :name="CHECKPOINT_ICON[cp.status]" class="size-5" />
          </span>
          <div class="min-w-0 flex-1 pt-1.5">
            <p class="flex flex-wrap items-baseline justify-between gap-x-4">
              <span class="font-bold" :class="{ 'text-red-700': isProblem(cp) }">{{ cp.statusLabel }}</span>
              <time :datetime="cp.occurredAt" class="text-sm font-semibold tabular-nums text-steel">{{ formatTime(cp.occurredAt) }}</time>
            </p>
            <p class="mt-0.5 text-steel">
              <template v-if="cp.facility">{{ cp.facility }}<br></template>
              {{ cp.city }}, {{ cp.country }}
            </p>
            <p v-if="day.isFirst && i === 0" class="mt-2 inline-flex items-center gap-1.5 rounded-full bg-brand-wash px-2.5 py-0.5 text-sm font-semibold text-brand"><span class="size-1.5 rounded-full bg-current" aria-hidden="true" />Latest update</p>
          </div>
        </li>
      </ol>
    </section>
  </div>

  <p v-else class="rounded-2xl border border-dashed border-line p-6 text-steel">
    No updates yet. The first one will appear as soon as the parcel is handed over to us.
  </p>
</template>

<script setup lang="ts">
const props = defineProps<{ checkpoints: TrackingCheckpoint[] }>()

const isProblem = (cp: TrackingCheckpoint) => cp.status === 'EXCEPTION' || cp.status === 'RETURNED'

function iconClass(cp: TrackingCheckpoint, latest: boolean) {
  if (isProblem(cp)) return 'bg-red-700 text-white'
  if (latest) return 'bg-brand text-on-brand shadow-lg ring-4 ring-brand/15'
  return 'border-2 border-line bg-white text-steel'
}

// Events from newest to oldest, grouped by day
const days = computed(() => {
  const sorted = [...props.checkpoints].sort((a, b) => b.occurredAt.localeCompare(a.occurredAt))
  const groups = new Map<string, TrackingCheckpoint[]>()
  for (const cp of sorted) {
    const key = dayKey(cp.occurredAt)
    groups.set(key, [...(groups.get(key) ?? []), cp])
  }
  const entries = [...groups.entries()]
  return entries.map(([key, events], i) => ({
    key,
    events,
    label: formatDay(events[0]!.occurredAt),
    isFirst: i === 0,
    isLast: i === entries.length - 1,
  }))
})
</script>
