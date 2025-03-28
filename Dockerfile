FROM node:20-alpine AS base

# Install pnpm
RUN npm install -g pnpm@10.7.0

WORKDIR /app

# First copy package configs to install dependencies
COPY package.json ./
COPY pnpm-workspace.yaml ./
COPY turbo.json ./

# Copy package.json files for workspaces
COPY backend/package.json ./backend/
COPY shared/package.json ./shared/

# Install dependencies without requiring a lockfile
RUN pnpm install --no-frozen-lockfile

# Now copy the actual source code
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