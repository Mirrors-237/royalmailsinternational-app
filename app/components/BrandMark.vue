<template>
  <NuxtLink to="/" class="group inline-flex min-w-0 items-center gap-3 rounded-xl">
    <img
      v-if="logo"
      :src="logo"
      :alt="settings.siteName"
      class="h-10 w-auto max-w-[12rem] object-contain"
      :class="{ 'box-content rounded-lg bg-white p-2': needsChip }"
    >
    <template v-else>
      <span
        class="relative grid size-11 shrink-0 place-items-center rounded-2xl text-sm font-extrabold tracking-tight text-white transition-transform duration-300 group-hover:rotate-3 group-hover:scale-105"
        :class="onDark ? 'glass' : 'bg-gradient-to-br from-brand to-night shadow-lg'"
        aria-hidden="true"
      >
        {{ initials }}
        <span class="absolute -right-1 -top-1 size-3 rounded-full border-2 bg-accent" :class="onDark ? 'border-night' : 'border-white'" />
      </span>
      <span class="max-w-[13rem] text-[1.0625rem] font-extrabold leading-tight tracking-tight transition-colors" :class="onDark ? 'text-white' : 'text-ink'">
        {{ settings.siteName }}
      </span>
    </template>
  </NuxtLink>
</template>

<script setup lang="ts">
// Brand logo, or initials and name when no logo has been uploaded in the admin
const props = defineProps<{ onDark?: boolean }>()
const settings = useSiteSettings()

const logo = computed(() =>
  brandingSrc(props.onDark ? settings.value.logoOnDarkUrl ?? settings.value.logoUrl : settings.value.logoUrl),
)

// On a dark background with no dedicated version, the standard logo sits on a light tile
const needsChip = computed(() => props.onDark && !settings.value.logoOnDarkUrl && !!settings.value.logoUrl)

const initials = computed(() => brandInitials(settings.value.siteName))
</script>
