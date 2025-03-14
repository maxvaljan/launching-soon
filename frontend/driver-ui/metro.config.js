// metro.config.js
const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

// Get the default Metro configuration for Expo
const defaultConfig = getDefaultConfig(__dirname);

// Add any custom config here
module.exports = {
  ...defaultConfig,
  // Allow React 19 & React Native 0.78.0 compatibility
  resolver: {
    ...defaultConfig.resolver,
    extraNodeModules: {
      ...defaultConfig.resolver.extraNodeModules,
      'react': path.resolve(__dirname, 'node_modules/react'),
      'react-native': path.resolve(__dirname, 'node_modules/react-native'),
    },
    // Force Metro to resolve (sub)dependencies only from the root node_modules
    nodeModulesPaths: [path.resolve(__dirname, 'node_modules')],
  },
  transformer: {
    ...defaultConfig.transformer,
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
  // Attempt to work around version compatibility issues
  maxWorkers: 2,
};
