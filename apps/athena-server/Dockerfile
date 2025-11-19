
FROM node:20-alpine AS builder

RUN corepack enable && corepack prepare pnpm@9.8.0 --activate
WORKDIR /app


COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/athena-server ./apps
COPY libs ./libs

RUN pnpm install --frozen-lockfile
WORKDIR /app/apps
RUN pnpm --filter athena-server build

FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app/dist/ ./dist

EXPOSE 3000
CMD ["node", "dist/apps/athena-server/src/main.js"]
