# backend/Dockerfile

# Use official Bun image
FROM oven/bun:1.0-alpine AS base
WORKDIR /app

# Install dependencies stage
FROM base AS deps
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile --production

# Development dependencies stage (for building)
FROM base AS dev-deps
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Build stage
FROM base AS build
COPY --from=dev-deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN bun x prisma generate

# Production stage
FROM base AS production

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy Prisma generated client
COPY --from=build /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=build /app/node_modules/@prisma ./node_modules/@prisma

# Copy application code
COPY --from=build /app/src ./src
COPY --from=build /app/prisma ./prisma
COPY --from=build /app/package.json ./

# Expose port
EXPOSE 3000

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD bun run healthcheck || exit 1

# Start the application
CMD ["bun", "run", "src/index.ts"]
