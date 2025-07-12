// eslint.config.js
import eslint from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import sveltePlugin from "eslint-plugin-svelte";
import svelteParser from "svelte-eslint-parser";
import globals from "globals";

export default [
  /* ignore artefatti */
  {
    ignores: [
      "node_modules/**",
      "build/**",
      ".svelte-kit/**",
      "eslint.config.js",
    ],
  },

  /* TS + Svelte common */
  {
    files: ["**/*.ts", "**/*.svelte"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        extraFileExtensions: [".svelte"],
      },
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: { "@typescript-eslint": tsPlugin, svelte: sveltePlugin },
    rules: {
      ...eslint.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": ["warn", { args: "none" }],
    },
  },

  /* Svelte specific parser */
  {
    files: ["**/*.svelte"],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tsParser,
        project: "./tsconfig.json",
        extraFileExtensions: [".svelte"],
      },
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: { svelte: sveltePlugin },
    rules: {},
  },

  /* d.ts override – disabilita rule “empty-object/interface” */
  {
    files: ["**/*.d.ts"],
    rules: {
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/no-empty-object-type": "off",
    },
  },

  /* JS plain */
  {
    files: ["**/*.js"],
    languageOptions: { globals: { ...globals.browser, ...globals.node } },
  },
];
