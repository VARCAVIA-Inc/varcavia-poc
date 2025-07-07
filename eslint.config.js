// eslint.config.js  – Flat Config con ignore Svelte & .d.ts override
import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import globals from "globals";

/** @type {import('eslint').FlatConfig[]} */
export default [
  // --- Ignora Svelte & build output --------------------------------------
  {
    ignores: ["**/.svelte-kit/**", "**/*.svelte"]
  },

  // --- Base JS/TS ---------------------------------------------------------
  {
    files: ["**/*.{js,ts}"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2023,
      sourceType: "module",
      globals: { ...globals.browser, ...globals.node, ...globals.es2023 }
    },
    plugins: { "@typescript-eslint": tsPlugin },
    rules: {
      ...js.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules
    }
  },

  // --- Override Node CLI scripts -----------------------------------------
  {
    files: ["scripts/**/*.{js,mjs,ts}"],
    rules: { "no-console": "off" } // ok nei CLI tool
  },

  // --- Override declaration files (.d.ts) --------------------------------
  {
    files: ["**/*.d.ts"],
    rules: {
      "@typescript-eslint/no-unused-vars": "off",
      "@typescript-eslint/no-empty-interface": "off",
      "@typescript-eslint/no-empty-object-type": "off"
    }
  }
];
