<template>
  <form class="card space-y-6 p-6" novalidate @submit.prevent="save({ ...form })">
    <div>
      <h2 class="text-xl">Search engines and sharing</h2>
      <p class="mt-1 text-steel">The title and description of the home page in Google results and when the site is shared.</p>
    </div>
    <p v-if="error" class="rounded-xl bg-red-50 p-3.5 text-sm font-semibold text-red-800" role="alert">{{ error }}</p>

    <FormField id="metaTitle" label="Home page title" :hint="`${form.metaTitle.length} / 60 characters recommended (max. 160)`">
      <template #default="{ field }"><input v-bind="field" v-model.trim="form.metaTitle" maxlength="160"></template>
    </FormField>
    <FormField id="metaDescription" label="Description" :hint="`${form.metaDescription.length} / 155 characters recommended (max. 320)`">
      <template #default="{ field }"><textarea v-bind="field" v-model.trim="form.metaDescription" rows="3" maxlength="320" /></template>
    </FormField>

    <!-- What a search result looks like -->
    <div class="rounded-xl bg-surface p-5">
      <p class="text-xs font-semibold text-steel">Search result preview</p>
      <p class="mt-2 truncate text-lg text-[#1a0dab]">{{ form.metaTitle || settings.siteName }}</p>
      <p class="line-clamp-2 text-sm text-[#4d5156]">{{ form.metaDescription || settings.description }}</p>
    </div>

    <button type="submit" class="btn btn-brand" :disabled="busy">Save</button>
  </form>
</template>

<script setup lang="ts">
const props = defineProps<{ settings: SiteSettings }>()
const emit = defineEmits<{ saved: [SiteSettings] }>()
const { busy, error, save } = useSettingsSave((s) => emit('saved', s))
const form = reactive({ metaTitle: props.settings.metaTitle ?? '', metaDescription: props.settings.metaDescription ?? '' })
</script>
