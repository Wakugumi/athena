
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY nx.json tsconfig*.json ./
COPY apps/athena-server ./apps/athena-server
COPY libs ./libs

RUN npm ci
RUN npx nx build athena-server --configuration=production

FROM node:20-alpine

WORKDIR /app
COPY --from=builder /app/dist/apps/athena-server ./dist
COPY package*.json ./

RUN npm ci --omit=dev

EXPOSE 3000
CMD ["node", "dist/main.js"]
