
FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@9.8.0 --activate
WORKDIR /app


COPY tsconfig.json tsconfig.base.json package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps ./apps
COPY libs ./libs

RUN pnpm install --frozen-lockfile
WORKDIR /app/apps/athena-server
RUN pnpm --filter athena-server build

FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app/dist/ ./dist

EXPOSE 3000
CMD ["pnpm", "--filter athena-server start"]
