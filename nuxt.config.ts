import tailwindcss from '@tailwindcss/vite';
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },

  modules: ['@nuxt/icon'],

  css: ['@fontsource-variable/plus-jakarta-sans', '~/assets/css/tailwind.css'],

  vite: {
    plugins: [
      tailwindcss(),
    ],
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en-GB' },
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1' }],
    },
  },

  runtimeConfig: {
    // Server only: the browser always goes through /api (Nitro proxy)
    apiBase: 'http://localhost:3001/api', // NUXT_API_BASE
    // true when Nuxt runs behind a reverse proxy (nginx, Traefik…) that sets X-Forwarded-For
    trustProxy: false, // NUXT_TRUST_PROXY
  },

  // Permanent redirects from the previous website's URLs (tracking links already sent to customers)
  routeRules: {
    '/tracking':          { redirect: { to: '/track', statusCode: 301 } },
    '/tracking/**':       { redirect: { to: '/track/**', statusCode: 301 } },
    '/devis':             { redirect: { to: '/quote', statusCode: 301 } },
    '/services':          { redirect: { to: '/send', statusCode: 301 } },
    '/mentions-legales':  { redirect: { to: '/legal', statusCode: 301 } },
    '/confidentialite':   { redirect: { to: '/privacy', statusCode: 301 } },
    // Administration: rendered in the browser only, never indexed
    '/admin':             { ssr: false, headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
    '/admin/**':          { ssr: false, headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
  },

  // Icons served from the local package, no CDN
  icon: {
    serverBundle: { collections: ['lucide'] },
    // In a CSS layer so Tailwind classes (size-*) can resize icons
    cssLayer: 'base',
  },
})
