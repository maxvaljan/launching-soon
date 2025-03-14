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
ENV PORT=3000

# Expose the port the app runs on
EXPOSE 3000

# Start the backend
CMD ["npm", "start"]