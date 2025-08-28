export default {
  env: {
    node: true,
    es2021: true,
    commonjs: true,
  },
  extends: ["eslint:recommended"],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
  },
  rules: {
    "no-console": "off",
    "no-unused-vars": ["error", { argsIgnorePattern: "^_" }],
  },
  globals: {
    __dirname: "readonly",
    __filename: "readonly",
    process: "readonly",
    module: "readonly",
    require: "readonly",
    Buffer: "readonly",
    global: "readonly",
    exports: "readonly",
  },
};
