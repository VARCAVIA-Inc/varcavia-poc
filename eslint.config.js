// eslint.config.js
import eslint from "@eslint/js";
import ts from "@typescript-eslint/eslint-plugin";
import parser from "@typescript-eslint/parser";
import globals from "globals";

export default [
  {
    ignores: [
      "node_modules/**",
      "build/**",
      ".svelte-kit/**",
      "eslint.config.js",
    ],
  },
  {
    files: ["**/*.ts", "**/*.svelte"],
    languageOptions: {
      parser,
      parserOptions: { sourceType: "module", project: "./tsconfig.json" },
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: { "@typescript-eslint": ts },
    rules: {
      ...eslint.configs.recommended.rules,
      ...ts.configs.recommended.rules,
      "no-unused-vars": "off",
      "@typescript-eslint/no-unused-vars": ["warn", { args: "none" }],
    },
  },
  {
    files: ["**/*.js"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
];
