<template>
  <form novalidate @submit.prevent="submit">
    <label :for="inputId" class="block text-sm font-semibold" :class="dark ? 'text-white/75' : 'text-ink'">Tracking number</label>
    <div
      class="mt-2 flex flex-col gap-2 rounded-2xl p-1.5 transition-colors sm:flex-row"
      :class="[
        dark ? 'glass focus-within:border-white/40 focus-within:bg-white/10 focus-within:ring-2 focus-within:ring-white/30' : 'border bg-white shadow-[var(--shadow-card)] focus-within:border-brand focus-within:shadow-[0_0_0_4px_color-mix(in_oklab,var(--brand)_18%,transparent)]',
        error ? '!border-red-400' : dark ? '' : 'border-field',
      ]"
    >
      <div class="relative flex-1">
        <Icon name="lucide:search" class="pointer-events-none absolute left-3.5 top-1/2 size-5 -translate-y-1/2" :class="dark ? 'text-white/45' : 'text-steel'" aria-hidden="true" />
        <input
          :id="inputId"
          v-model="code"
          type="text"
          autocomplete="off"
          autocapitalize="characters"
          spellcheck="false"
          :placeholder="prefix ? `e.g. ${prefix}…` : ''"
          :aria-describedby="error ? `${inputId}-hint ${inputId}-error` : `${inputId}-hint`"
          :aria-invalid="!!error"
          class="tracking-code min-h-13 w-full bg-transparent pl-11 pr-3 text-lg uppercase placeholder:font-normal placeholder:normal-case placeholder:tracking-normal focus:outline-none"
          :class="dark ? 'text-white placeholder:text-white/45' : 'text-ink placeholder:text-steel'"
          @input="error = ''"
        >
      </div>
      <button type="submit" class="btn btn-accent min-h-13 px-7">
        Track
        <Icon name="lucide:arrow-right" class="size-5" aria-hidden="true" />
      </button>
    </div>

    <p v-if="error" :id="`${inputId}-error`" class="mt-2 flex items-center gap-2 text-sm font-semibold" :class="dark ? 'text-red-300' : 'text-red-700'" role="alert">
      <Icon name="lucide:circle-alert" class="size-4" aria-hidden="true" />
      {{ error }}
    </p>
    <p :id="`${inputId}-hint`" class="mt-2 text-sm" :class="dark ? 'text-white/60' : 'text-steel'">
      You'll find it on your receipt and in your confirmation email<template v-if="prefix">. It starts with <span class="tracking-code" :class="dark ? 'text-white' : 'text-ink'">{{ prefix }}</span></template>.
    </p>
  </form>
</template>

<script setup lang="ts">
const props = defineProps<{ initial?: string; dark?: boolean }>()

const settings = useSiteSettings()
const inputId = useId()
const code = ref(props.initial ?? '')
const error = ref('')

const prefix = computed(() => settings.value.trackingPrefix?.toUpperCase())

async function submit() {
  const value = code.value.replace(/\s+/g, '').toUpperCase()
  if (!value) {
    error.value = 'Enter the tracking number of your shipment.'
    return
  }
  await navigateTo(`/track/${encodeURIComponent(value)}`)
}
</script>
