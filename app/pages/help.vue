<template>
  <div>
    <PageHeader
      title="Help and support"
      intro="Answers to the most common questions about tracking, sending and receiving."
      :crumbs="[{ label: 'Help' }]"
      :image="media.customs"
    >
      <div class="mt-9 max-w-xl"><SiteFinder /></div>
    </PageHeader>

    <div class="container-site grid gap-12 py-20 lg:grid-cols-12 lg:py-24">
      <div class="lg:col-span-8">
        <nav aria-label="Help topics" class="flex flex-wrap gap-2">
          <button
            v-for="t in topics"
            :key="t"
            type="button"
            class="rounded-full px-4 py-2 text-sm font-semibold transition-colors"
            :class="topic === t ? 'bg-night text-white shadow-lg' : 'bg-surface text-ink hover:bg-line'"
            :aria-pressed="topic === t"
            @click="topic = t"
          >{{ t }}</button>
        </nav>

        <section v-for="group in groups" :key="group.topic" class="mt-10" :aria-labelledby="`topic-${group.slug}`">
          <h2 :id="`topic-${group.slug}`" class="text-3xl">{{ group.topic }}</h2>
          <FaqList :items="group.items" class="mt-5" />
        </section>
      </div>

      <div class="space-y-6 lg:col-span-4">
        <ContactCard class="lg:sticky lg:top-28" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const media = useMedia()
usePageSeo({
  title: 'Help and support',
  description: 'Answers about tracking, sending, receiving and paying for shipments.',
})

const faq = useFaq()

const ALL = 'All topics'
const topics = computed(() => [ALL, ...new Set(faq.value.map((q) => q.topic))])
const topic = ref(ALL)

const groups = computed(() =>
  topics.value
    .filter((t) => t !== ALL && (topic.value === ALL || topic.value === t))
    .map((t) => ({ topic: t, slug: t.toLowerCase().replace(/\W+/g, '-'), items: faq.value.filter((q) => q.topic === t) })),
)
</script>
