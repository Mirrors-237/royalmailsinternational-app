# Website and admin — Nuxt 4 · Tailwind 4

The public website and the administration (`/admin`). The browser only talks to this server:
`/api/**` is proxied to the NestJS API (`new/api`) and the admin session stays in an httpOnly cookie.

## Development

```bash
npm install
NUXT_API_BASE=http://localhost:3001/api npm run dev
npm run typecheck
```

## Production (Dokploy)

Application built from `Dockerfile` (port 3000), with the public domain and HTTPS.

| Variable | Value |
|---|---|
| `NUXT_API_BASE` | The API on the internal network, e.g. `http://<API service name>:3001/api` |
| `NUXT_TRUST_PROXY` | `true` behind Dokploy's reverse proxy (Traefik), so rate limits use the visitor's IP |
| `NUXT_PUBLIC_SITE_URL` | Public address, e.g. `https://www.example.com`: canonical URLs, sharing image, sitemap |

`GET /healthz` is the container health check.

## Search engines and sharing

- Every page has its title, description, canonical URL, Open Graph and X (Twitter) tags (`usePageSeo`, `app.vue`).
- `/og-image.png` is the image shown when a page is shared: a 1200×630 PNG generated from the logo
  (the version for dark backgrounds first), the tagline and the colours set in the admin
  (`server/utils/share-image.ts`, font in `server/assets/fonts`). Its URL carries a version that changes with them.
- `/sitemap.xml` lists the public pages (`shared/utils/site-pages.ts`); `/robots.txt` points to it and keeps `/admin` out.
- Structured data: Organization and WebSite on the home page, BreadcrumbList on inner pages.
- Tracking pages (`/track/<number>`) and the admin are not indexed. The site needs HTTPS: the admin session cookie is marked `Secure`.

Before going live, fill in the admin: contact details, logo, key figures, testimonials, partners,
and the legal information (Brand and content → Legal pages; empty items are left out of the Legal notice
and Privacy pages, and the tab shows how many are still empty).
