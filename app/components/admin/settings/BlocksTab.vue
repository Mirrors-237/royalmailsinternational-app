<template>
  <section aria-labelledby="blocks-title">
    <div class="card p-6">
      <h2 id="blocks-title" class="text-xl">Image blocks</h2>
      <p class="mt-1 max-w-3xl text-steel">
        A photo with a title, a short text and an optional button, at set places on the website.
        A block appears once it is switched on and has a photo and a title.
      </p>
    </div>

    <ul class="mt-6 space-y-6">
      <li v-for="p in BLOCK_PLACEMENT_KEYS" :key="p" class="card overflow-hidden">
        <div class="flex flex-wrap items-center justify-between gap-3 border-b border-line px-6 py-4">
          <div>
            <h3 class="text-lg">{{ BLOCK_PLACEMENTS[p].page }}</h3>
            <p class="text-sm text-steel">{{ BLOCK_PLACEMENTS[p].where }}</p>
          </div>
          <div class="flex items-center gap-3">
            <AdminBadge :tone="STATE[blockState(settings, p)].tone">{{ STATE[blockState(settings, p)].label }}</AdminBadge>
            <NuxtLink :to="BLOCK_PLACEMENTS[p].path" target="_blank" class="link-arrow text-sm">
              View the page <Icon name="lucide:external-link" class="size-4" aria-hidden="true" />
            </NuxtLink>
          </div>
        </div>

        <div class="grid gap-6 p-6 lg:grid-cols-[22rem_1fr]">
          <AdminImageUpload
            label="Photo"
            hint="Landscape, at least 1,200 pixels wide. Shown in a 4:3 frame, cropped to fit."
            :src="brandingSrc(settings.images?.[`block-${p}`] ?? null)"
            :custom="!!settings.images?.[`block-${p}`]"
            :endpoint="`/api/settings/images/block-${p}`"
            accept="image/jpeg,image/png,image/webp"
            :max-bytes="6 * 1024 * 1024"
            preview-class="aspect-[4/3]"
            image-class="size-full object-cover"
            empty-text="No photo yet"
            remove-label="Remove the photo"
            class="self-start"
            @updated="(s) => emit('saved', s)"
          />

          <form class="space-y-5" novalidate @submit.prevent="submit(p)">
            <p v-if="error && savingFor === p" class="rounded-xl bg-red-50 p-3.5 text-sm font-semibold text-red-800" role="alert">{{ error }}</p>

            <label class="flex items-center gap-3 font-bold">
              <input v-model="forms[p].enabled" type="checkbox" class="size-5 accent-[var(--brand)]">
              Show this block on the website
            </label>

            <FormField :id="`${p}-title`" label="Title">
              <template #default="{ field }"><input v-bind="field" v-model="forms[p].title" maxlength="100"></template>
            </FormField>
            <FormField :id="`${p}-text`" label="Text" optional>
              <template #default="{ field }"><textarea v-bind="field" v-model="forms[p].text" rows="4" maxlength="1000" /></template>
            </FormField>

            <div class="grid gap-5 sm:grid-cols-2">
              <FormField :id="`${p}-button`" label="Button text" hint="Leave empty for no button." optional>
                <template #default="{ field }"><input v-bind="field" v-model="forms[p].buttonLabel" maxlength="40" placeholder="e.g. Get a quote"></template>
              </FormField>
              <FormField :id="`${p}-url`" label="Button link" :hint="LINK_HINT" optional>
                <template #default="{ field }"><input v-bind="field" v-model.trim="forms[p].buttonUrl" maxlength="300" placeholder="/quote"></template>
              </FormField>
            </div>

            <FormField :id="`${p}-alt`" label="What the photo shows" hint="Read out to people using a screen reader, and used by search engines." optional>
              <template #default="{ field }"><input v-bind="field" v-model="forms[p].imageAlt" maxlength="200" placeholder="e.g. Two warehouse staff loading parcels into a van"></template>
            </FormField>

            <fieldset>
              <legend class="font-bold">Photo position</legend>
              <div class="mt-2 flex gap-2">
                <label v-for="side in SIDES" :key="side.value" class="flex cursor-pointer items-center gap-2 rounded-xl px-4 py-2.5 ring-1 ring-line has-[:checked]:bg-night has-[:checked]:text-white has-[:checked]:ring-night">
                  <input v-model="forms[p].imageSide" type="radio" :name="`${p}-side`" :value="side.value" class="sr-only">
                  <Icon :name="side.icon" class="size-4" aria-hidden="true" />
                  {{ side.label }}
                </label>
              </div>
            </fieldset>

            <button type="submit" class="btn btn-brand" :disabled="busy">Save this block</button>
          </form>
        </div>
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
const props = defineProps<{ settings: SiteSettings }>()
const emit = defineEmits<{ saved: [SiteSettings] }>()
const { busy, error, save } = useSettingsSave((s) => emit('saved', s))

// Each block has its own form; saving one keeps the saved version of the others
const forms = reactive(Object.fromEntries(
  BLOCK_PLACEMENT_KEYS.map((p) => [p, { ...EMPTY_BLOCK, ...props.settings.contentBlocks?.[p] }]),
) as Record<BlockPlacement, ContentBlock>)
const savingFor = ref<BlockPlacement | null>(null)

const STATE = {
  shown:      { label: 'Shown on the website', tone: 'bg-emerald-50 text-emerald-700' },
  incomplete: { label: 'Needs a photo and a title', tone: 'bg-amber-50 text-amber-800' },
  off:        { label: 'Hidden', tone: 'bg-slate-100 text-slate-600' },
}

const SIDES = [
  { value: 'left' as const, label: 'Left', icon: 'lucide:panel-left' },
  { value: 'right' as const, label: 'Right', icon: 'lucide:panel-right' },
]

// In the script: a literal "//" in a template attribute confuses vue-tsc
const LINK_HINT = 'A page of the site, like /quote, or an https:// address.'
const LINK = /^(\/(?!\/)\S*|https:\/\/\S+)$/

function submit(p: BlockPlacement) {
  savingFor.value = p
  const f = { ...forms[p], title: forms[p].title.trim(), text: forms[p].text.trim(), buttonLabel: forms[p].buttonLabel.trim(), imageAlt: forms[p].imageAlt.trim() }
  error.value = ''
  if (f.enabled && !f.title) { error.value = 'Add a title to show this block.'; return }
  if (f.buttonLabel && !f.buttonUrl) { error.value = 'Add the button link, or leave the button text empty.'; return }
  if (f.buttonUrl && !LINK.test(f.buttonUrl)) { error.value = 'The button link must be a page of the site (starting with /) or an https:// address.'; return }
  save({ contentBlocks: { ...props.settings.contentBlocks, [p]: f } }, f.enabled ? 'Block saved' : 'Block saved (hidden)')
}
</script>
