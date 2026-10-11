<template>
  <!-- "I'm looking for…": searches the site's pages and FAQ, shown as an accessible combobox -->
  <form role="search" class="relative" @submit.prevent="go(active >= 0 ? results[active] : results[0])">
    <label :for="inputId" class="sr-only">Search the website</label>
    <div class="flex">
      <input
        :id="inputId"
        v-model="query"
        type="search"
        role="combobox"
        autocomplete="off"
        :aria-expanded="open"
        :aria-controls="listId"
        :aria-activedescendant="active >= 0 ? `${listId}-${active}` : undefined"
        aria-autocomplete="list"
        placeholder="I'm looking for…"
        class="field min-h-13 flex-1 rounded-r-none border-r-0 px-4 text-lg"
        @input="active = -1"
        @focus="focused = true"
        @blur="focused = false"
        @keydown.down.prevent="move(1)"
        @keydown.up.prevent="move(-1)"
        @keydown.esc="query = ''"
      >
      <button type="submit" class="btn btn-accent min-h-13 rounded-l-none px-5">
        <Icon name="lucide:search" class="size-5" aria-hidden="true" />
        <span class="sr-only">Search</span>
      </button>
    </div>

    <ul
      v-show="open"
      :id="listId"
      role="listbox"
      aria-label="Suggestions"
      class="absolute inset-x-0 top-full z-20 mt-2 max-h-80 overflow-y-auto rounded-xl border border-line bg-white py-1 text-ink shadow-[var(--shadow-lift)]"
    >
      <li
        v-for="(r, i) in results"
        :id="`${listId}-${i}`"
        :key="r.to + r.title"
        role="option"
        :aria-selected="i === active"
        class="flex cursor-pointer items-center justify-between gap-4 px-4 py-2.5"
        :class="i === active ? 'bg-brand-wash' : 'hover:bg-surface'"
        @mousedown.prevent="go(r)"
      >
        <span>{{ r.title }}</span>
        <span class="shrink-0 text-xs text-steel">{{ r.section }}</span>
      </li>
      <li v-if="!results.length" class="px-4 py-3 text-steel" role="option" aria-disabled="true">
        No match. Try "customs", "price" or "delivery", or <NuxtLink to="/contact" class="link" @mousedown.prevent="navigateTo('/contact')">contact us</NuxtLink>.
      </li>
    </ul>
    <p class="sr-only" aria-live="polite">{{ open ? `${results.length} suggestions` : '' }}</p>
  </form>
</template>

<script setup lang="ts">
interface Entry { title: string; section: string; to: string; keywords?: string }

const inputId = useId()
const listId = `${inputId}-list`
const query = ref('')
const focused = ref(false)
const active = ref(-1)
const faq = useFaq()

const PAGES: Entry[] = [
  { title: 'Track a parcel',               section: 'Track',    to: '/track',        keywords: 'where is my parcel tracking number status' },
  { title: 'Get a quote',                  section: 'Send',     to: '/quote',        keywords: 'price cost rate tariff estimate' },
  { title: 'Shipping services compared',   section: 'Send',     to: '/send',         keywords: 'send parcel freight options timescales' },
  ...SHIPPING_SERVICES.map((s) => ({ title: s.title, section: 'Send', to: `/send#${s.id}`, keywords: `${s.summary} ${s.detail}` })),
  { title: 'Preparing your shipment',      section: 'Send',     to: '/send#prepare', keywords: 'packaging box documents invoice address label' },
  { title: "Items we can't carry",         section: 'Send',     to: '/send#restricted', keywords: 'prohibited banned dangerous batteries liquids food' },
  { title: 'Receiving a parcel',           section: 'Receive',  to: '/receive',      keywords: 'delivery recipient' },
  { title: 'Customs duties and taxes',     section: 'Receive',  to: '/receive#customs', keywords: 'vat import fees pay customs' },
  { title: 'Shipping for businesses',      section: 'Business', to: '/business',     keywords: 'company account volume contract' },
  { title: 'Contact customer service',     section: 'Help',     to: '/contact',      keywords: 'phone email complaint problem damaged lost' },
  { title: 'Opening hours and address',    section: 'Help',     to: '/about#find-us', keywords: 'office location visit hours' },
]

const index = computed<Entry[]>(() => [
  ...PAGES,
  ...faq.value.map((q) => ({ title: q.question, section: 'FAQ', to: `/help#${faqSlug(q.question)}`, keywords: q.answer })),
])

const results = computed(() => {
  const words = query.value.toLowerCase().split(/\s+/).filter((w) => w.length > 1)
  if (!words.length) return []
  return index.value
    .map((e) => {
      const title = e.title.toLowerCase()
      const text = `${title} ${e.keywords ?? ''}`.toLowerCase()
      if (!words.every((w) => text.includes(w))) return null
      return { e, score: words.filter((w) => title.includes(w)).length }
    })
    .filter((r): r is { e: Entry; score: number } => !!r)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map((r) => r.e)
})

const open = computed(() => focused.value && query.value.trim().length > 1)

function move(step: number) {
  if (!results.value.length) return
  active.value = (active.value + step + results.value.length) % results.value.length
}

async function go(entry?: Entry) {
  if (!entry) return
  query.value = ''
  await navigateTo(entry.to)
}
</script>
