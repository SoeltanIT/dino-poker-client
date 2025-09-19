FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS dependencies
WORKDIR /application

# Install dependencies
COPY package.json pnpm-lock.yaml* ./

RUN corepack enable pnpm
RUN pnpm install

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /application

COPY --from=dependencies /application/node_modules ./node_modules
COPY . .

# Next.js collects completely anonymous telemetry data about general usage.
# Learn more here: https://nextjs.org/telemetry
# Uncomment the following line in case you want to disable telemetry during the build.
# ENV NEXT_TELEMETRY_DISABLED=1

RUN corepack enable pnpm
RUN pnpm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /application

ARG NEXT_PUBLIC_API_BASE_URL
ARG NEXT_PUBLIC_API_TRANS_URL
ARG NEXT_PUBLIC_API_PROMOTION_URL
ARG NEXT_PUBLIC_ODIN_URL
ARG NEXT_PUBLIC_CAMOPAY_URL
ARG NEXT_PUBLIC_CAMOPAY_KEY
ARG NEXT_PUBLIC_BETBY_BRAND_ID
ARG NEXT_PUBLIC_BETBY_SCRIPT_URL

ENV NODE_ENV=production
# Uncomment the following line in case you want to disable telemetry during runtime.
# ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /application/public ./public

# Automatically leverage output traces to reduce image size
# https://nextjs.org/docs/advanced-features/output-file-tracing
COPY --from=builder --chown=nextjs:nodejs /application/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /application/.next/static ./.next/static

# This one-liner script will force the hostname to be '0.0.0.0' instead of fetching from the hostname environment variable, this is needed since AWS AppRunner will automatically replace hostname and port environment variables with their own values
RUN sed -i "s/process.env.HOSTNAME || '0.0.0.0'/'0.0.0.0'/g" server.js

USER nextjs

EXPOSE 3000

# server.js is created by next build from the standalone output
# https://nextjs.org/docs/pages/api-reference/config/next-config-js/output
CMD ["node", "server.js"]
