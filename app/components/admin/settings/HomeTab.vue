<template>
  <form class="space-y-6" novalidate @submit.prevent="submit">
    <p v-if="error" class="rounded-xl bg-red-50 p-3.5 text-sm font-semibold text-red-800" role="alert">{{ error }}</p>

    <!-- Hero texts -->
    <section class="card p-6" aria-labelledby="hero-texts">
      <h2 id="hero-texts" class="text-xl">Top of the home page</h2>
      <div class="mt-5 grid gap-6 xl:grid-cols-[1fr_1fr]">
        <div class="space-y-5">
          <FormField id="heroBadge" label="Small label above the title" hint="Leave empty to hide it." optional>
            <template #default="{ field }"><input v-bind="field" v-model="form.heroBadge" maxlength="80"></template>
          </FormField>
          <FormField id="heroTitle" label="Title">
            <template #default="{ field }"><input v-bind="field" v-model="form.heroTitle" maxlength="80"></template>
          </FormField>
          <FormField id="heroHighlight" label="End of the title, in the accent colour" optional>
            <template #default="{ field }"><input v-bind="field" v-model="form.heroHighlight" maxlength="60"></template>
          </FormField>
          <FormField id="heroText" label="Introduction" optional>
            <template #default="{ field }"><textarea v-bind="field" v-model="form.heroText" rows="3" maxlength="300" /></template>
          </FormField>
        </div>

        <div class="night-backdrop self-start rounded-2xl p-6 text-white" aria-label="Preview">
          <p v-if="form.heroBadge" class="inline-flex rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-200">{{ form.heroBadge }}</p>
          <p class="mt-4 text-3xl font-extrabold leading-tight tracking-tight">
            {{ form.heroTitle || 'Title' }}
            <span class="bg-gradient-to-r from-accent to-accent-glow bg-clip-text text-transparent">{{ form.heroHighlight }}</span>
          </p>
          <p v-if="form.heroText" class="mt-3 text-sm text-white/70">{{ form.heroText }}</p>
          <dl class="mt-6 grid grid-cols-3 gap-3 border-t border-white/15 pt-4">
            <div v-for="(s, i) in form.stats" :key="i" class="flex flex-col-reverse">
              <dt class="text-xs text-white/60">{{ s.label }}</dt>
              <dd class="text-xl font-extrabold">{{ s.value }}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>

    <!-- Key figures -->
    <section class="card p-6" aria-labelledby="key-figures">
      <h2 id="key-figures" class="text-xl">Key figures</h2>
      <p class="mt-1 text-steel">Shown under the title and in the "Why ship with us" section. The first two also appear in the floating badges. Only use figures you can back up.</p>
      <div class="mt-5 grid gap-4 md:grid-cols-3">
        <fieldset v-for="(s, i) in form.stats" :key="i" class="rounded-xl bg-surface p-4">
          <legend class="sr-only">Figure {{ i + 1 }}</legend>
          <div class="grid grid-cols-[6rem_1fr] gap-3">
            <FormField :id="`stat-v-${i}`" label="Figure">
              <template #default="{ field }"><input v-bind="field" v-model="s.value" maxlength="12"></template>
            </FormField>
            <FormField :id="`stat-l-${i}`" label="Label">
              <template #default="{ field }"><input v-bind="field" v-model="s.label" maxlength="40"></template>
            </FormField>
          </div>
        </fieldset>
      </div>
    </section>

    <!-- Example shipments -->
    <section class="card p-6" aria-labelledby="examples">
      <div class="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h2 id="examples" class="text-xl">Example shipments in the tracking card</h2>
          <p class="mt-1 max-w-2xl text-steel">The animated card at the top of the home page shows these routes one after the other. They are examples, not real shipments: pick the routes you actually serve.</p>
        </div>
        <button type="button" class="btn btn-ghost min-h-10 px-4 text-sm" :disabled="form.samples.length >= 6" @click="addSample">
          <Icon name="lucide:plus" class="size-4" aria-hidden="true" />
          Add a route
        </button>
      </div>

      <ol class="mt-5 space-y-3">
        <li v-for="(s, i) in form.samples" :key="s.key" class="rounded-xl border border-line p-4">
          <div class="grid gap-3 md:grid-cols-[1fr_1fr_1fr_8rem_9rem_auto] md:items-end">
            <FormField :id="`s-from-${s.key}`" label="From">
              <template #default="{ field }"><input v-bind="field" v-model="s.from" maxlength="60" placeholder="e.g. Paris, France"></template>
            </FormField>
            <FormField :id="`s-via-${s.key}`" label="Through" optional>
              <template #default="{ field }"><input v-bind="field" v-model="s.via" maxlength="60" placeholder="e.g. Casablanca"></template>
            </FormField>
            <FormField :id="`s-to-${s.key}`" label="To">
              <template #default="{ field }"><input v-bind="field" v-model="s.to" maxlength="60" placeholder="e.g. Dakar, Senegal"></template>
            </FormField>
            <FormField :id="`s-mode-${s.key}`" label="Mode">
              <template #default="{ field }">
                <select v-bind="field" v-model="s.mode">
                  <option v-for="(m, key) in SAMPLE_MODE" :key="key" :value="key">{{ m.label }}</option>
                </select>
              </template>
            </FormField>
            <FormField :id="`s-status-${s.key}`" label="Status shown">
              <template #default="{ field }">
                <select v-bind="field" v-model="s.status">
                  <option v-for="(st, key) in SAMPLE_STATUS" :key="key" :value="key">{{ st.label }}</option>
                </select>
              </template>
            </FormField>
            <div class="flex gap-1 md:pb-1">
              <button type="button" class="grid size-10 place-items-center rounded-lg text-steel hover:bg-surface disabled:opacity-40" :disabled="i === 0" @click="moveSample(i, -1)">
                <Icon name="lucide:arrow-up" class="size-4" aria-hidden="true" /><span class="sr-only">Move up</span>
              </button>
              <button type="button" class="grid size-10 place-items-center rounded-lg text-steel hover:bg-surface disabled:opacity-40" :disabled="i === form.samples.length - 1" @click="moveSample(i, 1)">
                <Icon name="lucide:arrow-down" class="size-4" aria-hidden="true" /><span class="sr-only">Move down</span>
              </button>
              <button type="button" class="grid size-10 place-items-center rounded-lg text-red-700 hover:bg-red-50 disabled:opacity-40" :disabled="form.samples.length <= 1" @click="form.samples.splice(i, 1)">
                <Icon name="lucide:trash-2" class="size-4" aria-hidden="true" /><span class="sr-only">Remove this route</span>
              </button>
            </div>
          </div>
          <p class="mt-3 text-xs text-steel">
            Card: {{ sampleSteps(s).map((st) => (st.done ? '✓ ' : '○ ') + st.label).join('  ·  ') }}
          </p>
        </li>
      </ol>
    </section>

    <div class="flex flex-wrap items-center gap-3">
      <button type="submit" class="btn btn-brand" :disabled="busy">Save the home page</button>
      <AdminConfirmButton v-if="settings.homeContent" label="Restore the original texts" confirm-label="Click again to restore" :busy="busy" @confirm="reset" />
    </div>
  </form>
