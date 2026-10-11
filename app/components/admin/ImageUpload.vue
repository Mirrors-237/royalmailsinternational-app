<template>
  <div class="card overflow-hidden">
    <div class="relative grid place-items-center overflow-hidden" :class="[previewClass, dark ? 'night-backdrop' : 'bg-surface']">
      <img v-if="src" :src="src" :alt="`Current ${label.toLowerCase()}`" :class="imageClass">
      <span v-else class="px-4 text-center text-sm" :class="dark ? 'text-white/60' : 'text-steel'">{{ emptyText }}</span>
      <span v-if="custom" class="absolute left-3 top-3 rounded-full bg-emerald-600 px-2.5 py-0.5 text-xs font-bold text-white">Uploaded</span>
    </div>
    <div class="p-4">
      <p class="font-bold">{{ label }}</p>
      <p v-if="hint" class="mt-0.5 text-sm text-steel">{{ hint }}</p>
      <p v-if="error" class="mt-2 text-sm font-semibold text-red-700" role="alert">{{ error }}</p>
      <div class="mt-3 flex flex-wrap gap-2">
        <label class="btn btn-ghost min-h-10 cursor-pointer px-3.5 text-sm" :class="{ 'pointer-events-none opacity-55': busy }">
          <Icon :name="busy ? 'lucide:refresh-cw' : 'lucide:upload'" class="size-4" :class="{ 'animate-spin': busy }" aria-hidden="true" />
          {{ busy ? 'Uploading…' : custom ? 'Replace' : 'Upload' }}
          <input type="file" class="sr-only" :accept="accept" :disabled="busy" @change="upload">
        </label>
        <AdminConfirmButton v-if="custom" :label="removeLabel" :busy="busy" @confirm="remove" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  label: string
  hint?: string
  src: string | null          // image shown now (uploaded or built-in)
  custom: boolean             // true when an uploaded image is in use (can be removed)
  endpoint: string            // POST to upload, DELETE to remove
  accept: string
  maxBytes: number
  previewClass?: string
  imageClass?: string
  dark?: boolean
  emptyText?: string
  removeLabel?: string
}>(), {
  previewClass: 'h-40',
  imageClass: 'max-h-24 max-w-[80%] object-contain',
  emptyText: 'Nothing uploaded yet',
  removeLabel: 'Remove',
})
const emit = defineEmits<{ updated: [SiteSettings] }>()
const { notify } = useAdminNotices()

const busy = ref(false)
const error = ref('')

async function upload(e: Event) {
  const input = e.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  error.value = ''
  if (file.size > props.maxBytes) {
    error.value = `This file is ${(file.size / 1048576).toFixed(1)} MB; the maximum is ${Math.round(props.maxBytes / 1048576)} MB.`
    return
  }
  const body = new FormData()
  body.append('file', file)
  busy.value = true
  try {
    emit('updated', await adminFetch<SiteSettings>(props.endpoint, { method: 'POST', body }))
    notify(`${props.label} updated`)
  } catch (err) {
    error.value = apiError(err, 'The upload failed. Please try again.')
  } finally {
    busy.value = false
  }
}

async function remove() {
  busy.value = true
  error.value = ''
  try {
    emit('updated', await adminFetch<SiteSettings>(props.endpoint, { method: 'DELETE' }))
    notify(`${props.label} removed`)
  } catch (err) {
    error.value = apiError(err)
  } finally {
    busy.value = false
  }
}
</script>
