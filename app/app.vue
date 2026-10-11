<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const settings = useSiteSettings()

// Brand identity injected during server rendering: colours, title, favicon, description
useHead(() => ({
  htmlAttrs: { style: brandVars(settings.value.primaryColor, settings.value.accentColor) },
  titleTemplate: (title?: string) => (title ? `${title} – ${settings.value.siteName}` : settings.value.metaTitle || settings.value.siteName),
  link: [{ rel: 'icon', href: brandingSrc(settings.value.faviconUrl) ?? '/favicon.ico' }],
  meta: [{ name: 'theme-color', content: settings.value.primaryColor }],
}))

useSeoMeta({
  description:   () => settings.value.metaDescription || settings.value.description,
  ogSiteName:    () => settings.value.siteName,
  ogDescription: () => settings.value.metaDescription || settings.value.description,
})
</script>
