<template>
  <!-- Illustration only: an example tracking card cycling through sample shipments -->
  <div class="relative mx-auto w-full max-w-[25rem] select-none" aria-hidden="true">
    <div class="pointer-events-none absolute inset-0 m-auto size-80 rounded-full bg-brand/30 blur-3xl" />

    <div class="animate-float glass relative overflow-hidden rounded-3xl !bg-night/70 shadow-[var(--shadow-float)]">
      <div class="flex items-center justify-between border-b border-white/10 bg-white/[0.04] px-5 py-3">
        <span class="flex items-center gap-2 text-xs font-semibold text-white/65">
          <span class="relative flex size-2">
            <span class="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
            <span class="relative inline-flex size-2 rounded-full bg-emerald-400" />
          </span>
          Live tracking
        </span>
        <span class="flex items-center gap-1.5">
          <span
            v-for="(_, i) in samples"
            :key="i"
            class="h-1.5 rounded-full transition-all duration-500"
            :class="i === current ? 'w-5 bg-accent' : 'w-1.5 bg-white/20'"
          />
        </span>
      </div>

      <div class="relative min-h-[18.5rem] overflow-hidden">
        <Transition
          mode="out-in"
          enter-active-class="transition duration-500 ease-[cubic-bezier(0.22,1,0.36,1)]"
          enter-from-class="translate-y-6 opacity-0"
          leave-active-class="transition duration-300 ease-in"
          leave-to-class="-translate-y-4 opacity-0"
        >
          <div :key="current" class="p-5">
            <div class="flex items-start justify-between gap-3">
              <div>
                <p class="text-[0.6875rem] font-medium text-white/50">Tracking number</p>
                <p class="tracking-code mt-0.5 text-xl text-white">{{ prefix }}-{{ code }}</p>
              </div>
              <span class="mt-0.5 inline-flex shrink-0 items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold" :class="status.tone">
                <Icon :name="status.icon" class="size-3.5" />
                {{ status.label }}
              </span>
            </div>

            <div class="mt-4 flex items-center gap-2">
              <div class="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-center">
                <p class="text-[0.625rem] text-white/45">From</p>
                <p class="mt-0.5 truncate text-xs font-bold text-white">{{ s.from }}</p>
              </div>
              <Icon :name="SAMPLE_MODE[s.mode].icon" class="size-4 shrink-0 text-accent" />
              <div class="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.06] px-3 py-2 text-center">
                <p class="text-[0.625rem] text-white/45">To</p>
                <p class="mt-0.5 truncate text-xs font-bold text-white">{{ s.to }}</p>
              </div>
            </div>

            <div class="mt-4">
              <div class="mb-1.5 flex justify-between text-[0.6875rem]">
                <span class="text-white/50">Progress</span>
                <span class="font-bold text-accent-glow">{{ progress }}%</span>
              </div>
              <div class="h-1.5 overflow-hidden rounded-full bg-white/10">
                <div
                  class="h-full rounded-full transition-[width] duration-[1200ms] ease-out"
                  :class="status.progress === 100 ? 'bg-emerald-400' : 'bg-gradient-to-r from-accent to-accent-glow'"
                  :style="{ width: `${progress}%` }"
                />
              </div>
            </div>

            <ul class="mt-4 space-y-2">
              <li v-for="cp in steps" :key="cp.label" class="flex items-center gap-2.5">
                <span class="size-2 shrink-0 rounded-full" :class="cp.done ? (status.progress === 100 ? 'bg-emerald-400' : 'bg-accent') : 'bg-white/15'" />
                <span class="flex min-w-0 flex-1 justify-between gap-2 text-[0.6875rem]">
                  <span class="truncate" :class="cp.done ? 'text-white/85' : 'text-white/35'">{{ cp.label }}</span>
                  <Icon v-if="cp.done" name="lucide:check" class="size-3 shrink-0 text-white/45" />
                  <span v-else class="shrink-0 text-white/25">Pending</span>
                </span>
              </li>
            </ul>

            <div class="mt-4 flex items-center justify-between border-t border-white/10 pt-3">
              <span class="flex items-center gap-1.5 text-[0.6875rem] text-white/50">
                <Icon name="lucide:clock" class="size-3" />
                {{ status.progress === 100 ? 'Delivered' : 'Expected' }}
              </span>
              <span class="text-sm font-bold" :class="status.progress === 100 ? 'text-emerald-300' : 'text-white'">{{ status.eta }}</span>
            </div>
          </div>
        </Transition>
      </div>
    </div>

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="translate-y-2 opacity-0"
      leave-active-class="transition duration-200 ease-in"
      leave-to-class="translate-y-1 opacity-0"
    >
      <div v-if="toast" class="absolute -bottom-16 right-0 flex w-fit items-center gap-2.5 rounded-2xl border border-white/15 bg-night/95 px-4 py-2.5 shadow-xl">
        <span class="grid size-6 place-items-center rounded-lg bg-accent/20"><Icon name="lucide:bell" class="size-3.5 text-accent" /></span>
        <span class="whitespace-nowrap text-xs font-medium text-white/85">{{ toast }}</span>
      </div>
    </Transition>

    <div v-for="b in badges" :key="b.label" class="absolute flex items-center gap-2.5 rounded-2xl bg-white px-4 py-2.5 shadow-xl" :class="b.position">
      <span class="grid size-8 place-items-center rounded-xl" :class="b.tone"><Icon :name="b.icon" class="size-4" /></span>
      <span>
        <span class="block text-xs font-extrabold text-ink">{{ b.value }}</span>
        <span class="block text-[0.625rem] text-steel">{{ b.label }}</span>
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
// Example shipments come from the home page content (admin → Settings → Home page)
const home = useHomeContent()
const samples = computed(() => home.value.samples)

