<template>
  <section aria-labelledby="photos-title">
    <div class="card p-6">
      <h2 id="photos-title" class="text-xl">Website photos</h2>
      <p class="mt-1 max-w-3xl text-steel">
        Replace any photo with your own. Use landscape photos at least 1,600 pixels wide (JPG, PNG or WebP, up to 6 MB),
        and only images you have the right to use. "Restore" puts the original photo back.
      </p>
    </div>

    <ul class="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      <li v-for="slot in slots" :key="slot">
        <AdminImageUpload
          :label="SLOT_LABEL[slot]"
          :hint="MEDIA_USAGE[slot]"
          :src="media[slot].src"
          :custom="!!settings.images?.[slot]"
          :endpoint="`/api/settings/images/${slot}`"
          accept="image/jpeg,image/png,image/webp"
          :max-bytes="6 * 1024 * 1024"
          preview-class="aspect-[16/9]"
          image-class="size-full object-cover"
          remove-label="Restore the original"
          @updated="(s) => emit('saved', s)"
        />
      </li>
    </ul>
  </section>
</template>

<script setup lang="ts">
defineProps<{ settings: SiteSettings }>()
const emit = defineEmits<{ saved: [SiteSettings] }>()

// The page's settings are applied to the site state after each upload, so this follows them
const media = useMedia()
const slots = Object.keys(MEDIA) as MediaSlot[]

const SLOT_LABEL: Record<MediaSlot, string> = {
  hero: 'Home page background', air: 'Air freight', sea: 'Sea freight', road: 'Road freight',
  customs: 'Customs clearance', port: 'Port (wide view)', sorting: 'Sorting centre',
  receive: 'Delivery to a customer', business: 'Business team',
}
</script>
