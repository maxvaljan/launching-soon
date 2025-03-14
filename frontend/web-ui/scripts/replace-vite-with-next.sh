#!/bin/bash

# Script to replace the Vite implementation with the Next.js implementation
# Run this from the root of the monorepo

echo "🔄 Preparing to replace Vite with Next.js implementation..."

# Paths
VITE_DIR="/Users/maxvaljan/maxmove-monorepo-next/frontend/web-ui"
NEXT_DIR="/Users/maxvaljan/maxmove-monorepo-next/temp-repo/frontend/web-ui-next"
TARGET_DIR="/Users/maxvaljan/maxmove-monorepo-next/frontend/web-ui"

# Check if directories exist
if [ ! -d "$NEXT_DIR" ]; then
  echo "❌ Error: Next.js directory not found at $NEXT_DIR"
  exit 1
fi

# Create backup of Vite implementation if it exists
if [ -d "$VITE_DIR" ]; then
  BACKUP_DIR="/Users/maxvaljan/maxmove-monorepo-next/vite-backup-$(date +%Y%m%d%H%M%S)"
  echo "📦 Creating backup of Vite implementation: $BACKUP_DIR"
  mkdir -p "$BACKUP_DIR"
  cp -r "$VITE_DIR" "$BACKUP_DIR/"
  
  echo "🗑️ Removing Vite implementation..."
  rm -rf "$VITE_DIR"
else
  echo "⚠️ Vite implementation not found at $VITE_DIR. Continuing anyway."
fi

# Ensure target directory exists
mkdir -p "$(dirname "$TARGET_DIR")"

# Copy Next.js implementation to target directory
echo "📋 Copying Next.js implementation to $TARGET_DIR..."
cp -r "$NEXT_DIR" "$TARGET_DIR"

# Update package.json in root directory to use Next.js scripts
if [ -f "/Users/maxvaljan/maxmove-monorepo-next/package.json" ]; then
  echo "📝 Updating root package.json to use Next.js scripts..."
  # This would be better with jq, but using sed for broader compatibility
  sed -i -e 's/"dev:frontend": "cd frontend\/web-ui && npm run dev"/"dev:frontend": "cd frontend\/web-ui && npm run dev"/g' "/Users/maxvaljan/maxmove-monorepo-next/package.json"
  sed -i -e 's/"build:frontend": "cd frontend\/web-ui && npm run build"/"build:frontend": "cd frontend\/web-ui && npm run build"/g' "/Users/maxvaljan/maxmove-monorepo-next/package.json"
fi

echo "✅ Next.js implementation has successfully replaced the Vite implementation."
echo "🔄 A backup of the Vite implementation was created at: $BACKUP_DIR"

echo "
📢 Next steps:
1. Run 'cd frontend/web-ui && npm install' to ensure all dependencies are installed
2. Run 'npm run dev:frontend' to start the Next.js development server
3. Update any CI/CD pipelines to use the Next.js build process
4. Commit the changes to version control
"

exit 0