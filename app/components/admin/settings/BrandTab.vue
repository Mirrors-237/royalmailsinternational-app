<template>
  <div class="space-y-6">
    <form class="card space-y-6 p-6" novalidate @submit.prevent="submit">
      <h2 class="text-xl">Identity</h2>
      <p v-if="error" class="rounded-xl bg-red-50 p-3.5 text-sm font-semibold text-red-800" role="alert">{{ error }}</p>

      <div class="grid gap-5 lg:grid-cols-2">
        <FormField id="siteName" label="Company name" hint="Shown in the header, the footer, emails and page titles.">
          <template #default="{ field }"><input v-bind="field" v-model.trim="form.siteName" maxlength="120" required></template>
        </FormField>
        <FormField id="tagline" label="Tagline" hint="A short phrase about what you do." optional>
          <template #default="{ field }"><input v-bind="field" v-model.trim="form.tagline" maxlength="160"></template>
        </FormField>
        <FormField id="description" label="Short description" hint="Shown in the footer and on the About page." optional class="lg:col-span-2">
          <template #default="{ field }"><textarea v-bind="field" v-model.trim="form.description" rows="2" maxlength="1000" /></template>
        </FormField>
        <FormField id="trackingPrefix" label="Tracking number prefix" hint="1 to 8 letters or digits. Only applies to shipments created from now on.">
          <template #default="{ field }"><input v-bind="field" v-model.trim="form.trackingPrefix" maxlength="8" class="field tracking-code w-40 px-3.5 py-2.5 uppercase"></template>
        </FormField>
      </div>

      <div class="border-t border-line pt-6">
        <h2 class="text-xl">Colours</h2>
        <p class="mt-1 text-steel">The main colour is used for links, highlights, illustrations and the dark backgrounds. The accent colour is used for the main buttons.</p>

        <div class="mt-5 grid gap-6 xl:grid-cols-[1fr_1.1fr]">
          <div class="space-y-5">
            <div v-for="c in colorFields" :key="c.key">
              <label :for="c.key" class="block font-bold">{{ c.label }}</label>
              <div class="mt-2 flex items-center gap-3">
                <input v-model="form[c.key]" type="color" class="h-11 w-16 cursor-pointer rounded-lg border border-field bg-white p-1" :aria-label="`${c.label}: colour picker`">
                <input :id="c.key" v-model.trim="form[c.key]" type="text" maxlength="7" pattern="#[0-9a-fA-F]{6}" class="field tracking-code w-32 px-3 py-2.5" :aria-invalid="!HEX.test(form[c.key]) || undefined">
              </div>
            </div>

            <div>
              <p class="font-bold">Ready-made palettes</p>
              <ul class="mt-2 flex flex-wrap gap-2">
                <li v-for="p in palettes" :key="p.name">
                  <button type="button" class="flex items-center gap-2 rounded-full bg-white py-1.5 pl-1.5 pr-3 text-sm font-semibold ring-1 ring-line hover:ring-field" @click="form.primaryColor = p.primary; form.accentColor = p.accent">
                    <span class="flex">
                      <span class="size-5 rounded-full ring-2 ring-white" :style="{ background: p.primary }" />
                      <span class="-ml-1.5 size-5 rounded-full ring-2 ring-white" :style="{ background: p.accent }" />
                    </span>
                    {{ p.name }}
                  </button>
                </li>
              </ul>
            </div>
          </div>

          <!-- Live preview, with the same rules as the website -->
          <div :style="previewVars" class="overflow-hidden rounded-2xl ring-1 ring-line" aria-label="Preview">
            <div class="night-backdrop p-6 text-white">
              <div class="flex items-center gap-3">
                <span class="glass relative grid size-10 place-items-center rounded-xl text-xs font-extrabold">{{ initials }}<span class="absolute -right-1 -top-1 size-2.5 rounded-full bg-accent" /></span>
                <span class="font-extrabold">{{ form.siteName || 'Your company' }}</span>
              </div>
              <p class="mt-6 text-2xl font-extrabold leading-tight tracking-tight">Shipping, <span class="text-accent">made simple.</span></p>
              <div class="glass mt-4 flex items-center gap-2 rounded-xl p-1.5">
                <span class="flex-1 px-3 text-sm text-white/50">e.g. {{ (form.trackingPrefix || 'TRK').toUpperCase() }}…</span>
                <span class="btn btn-brand min-h-9 px-4 text-sm">Track</span>
              </div>
            </div>
            <div class="flex items-center gap-4 bg-white p-5">
              <Illustration name="send" class="h-20 w-24 shrink-0" />
              <div class="min-w-0">
                <p class="font-bold">Sending a parcel?</p>
                <p class="link-arrow text-sm">Services and timescales →</p>
                <span class="btn btn-brand mt-2 min-h-9 px-4 text-sm">Get a quote</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button type="submit" class="btn btn-brand" :disabled="busy">Save identity and colours</button>
    </form>

    <section class="card p-6" aria-labelledby="logos-title">
      <h2 id="logos-title" class="text-xl">Logo and icon</h2>
      <p class="mt-1 text-steel">Without a logo, the website shows your initials in a coloured square. PNG, JPG or SVG, up to 2 MB.</p>
      <div class="mt-5 grid gap-5 md:grid-cols-3">
        <AdminImageUpload
          label="Logo"
          hint="On white backgrounds (header once scrolled, admin)."
          :src="brandingSrc(settings.logoUrl)"
          :custom="!!settings.logoUrl"
          endpoint="/api/settings/branding/logo"
          accept="image/png,image/jpeg,image/svg+xml"
          :max-bytes="2 * 1024 * 1024"
          @updated="(s) => emit('saved', s)"
        />
        <AdminImageUpload
          label="Logo for dark backgrounds"
          hint="White or light version, for the top of pages and the footer."
          :src="brandingSrc(settings.logoOnDarkUrl)"
          :custom="!!settings.logoOnDarkUrl"
          endpoint="/api/settings/branding/logoOnDark"
          accept="image/png,image/jpeg,image/svg+xml"
          :max-bytes="2 * 1024 * 1024"
          dark
          empty-text="The standard logo is used on a white tile"
          @updated="(s) => emit('saved', s)"
        />
        <AdminImageUpload
          label="Browser icon"
          hint="Square image shown in browser tabs (favicon). PNG, SVG or ICO."
          :src="brandingSrc(settings.faviconUrl)"
          :custom="!!settings.faviconUrl"
          endpoint="/api/settings/branding/favicon"
          accept="image/png,image/svg+xml,image/x-icon,.ico"
          :max-bytes="2 * 1024 * 1024"
          image-class="size-12 object-contain"
          @updated="(s) => emit('saved', s)"
        />
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ settings: SiteSettings }>()
const emit = defineEmits<{ saved: [SiteSettings] }>()
const { busy, error, save } = useSettingsSave((s) => emit('saved', s))

