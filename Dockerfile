FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm@8.14.0

WORKDIR /app

# Copy pnpm files
COPY pnpm-lock.yaml package.json pnpm-workspace.yaml ./
COPY turbo.json ./

# Copy packages
COPY backend/package.json ./backend/
COPY shared/package.json ./shared/

# Install dependencies
RUN pnpm install --frozen-lockfile

# Copy all source files
COPY backend ./backend
COPY shared ./shared

# Build shared package
RUN pnpm build --filter=shared

# Set environment for production
ENV NODE_ENV=production

# Expose the API port
EXPOSE 3000

# Create a healthcheck script
RUN echo '#!/bin/sh\nwget -q -O- http://localhost:$PORT/health || exit 1' > /healthcheck.sh && \
    chmod +x /healthcheck.sh

# Start the backend
CMD ["sh", "-c", "cd backend && pnpm start"]