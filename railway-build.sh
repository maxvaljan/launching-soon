#!/bin/bash
set -e

# Install pnpm
echo "Installing pnpm..."
npm install -g pnpm@10.7.0

# Install dependencies with pnpm
echo "Installing dependencies..."
pnpm install --no-frozen-lockfile

# Build the project
echo "Building project..."
pnpm build