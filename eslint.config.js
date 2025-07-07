// eslint.config.js  — Flat Config definitivo
import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";

/** @type {import("eslint").FlatConfig[]} */
export default [
  // --- Base JS/TS ----------------------------------------------------------
  {
    files: ["**/*.{js,ts,svelte}"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2023,
      sourceType: "module"
    },
    plugins: { "@typescript-eslint": tsPlugin },
    rules: {
      ...js.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules
    }
  },

  // --- Browser (SvelteKit src) --------------------------------------------
  {
    files: ["src/**/*.{js,ts,svelte}"],
    languageOptions: { env: { browser: true } }
  },

  // --- Node CLI scripts ----------------------------------------------------
  {
    files: ["scripts/**/*.{js,mjs,ts}"],
    languageOptions: { env: { node: true } },
    rules: {
      "no-console": "off"      // OK per tool da linea di comando
    }
  }
];