// The two floating badges repeat the first two key figures
const badges = computed(() => [
  { ...home.value.stats[0]!, icon: 'lucide:globe', tone: 'bg-brand-wash text-brand', position: '-right-4 -top-5 sm:-right-8' },
  { ...home.value.stats[1]!, icon: 'lucide:file-check', tone: 'bg-emerald-50 text-emerald-700', position: '-bottom-12 -left-4 sm:-left-8' },
])

const settings = useSiteSettings()
const prefix = computed(() => settings.value.trackingPrefix?.toUpperCase() || 'TRK')

const current = ref(0)
const s = computed(() => samples.value[current.value % samples.value.length]!)
const status = computed(() => SAMPLE_STATUS[s.value.status])
const steps = computed(() => sampleSteps(s.value))
const progress = ref(SAMPLE_STATUS[samples.value[0]?.status ?? 'IN_TRANSIT'].progress)
const toast = ref('')

// A stable, made-up number for each example (same on the server and in the browser)
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
const code = computed(() => {
  let h = 2166136261
  for (const c of `${s.value.from}>${s.value.to}`) h = Math.imul(h ^ c.charCodeAt(0), 16777619) >>> 0
  const chars = Array.from({ length: 6 }, (_, i) => ALPHABET[(h >>> (i * 5)) % ALPHABET.length])
  return `${chars.slice(0, 3).join('')}-${chars.slice(3).join('')}`
})

let cycle: ReturnType<typeof setInterval> | undefined
let toastTimer: ReturnType<typeof setTimeout> | undefined

function show(i: number) {
  current.value = i
  progress.value = 0
  setTimeout(() => { progress.value = status.value.progress }, 80)
  clearTimeout(toastTimer)
  toast.value = sampleNotice(s.value)
  toastTimer = setTimeout(() => { toast.value = '' }, 2800)
}

onMounted(() => {
  // Still image for people who turn off animations
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  toastTimer = setTimeout(() => show(0), 1200)
  cycle = setInterval(() => show((current.value + 1) % samples.value.length), 4800)
})

onBeforeUnmount(() => {
  clearInterval(cycle)
  clearTimeout(toastTimer)
})
</script>