const HEX = /^#[0-9a-fA-F]{6}$/

const form = reactive({
  siteName: props.settings.siteName,
  tagline: props.settings.tagline,
  description: props.settings.description,
  trackingPrefix: props.settings.trackingPrefix,
  primaryColor: props.settings.primaryColor,
  accentColor: props.settings.accentColor,
})

const colorFields = [
  { key: 'primaryColor' as const, label: 'Main colour' },
  { key: 'accentColor' as const, label: 'Accent colour' },
]

const palettes = [
  { name: 'Ocean',    primary: '#0b5bd3', accent: '#f59e0b' },
  { name: 'Navy',     primary: '#1e3a8a', accent: '#38bdf8' },
  { name: 'Teal',     primary: '#0f766e', accent: '#f97316' },
  { name: 'Forest',   primary: '#166534', accent: '#facc15' },
  { name: 'Burgundy', primary: '#9f1239', accent: '#fbbf24' },
  { name: 'Violet',   primary: '#6d28d9', accent: '#f472b6' },
]

// The preview uses the same computed text colours as the website (utils/color.ts)
const previewVars = computed(() => brandVars(
  HEX.test(form.primaryColor) ? form.primaryColor : props.settings.primaryColor,
  HEX.test(form.accentColor) ? form.accentColor : props.settings.accentColor,
))

const initials = computed(() => (form.siteName || 'YC').split(/\s+/).filter(Boolean).slice(0, 3).map((w) => w[0]!.toUpperCase()).join(''))

function submit() {
  if (!form.siteName) { error.value = 'Enter the company name.'; return }
  if (!/^[A-Za-z0-9]{1,8}$/.test(form.trackingPrefix)) { error.value = 'The tracking prefix must be 1 to 8 letters or digits.'; return }
  if (!HEX.test(form.primaryColor) || !HEX.test(form.accentColor)) { error.value = 'Colours must use the #rrggbb format, for example #0b5bd3.'; return }
  save({ ...form, trackingPrefix: form.trackingPrefix.toUpperCase() })
}
</script>
