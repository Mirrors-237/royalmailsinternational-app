# Website and admin (Nuxt). Build: docker build -t courier-app .
# NUXT_API_BASE must point to the API as seen from this container, e.g. http://api:3001/api;
# NUXT_PUBLIC_SITE_URL is the public address, e.g. https://www.example.com

FROM node:24-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
# Dependencies only: the postinstall step (nuxt prepare) needs the sources and runs with the build
RUN npm ci --ignore-scripts
COPY . .
RUN npm run postinstall && npm run build

FROM node:24-alpine
ENV NODE_ENV=production \
    HOST=0.0.0.0 \
    PORT=3000
WORKDIR /app
# The build output is self-contained (its own node_modules)
COPY --from=build /app/.output ./.output
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:' + (process.env.PORT || 3000) + '/healthz').then((r) => process.exit(r.ok ? 0 : 1), () => process.exit(1))"
CMD ["node", ".output/server/index.mjs"]
