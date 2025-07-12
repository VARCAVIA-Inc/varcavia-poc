// eslint.config.js – Flat-config, split “typed” vs “untyped”
import eslint from "@eslint/js";
import tsParser from "@typescript-eslint/parser";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import svelteParser from "svelte-eslint-parser";
import sveltePlugin from "eslint-plugin-svelte";
import globals from "globals";

export default [
  /* ——— 1.  LINT CON TYPE-CHECK (solo sorgente) ——— */
  {
    files: ["src/**/*.{ts,svelte}"],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: process.cwd(),
        extraFileExtensions: [".svelte"],
      },
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: { "@typescript-eslint": tsPlugin, svelte: sveltePlugin },
    rules: {
      ...eslint.configs.recommended.rules,
      ...tsPlugin.configs["recommended-type-checked"].rules,
    },
  },

  /* ——— 2.  .svelte senza type-check aggiuntivo (serve parser specifico) ——— */
  {
    files: ["src/**/*.svelte"],
    languageOptions: {
      parser: svelteParser,
      parserOptions: {
        parser: tsParser,
        extraFileExtensions: [".svelte"],
        project: "./tsconfig.json",
      },
      globals: { ...globals.browser, ...globals.node },
    },
    plugins: { svelte: sveltePlugin },
    rules: {},
  },

  /* ——— 3.  File di configurazione / build script  ——— */
  {
    files: [
      "vite.config.ts",
      "svelte.config.js",
      "eslint.config.js",
      "*.cjs",
      "*.mjs",
    ],
    languageOptions: {
      parser: tsParser,
      parserOptions: { project: null }, //  ← niente type-check qui!
      globals: globals.node,
    },
    plugins: { "@typescript-eslint": tsPlugin },
    rules: {
      ...eslint.configs.recommended.rules,
      // disattiva le rule che richiedono tipi
      "@typescript-eslint/await-thenable": "off",
      "@typescript-eslint/no-var-requires": "off",
    },
  },
];
