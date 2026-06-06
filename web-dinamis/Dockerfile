FROM node:24-alpine AS builder
# Set directory
WORKDIR /app
# Copy package.json and package-lock.json
COPY package*.json .
# Install dependencies
RUN npm install
# Copy source code
COPY . .
# Build next.js
RUN npm run build
# 2. RUNNER
FROM node:24-alpine AS runner
# Set directory
WORKDIR /app
# Environment Variables for Next.js
ENV NODE_ENV=production
# Copy build files from builder
COPY --from=builder /app/.next/standalone ./.next/standalone
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/public ./public
# Expose port
EXPOSE 3000
# Start next.js
CMD ["node", ".next/standalone/server.js"]