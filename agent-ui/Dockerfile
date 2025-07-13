# Stage 1: Dependencies
FROM node:18-alpine AS deps
WORKDIR /app

# Copy package files for more efficient caching
COPY package.json package-lock.json* ./

# Install dependencies with specific flags to optimize build time
# --no-audit: Skip the dependency audit step (can run this separately)
# --frozen-lockfile: Ensures package-lock.json is used exactly
RUN npm ci --no-audit --frozen-lockfile

# Stage 2: Builder
FROM node:18-alpine AS builder
WORKDIR /app

# Copy dependencies from previous stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Set environment to production for optimized build
ENV NEXT_TELEMETRY_DISABLED="1"
ENV NODE_ENV="production"

# Convert TypeScript config to JavaScript before build
RUN npx tsc next.config.ts --outDir .

# Build the application with standalone output
RUN NODE_OPTIONS="--max-old-space-size=4096" npm run build

# Debug: List .next directory contents to understand the structure
RUN ls -la .next/ && echo "Checking for standalone directory:" && ls -la .next/standalone || echo "No standalone directory found"

# Stage 3: Runner (final, lightweight image)
FROM node:18-alpine AS runner
WORKDIR /app

# Set to production environment
ENV NODE_ENV="production"
ENV NEXT_TELEMETRY_DISABLED="1"

# Add a non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy necessary files from builder
COPY --from=builder /app/next.config.js ./
COPY --from=builder /app/public ./public
COPY --from=builder /app/package.json ./package.json

# Create directories to avoid errors
RUN mkdir -p .next/static

# Copy the entire .next directory first
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next

# Use a shell script to conditionally copy the standalone directory
RUN if [ -d /app/.next/standalone ]; then \
      echo "Copying standalone directory" && \
      cp -R /app/.next/standalone/* /app/; \
    else \
      echo "No standalone directory found - using fallback"; \
    fi

# Switch to non-root user
USER nextjs

# Expose the port the app runs on
EXPOSE 3000

# Environment variables that can be overridden at runtime
ENV PORT="3000"
ENV HOSTNAME="0.0.0.0"

# Start the application
CMD ["node", "server.js"]