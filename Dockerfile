FROM node:20-alpine

WORKDIR /app

# First copy only backend package.json and install dependencies
COPY backend/package.json ./backend/
WORKDIR /app/backend
RUN npm install

# Copy backend source files
COPY backend/src ./src
COPY backend/setup-*.js ./
COPY backend/setup-*.sql ./

# Set environment variables
ENV NODE_ENV=production
# Railway will provide the PORT environment variable

# Expose the port the app runs on
EXPOSE 3000

# Create a simple healthcheck script
RUN echo '#!/bin/sh\nwget -q -O- http://localhost:$PORT/health || exit 1' > /healthcheck.sh && \
    chmod +x /healthcheck.sh

# Start the backend with a simple command to echo logs
CMD ["sh", "-c", "npm start"]