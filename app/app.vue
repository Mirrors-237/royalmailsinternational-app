<template>
  <NuxtRouteAnnouncer />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const settings = useSiteSettings()
const route = useRoute()
const siteUrl = useSiteUrl()

// Without query string or trailing slash, so that each page has a single address
const canonical = computed(() => siteUrl + (route.path === '/' ? '/' : route.path.replace(/\/+$/, '')))

// Brand identity injected during server rendering: colours, title, favicon, description
useHead(() => ({
  htmlAttrs: { style: brandVars(settings.value.primaryColor, settings.value.accentColor) },
  titleTemplate: (title?: string) => (title ? `${title} – ${settings.value.siteName}` : settings.value.metaTitle || settings.value.siteName),
  link: [
    { rel: 'icon', href: brandingSrc(settings.value.faviconUrl) ?? '/favicon.ico' },
    { rel: 'canonical', href: canonical.value },
  ],
  meta: [{ name: 'theme-color', content: settings.value.primaryColor }],
}))

// Generated from the logo and colours (server/routes/og-image.png.ts); the version changes with them
const shareImage = computed(() => `${siteUrl}${SHARE_IMAGE.path}?v=${shareImageVersion(settings.value)}`)

// X account taken from the profile link set in the admin
const twitterHandle = computed(() => settings.value.socialTwitter.match(/(?:twitter|x)\.com\/@?([A-Za-z0-9_]{1,15})(?:[/?#]|$)/)?.[1])

// Defaults for every page; pages set their own title and description with usePageSeo
useSeoMeta({
  description:        () => settings.value.metaDescription || settings.value.description,
  ogType:             'website',
  ogLocale:           'en_GB',
  ogSiteName:         () => settings.value.siteName,
  ogUrl:              () => canonical.value,
  ogTitle:            () => settings.value.metaTitle || settings.value.siteName,
  ogDescription:      () => settings.value.metaDescription || settings.value.description,
  ogImage:            () => shareImage.value,
  ogImageWidth:       SHARE_IMAGE.width,
  ogImageHeight:      SHARE_IMAGE.height,
  ogImageType:        'image/png',
  ogImageAlt:         () => settings.value.siteName,
  twitterCard:        'summary_large_image',
  twitterImage:       () => shareImage.value,
  twitterImageAlt:    () => settings.value.siteName,
  twitterSite:        () => (twitterHandle.value ? `@${twitterHandle.value}` : undefined),
})
</script>
