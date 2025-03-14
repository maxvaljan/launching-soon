#!/bin/bash

# Script to build and run the development Docker container
echo "Building MaxMove Next.js development container..."

# Build the Docker image
docker build -t maxmove-nextjs-dev -f Dockerfile.dev .

# Run the container
echo "Starting container..."
docker run -p 3000:3000 --env-file .env.local --name maxmove-next maxmove-nextjs-dev

# Note: Stop the container with: docker stop maxmove-next
# Remove the container with: docker rm maxmove-next