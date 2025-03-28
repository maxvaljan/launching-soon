#!/bin/bash
set -e

# Install pnpm
echo "Installing pnpm..."
npm install -g pnpm@8.14.0

# Install dependencies with pnpm
echo "Installing dependencies..."
pnpm install --frozen-lockfile

# Build the project
echo "Building project..."
pnpm build