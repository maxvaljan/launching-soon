module.exports = {
  extends: ["./react.js"],
  rules: {
    "react/no-unknown-property": ["error", { ignore: ["jsx", "global"] }],
  },
};