#!/bin/bash

echo "Running cleanup script for Expo app"

# Clear cache
echo "Clearing cache..."
rm -rf node_modules/.cache
rm -rf .expo
rm -rf .turbo
rm -rf android/build

# Remove node_modules
echo "Removing node_modules..."
rm -rf node_modules

# Reinstall dependencies
echo "Reinstalling dependencies..."
npm install

# Fix Expo SDK compatibility
echo "Fixing Expo SDK compatibility..."
npx expo install react-native@0.76.7 react-native-maps@1.18.0 react-native-svg@15.8.0 react-native-webview@13.12.5

# Update Expo
echo "Updating Expo CLI..."
npm install -g expo-cli@latest
npm install -g eas-cli@latest

echo "Cleanup complete!"
echo "Run 'npx expo start --clear' to start the app" 