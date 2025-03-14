module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      // Handle path aliases
      ['module-resolver', {
        root: ['./'],
        alias: {
          '@': './',
        },
        extensions: [
          '.ios.js',
          '.android.js',
          '.js',
          '.ts',
          '.tsx',
          '.json',
        ],
      }],
      // Support for React Native reanimated
      'react-native-reanimated/plugin',
    ],
  };
};
