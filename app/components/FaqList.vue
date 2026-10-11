<template>
  <div class="space-y-3">
    <details
      v-for="q in items"
      :id="faqSlug(q.question)"
      :key="q.question"
      class="group card scroll-mt-28 overflow-hidden open:shadow-[var(--shadow-lift)]"
      :open="openId === faqSlug(q.question)"
    >
      <summary class="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-lg font-bold hover:text-brand [&::-webkit-details-marker]:hidden">
        {{ q.question }}
        <span class="grid size-8 shrink-0 place-items-center rounded-lg bg-surface text-steel transition-colors group-open:bg-brand group-open:text-on-brand">
          <Icon name="lucide:plus" class="size-4 transition-transform duration-300 group-open:rotate-45" aria-hidden="true" />
        </span>
      </summary>
      <p class="max-w-2xl px-6 pb-6 text-steel">{{ q.answer }}</p>
    </details>
  </div>
</template>

<script setup lang="ts">
defineProps<{ items: { question: string; answer: string }[] }>()

// A link to /help#question opens that answer
const route = useRoute()
const openId = computed(() => route.hash.slice(1))
</script>
