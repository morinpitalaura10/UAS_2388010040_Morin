# 1. Builder
FROM node:24-alpine AS builder

WORKDIR /app

COPY package*.json .
RUN npm install

COPY . .
RUN npm run build

# 2. RUNNER
FROM node:24-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Copy build files from builder
COPY --from=builder /app/.next/standalone ./.next/standalone
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public

COPY --from=builder /app/node_modules ./.next/standalone/node_modules

EXPOSE 3000

CMD ["node", ".next/standalone/server.js"]