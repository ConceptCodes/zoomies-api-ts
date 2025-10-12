# syntax=docker/dockerfile:1

FROM oven/bun:1.1 AS builder
WORKDIR /app

# Install dependencies (cached)
COPY bun.lockb package.json ./
RUN bun install --frozen-lockfile

# Build application
COPY . .
RUN bun run build \
 && if [ -d src/emails ]; then mkdir -p dist && cp -R src/emails dist/emails; fi


FROM oven/bun:1.1 AS runner
WORKDIR /app
ENV NODE_ENV=production

# Install production dependencies
COPY --from=builder /app/package.json /app/bun.lockb ./
RUN bun install --frozen-lockfile --production

# Copy compiled application
COPY --from=builder /app/dist ./dist

EXPOSE 8000
CMD ["bun", "run", "dist/index.js"]
