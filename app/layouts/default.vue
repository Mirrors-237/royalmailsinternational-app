<template>
  <div class="flex min-h-dvh flex-col">
    <a
      href="#content"
      class="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-ink focus:px-4 focus:py-3 focus:text-white"
    >Skip to content</a>

    <SiteHeader />
    <main id="content" class="flex-1" tabindex="-1">
      <slot />
    </main>
    <SiteFooter />
  </div>
</template>
