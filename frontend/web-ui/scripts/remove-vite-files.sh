#!/bin/bash

# Script to identify and remove Vite-related files from the repository
# Run this from the root of the monorepo

echo "🔍 Identifying Vite-related files to remove..."

# Path to the Vite implementation
VITE_DIR="/Users/maxvaljan/maxmove-monorepo-next/frontend/web-ui"

# Check if the directory exists
if [ ! -d "$VITE_DIR" ]; then
  echo "❌ Error: Vite directory not found at $VITE_DIR"
  echo "Please run this script from the root of the monorepo."
  exit 1
fi

# Get current size of Vite directory
VITE_SIZE=$(du -sh "$VITE_DIR" | cut -f1)
echo "📊 Current size of Vite implementation: $VITE_SIZE"

# List of Vite-specific files/directories to identify
VITE_FILES=(
  "$VITE_DIR/vite.config.js"
  "$VITE_DIR/vite.config.ts"
  "$VITE_DIR/node_modules"
  "$VITE_DIR/dist"
  "$VITE_DIR/.vite"
  "$VITE_DIR/public"
  "$VITE_DIR/index.html"
  "$VITE_DIR/src"
  "$VITE_DIR/package.json"
  "$VITE_DIR/package-lock.json"
  "$VITE_DIR/tsconfig.json"
  "$VITE_DIR/README.md"
  "$VITE_DIR/.env"
  "$VITE_DIR/.env.local"
  "$VITE_DIR/.env.production"
)

# Create backup directory
BACKUP_DIR="/Users/maxvaljan/maxmove-monorepo-next/vite-backup-$(date +%Y%m%d%H%M%S)"
echo "📦 Creating backup directory: $BACKUP_DIR"
mkdir -p "$BACKUP_DIR"

# Copy Vite implementation to backup
echo "💾 Backing up Vite implementation..."
cp -r "$VITE_DIR" "$BACKUP_DIR/"

echo "📋 The following Vite-related files/directories will be removed:"
for file in "${VITE_FILES[@]}"; do
  if [ -e "$file" ]; then
    echo "  - $file"
  fi
done

read -p "❓ Do you want to proceed with removal? (y/n): " confirm
if [[ $confirm != "y" && $confirm != "Y" ]]; then
  echo "🛑 Operation cancelled. No files were deleted."
  exit 0
fi

# Remove Vite implementation
echo "🗑️ Removing Vite implementation..."
rm -rf "$VITE_DIR"

echo "✅ Vite implementation has been removed."
echo "🔄 A backup was created at: $BACKUP_DIR"
echo "📝 Note: If you need to restore the Vite implementation, you can copy it back from the backup."

echo "
📢 Next steps:
1. Update any references to the old Vite implementation in your documentation
2. Update any CI/CD pipelines that were using the Vite implementation
3. Use the Next.js implementation for development going forward
"

exit 0