
FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@9.8.0 --activate

WORKDIR /app

# The root one
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

COPY apps ./apps
COPY libs ./libs

RUN pnpm install --frozen-lockfile

WORKDIR /app/apps/athena-website
RUN pnpm --filter athena-website build

FROM node:20-alpine AS runner

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@9.8.0 --activate


COPY --from=builder /app/apps/athena-website/build ./build
COPY --from=builder /app/apps/athena-website/public ./public
COPY --from=builder /app/apps/athena-website/package.json ./package.json
COPY --from=builder /app/node_modules ./node_modules

# Expose port
EXPOSE 3000

# Run Next.js
CMD ["pnpm", "start"]
