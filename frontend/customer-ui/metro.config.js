// Learn more https://docs.expo.io/guides/customizing-metro
const { getDefaultConfig } = require('expo/metro-config');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// Add monorepo support
const projectRoot = __dirname;
const workspaceRoot = `${projectRoot}/../..`;

// 1. Watch all files in the project and the monorepo workspace
config.watchFolders = [projectRoot, workspaceRoot];

// 2. Ensure modules resolve to the same instance in the monorepo
config.resolver.disableHierarchicalLookup = true;
config.resolver.nodeModulesPaths = [
  `${projectRoot}/node_modules`,
  `${workspaceRoot}/node_modules`
];

module.exports = config; 