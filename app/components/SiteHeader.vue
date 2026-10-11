<template>
  <!-- Every page opens on a dark band: the header is see-through over it, then turns white once the page scrolls -->
  <header
    class="fixed inset-x-0 top-0 z-40 transition-[background-color,box-shadow] duration-300"
    :class="menuOpen ? 'bg-white' : scrolled ? 'bg-white/95 shadow-[0_1px_0_rgb(15_23_42/0.08)] backdrop-blur-xl' : 'bg-transparent'"
    @keydown.esc="menuOpen = false"
  >
    <div class="container-site flex h-20 items-center gap-6">
      <BrandMark :on-dark="!solid" />

      <nav
        aria-label="Main navigation"
        class="ml-auto hidden items-center gap-1 rounded-2xl p-1 transition-colors lg:flex"
        :class="solid ? '' : 'glass'"
      >
        <NuxtLink
          v-for="link in MAIN_NAV"
          :key="link.to"
          :to="link.to"
          class="rounded-xl px-4 py-2 text-[0.9375rem] font-semibold transition-colors"
          :class="solid ? 'text-ink hover:bg-surface' : 'text-white/80 hover:bg-white/10 hover:text-white'"
          :active-class="solid ? '!bg-brand-wash !text-brand' : '!bg-white/15 !text-white'"
        >{{ link.label }}</NuxtLink>
      </nav>

      <div class="ml-auto flex items-center gap-2 lg:ml-4">
        <a
          v-if="settings.phone"
          :href="`tel:${settings.phone.replace(/\s/g, '')}`"
          class="hidden items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold xl:inline-flex"
          :class="solid ? 'text-ink hover:bg-surface' : 'text-white/85 hover:text-white'"
        >
          <Icon name="lucide:phone" class="size-4" aria-hidden="true" />
          {{ settings.phone }}
        </a>

        <NuxtLink to="/quote" class="btn hidden sm:inline-flex" :class="solid ? 'btn-dark' : 'btn-light'">
          <Icon name="lucide:file-text" class="size-4" aria-hidden="true" />
          Get a quote
        </NuxtLink>

        <button
          type="button"
          class="grid size-12 place-items-center rounded-xl transition-colors lg:hidden"
          :class="solid ? 'bg-surface text-ink hover:bg-line' : 'bg-white/10 text-white hover:bg-white/20'"
          :aria-expanded="menuOpen"
          aria-controls="mobile-menu"
          @click="menuOpen = !menuOpen"
        >
          <Icon :name="menuOpen ? 'lucide:x' : 'lucide:menu'" class="size-6" aria-hidden="true" />
          <span class="sr-only">{{ menuOpen ? 'Close menu' : 'Open menu' }}</span>
        </button>
      </div>
    </div>

    <Transition
      enter-active-class="transition duration-300 ease-out"
      enter-from-class="-translate-y-2 opacity-0"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="-translate-y-2 opacity-0"
    >
      <nav
        v-show="menuOpen"
        id="mobile-menu"
        aria-label="Main navigation"
        class="max-h-[calc(100dvh-5rem)] overflow-y-auto border-t border-line bg-white shadow-[var(--shadow-lift)] lg:hidden"
      >
        <ul class="container-site space-y-1 py-4">
          <li v-for="link in MAIN_NAV" :key="link.to">
            <NuxtLink
              :to="link.to"
              class="flex items-center justify-between rounded-xl px-3 py-3.5 text-lg font-semibold hover:bg-surface"
              active-class="bg-brand-wash text-brand"
            >
              {{ link.label }}
              <Icon name="lucide:chevron-right" class="size-5 text-steel" aria-hidden="true" />
            </NuxtLink>
          </li>
          <li class="grid gap-2 pt-3 sm:grid-cols-2">
            <NuxtLink to="/quote" class="btn btn-dark w-full">
              <Icon name="lucide:file-text" class="size-5" aria-hidden="true" />
              Get a quote
            </NuxtLink>
            <a v-if="settings.phone" :href="`tel:${settings.phone.replace(/\s/g, '')}`" class="btn btn-ghost w-full">
              <Icon name="lucide:phone" class="size-5" aria-hidden="true" />
              {{ settings.phone }}
            </a>
          </li>
        </ul>
      </nav>
    </Transition>
  </header>
</template>

<script setup lang="ts">
const settings = useSiteSettings()
const route = useRoute()
const menuOpen = ref(false)
const scrolled = ref(false)

const solid = computed(() => scrolled.value || menuOpen.value)

// Close the mobile menu after navigating
watch(() => route.fullPath, () => { menuOpen.value = false })

const onScroll = () => { scrolled.value = window.scrollY > 24 }

onMounted(() => {
  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
})
onBeforeUnmount(() => window.removeEventListener('scroll', onScroll))
</script>
