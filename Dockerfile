# syntax=docker/dockerfile:1
# Targets: `runner` (the website, image savis-app) and `tools` (migrations and seed, image savis-tools).

FROM node:22-bookworm-slim AS base
ENV NEXT_TELEMETRY_DISABLED=1
WORKDIR /app

# ---- dependencies (all, including dev: the build and the Payload CLI need them)
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

# ---- build
FROM base AS build
COPY --from=deps /app/node_modules ./node_modules
COPY . .
# Build-time values only. They are not part of the final images, and the build never connects to a database.
ENV NODE_ENV=production \
    PAYLOAD_SECRET=build-time-placeholder-not-a-secret \
    DATABASE_URL=file:/tmp/build.db \
    SERVER_URL=http://localhost:3000
RUN npm run build

# ---- tools: Payload CLI with the full source tree
FROM base AS tools
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY package.json package-lock.json tsconfig.json ./
COPY src ./src
COPY scripts ./scripts
# The article import uploads photos, so this image writes to the media volume too.
RUN mkdir -p /app/media && chown node:node /app/media
USER node
CMD ["npx", "payload", "migrate:status"]

# ---- runner: Next.js standalone server
FROM base AS runner
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0
COPY --from=build --chown=node:node /app/.next/standalone ./
COPY --from=build --chown=node:node /app/.next/static ./.next/static
COPY --from=build --chown=node:node /app/public ./public
# Uploaded files live here. docker-compose mounts a volume on this path.
RUN mkdir -p /app/media && chown node:node /app/media
USER node
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=40s --retries=3 \
  CMD node -e "fetch('http://127.0.0.1:3000/').then(r=>process.exit(r.status<500?0:1),()=>process.exit(1))"
CMD ["node", "server.js"]
