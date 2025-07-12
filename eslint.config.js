// eslint.config.js
import eslint from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import sveltePlugin from "eslint-plugin-svelte";
import svelteParser from "svelte-eslint-parser";
import globals from "globals";

export default [
  /* ─────────── Esclusioni globali ─────────── */
  {
    ignores: [
      "node_modules/**",
      "build/**",
      ".svelte-kit/**",
      "eslint.config.js", // evita autolint su se stesso
    ],
  },

  /* ─────────── TypeScript + Svelte (regole comuni) ─────────── */
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
    plugins: {
      "@typescript-eslint": tsPlugin,
      svelte: sveltePlugin,
    },
    rules: {
      ...eslint.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules,
      "@typescript-eslint/no-unused-vars": ["warn", { args: "none" }],
    },
  },

  /* ─────────── Override specifico per file .svelte ─────────── */
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
    rules: {
      // regole aggiuntive Svelte (se servono)
      // "svelte/valid-compile": "error"
    },
  },

  /* ─────────── Dichiarazioni d.ts ─────────── */
  {
    files: ["**/*.d.ts"],
    rules: { "@typescript-eslint/no-empty-interface": "off" },
  },

  /* ─────────── JavaScript plain ─────────── */
  {
    files: ["**/*.js"],
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
    },
  },
];
