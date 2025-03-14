#!/bin/bash

# Set paths
VITE_PROJECT_PATH="../web-ui"  # Adjust path to your Vite project
NEXT_PROJECT_PATH="."
VITE_ASSETS_PATH="$VITE_PROJECT_PATH/src/assets"
NEXT_PUBLIC_PATH="$NEXT_PROJECT_PATH/public"

# Create necessary directories
mkdir -p "$NEXT_PUBLIC_PATH/images"
mkdir -p "$NEXT_PUBLIC_PATH/icons"
mkdir -p "$NEXT_PUBLIC_PATH/logos"

# Copy images
echo "Copying images from Vite to Next.js project..."
if [ -d "$VITE_ASSETS_PATH/images" ]; then
  cp -r "$VITE_ASSETS_PATH/images/"* "$NEXT_PUBLIC_PATH/images/"
  echo "✅ Images copied successfully"
else
  echo "⚠️ Images directory not found in Vite project"
fi

# Copy icons
if [ -d "$VITE_ASSETS_PATH/icons" ]; then
  cp -r "$VITE_ASSETS_PATH/icons/"* "$NEXT_PUBLIC_PATH/icons/"
  echo "✅ Icons copied successfully"
else
  echo "⚠️ Icons directory not found in Vite project"
fi

# Copy logos
if [ -d "$VITE_ASSETS_PATH/logos" ]; then
  cp -r "$VITE_ASSETS_PATH/logos/"* "$NEXT_PUBLIC_PATH/logos/"
  echo "✅ Logos copied successfully"
else
  echo "⚠️ Logos directory not found in Vite project"
fi

# Copy favicon and other root files
if [ -d "$VITE_PROJECT_PATH/public" ]; then
  cp -r "$VITE_PROJECT_PATH/public/"* "$NEXT_PUBLIC_PATH/"
  echo "✅ Public files copied successfully"
else
  echo "⚠️ Public directory not found in Vite project"
fi

echo "Migration complete! Please check the Next.js public directory for the files."
echo "You may need to update import paths in your components."
echo "In Next.js, use '/images/filename.jpg' instead of importing from assets."