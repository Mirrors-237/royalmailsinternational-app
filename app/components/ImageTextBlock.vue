<template>
  <!-- Image and text block edited in the admin (Settings → Image blocks); shown once it has a photo and a title -->
  <section v-if="block && image" class="container-site pb-24" :class="{ 'pt-24': !flushTop }" :aria-labelledby="`block-${placement}-title`">
    <div class="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div class="overflow-hidden rounded-3xl shadow-[var(--shadow-lift)]" :class="{ 'lg:order-last': block.imageSide === 'right' }">
        <img :src="image" :alt="block.imageAlt" width="1200" height="900" class="aspect-[4/3] size-full object-cover" loading="lazy" decoding="async">
      </div>
      <div>
        <h2 :id="`block-${placement}-title`" class="section-title">{{ block.title }}</h2>
        <p v-if="block.text" class="mt-5 max-w-xl whitespace-pre-line text-lg text-steel">{{ block.text }}</p>
        <NuxtLink
          v-if="block.buttonLabel && block.buttonUrl"
          :to="block.buttonUrl"
          :external="external"
          :target="external ? '_blank' : undefined"
          :rel="external ? 'noopener' : undefined"
          class="btn btn-brand mt-8"
        >
          {{ block.buttonLabel }}
          <Icon :name="external ? 'lucide:external-link' : 'lucide:arrow-right'" class="size-5" aria-hidden="true" />
        </NuxtLink>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
// flushTop: no space above, when the previous section already ends with some on the same background
const props = defineProps<{ placement: BlockPlacement; flushTop?: boolean }>()
const settings = useSiteSettings()

const block = computed(() => (blockState(settings.value, props.placement) === 'shown' ? settings.value.contentBlocks[props.placement]! : null))
const image = computed(() => brandingSrc(settings.value.images?.[`block-${props.placement}`] ?? null))
const external = computed(() => !!block.value?.buttonUrl.startsWith('https://'))
</script>
