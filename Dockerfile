FROM node:20-alpine

WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock ./
COPY backend/package.json ./backend/
COPY shared/package.json ./shared/
COPY frontend/web-ui/package.json ./frontend/web-ui/
COPY frontend/customer-ui/package.json ./frontend/customer-ui/
COPY frontend/driver-ui/package.json ./frontend/driver-ui/

# Install dependencies with network timeout and without frozen lockfile
RUN yarn install --network-timeout 600000

# Copy the rest of the application
COPY . .

# Build the backend
RUN yarn build:backend

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["yarn", "start"]