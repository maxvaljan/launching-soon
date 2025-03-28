module.exports = {
  extends: ["./react.js"],
  plugins: ["react-native"],
  env: {
    "react-native/react-native": true,
  },
  rules: {
    "react-native/no-unused-styles": "warn",
    "react-native/no-inline-styles": "warn",
    "react-native/no-raw-text": ["warn", { skip: ["Button", "Text"] }],
  },
};