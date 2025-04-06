// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Find the project and workspace directories
const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(projectRoot);

// Get the default source extensions
const defaultSourceExts = require('metro-config/src/defaults/defaults').sourceExts;
const defaultAssetExts = require('metro-config/src/defaults/defaults').assetExts;

// 1. Watch all files within the monorepo
config.watchFolders = [monorepoRoot];

// 2. Let Metro know where to resolve packages and exclude the workspace node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

// 3. Force Metro to resolve (sub)dependencies only from the monorepo's node_modules
config.resolver.disableHierarchicalLookup = true;

// 4. Explicitly set source and asset extensions
config.resolver.sourceExts = process.env.RN_SRC_EXT
  ? [...process.env.RN_SRC_EXT.split(','), ...defaultSourceExts]
  : defaultSourceExts;
if (config.resolver.assetExts) {
  config.resolver.assetExts = config.resolver.assetExts.filter((ext) => ext !== "svg");
}
config.resolver.assetExts = [...defaultAssetExts, "svg"]; // Ensure svg is treated as an asset

// 5. Support shared packages
config.resolver.extraNodeModules = {
  shared: path.resolve(monorepoRoot, 'shared'),
};

module.exports = config;