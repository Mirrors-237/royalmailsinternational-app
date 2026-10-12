<template>
  <!-- A photo uploaded in the admin fills the space; otherwise the illustration, in its own frame -->
  <div v-if="photo" class="overflow-hidden" :class="photoFrame">
    <img :src="photo" alt="" class="size-full object-cover" loading="lazy" decoding="async">
  </div>
  <div v-else :class="frame">
    <Illustration :name="name" :class="svgClass" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  name: ReplaceableIllustration
  frame?: string       // container of the illustration (background, padding)
  svgClass?: string    // size of the illustration
  photoFrame: string   // container of the photo: it needs a height or an aspect ratio
}>()

const settings = useSiteSettings()
const photo = computed(() => brandingSrc(settings.value.images?.[`illustration-${props.name}`] ?? null))
</script>
