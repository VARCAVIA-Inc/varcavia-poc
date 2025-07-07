// eslint.config.js  – Flat Config stabile
import js from "@eslint/js";
import tsPlugin from "@typescript-eslint/eslint-plugin";
import tsParser from "@typescript-eslint/parser";
import globals from "globals";

/** @type {import("eslint").FlatConfig[]} */
export default [
  // --- Base: JS/TS in ambiente browser (SvelteKit) ------------------------
  {
    files: ["src/**/*.{js,ts,svelte}", "**/*.svelte"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2023,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.es2023
      }
    },
    plugins: { "@typescript-eslint": tsPlugin },
    rules: {
      ...js.configs.recommended.rules,
      ...tsPlugin.configs.recommended.rules
    }
  },

  // --- Node CLI scripts ---------------------------------------------------
  {
    files: ["scripts/**/*.{js,mjs,ts}"],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2023,
      sourceType: "module",
      globals: {
        ...globals.node,
        ...globals.es2023
      }
    },
    rules: {
      "no-console": "off"   // nei tool CLI il log è ammesso
    }
  }
];
