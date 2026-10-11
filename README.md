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

`GET /healthz` is the container health check. The site needs HTTPS: the admin session cookie is marked `Secure`.

Before going live, fill in the parts marked "To be completed" on the Legal notice and Privacy pages
(`app/pages/legal.vue`, `app/pages/privacy.vue`), and set the contact details, logo, key figures,
testimonials and partners from the admin.