</template>

<script setup lang="ts">
const props = defineProps<{ settings: SiteSettings }>()
const emit = defineEmits<{ saved: [SiteSettings] }>()
const { busy, error, save } = useSettingsSave((s) => { emit('saved', s); load(s) })

let nextKey = 0
type EditableSample = HomeSample & { key: number }

const form = reactive<{ heroBadge: string; heroTitle: string; heroHighlight: string; heroText: string; stats: { value: string; label: string }[]; samples: EditableSample[] }>({
  heroBadge: '', heroTitle: '', heroHighlight: '', heroText: '', stats: [], samples: [],
})

function load(s: SiteSettings) {
  const c = { ...HOME_DEFAULTS, ...(s.homeContent ?? {}) }
  Object.assign(form, {
    heroBadge: c.heroBadge, heroTitle: c.heroTitle, heroHighlight: c.heroHighlight, heroText: c.heroText,
    stats: c.stats.map((x) => ({ ...x })),
    samples: c.samples.map((x) => ({ ...x, via: x.via ?? '', key: nextKey++ })),
  })
}
load(props.settings)

function addSample() {
  form.samples.push({ from: '', via: '', to: '', mode: 'AIR', status: 'IN_TRANSIT', key: nextKey++ })
  nextTick(() => document.getElementById(`s-from-${form.samples.at(-1)!.key}`)?.focus())
}

function moveSample(i: number, step: number) {
  const [item] = form.samples.splice(i, 1)
  form.samples.splice(i + step, 0, item!)
}

function submit() {
  if (!form.heroTitle.trim()) { error.value = 'The title cannot be empty.'; return }
  if (form.stats.some((s) => !s.value.trim() || !s.label.trim())) { error.value = 'Fill in all three key figures.'; return }
  if (form.samples.some((s) => !s.from.trim() || !s.to.trim())) { error.value = 'Each example route needs a "From" and a "To".'; return }
  save({
    homeContent: {
      heroBadge: form.heroBadge.trim(),
      heroTitle: form.heroTitle.trim(),
      heroHighlight: form.heroHighlight.trim(),
      heroText: form.heroText.trim(),
      stats: form.stats.map((s) => ({ value: s.value.trim(), label: s.label.trim() })),
      samples: form.samples.map(({ key: _key, ...s }) => ({ ...s, from: s.from.trim(), to: s.to.trim(), via: s.via?.trim() || undefined })),
    },
  }, 'Home page saved')
}

function reset() {
  save({ homeContent: null }, 'Original home page restored')
}
</script>
