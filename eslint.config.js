// eslint.config.js  ⟵  incolla l’intero file
import js from "@eslint/js";
import tseslint from "typescript-eslint/eslint-plugin";
import tsparser from "typescript-eslint/parser";

export default [
  // ----------  BASE ----------
  {
    files: ["**/*.{js,ts,svelte}"],
    languageOptions: {
      parser: tsparser,
      sourceType: "module",
      ecmaVersion: 2023
    },
    plugins: { "@typescript-eslint": tseslint },
    settings: {},
    rules: {
      ...js.configs.recommended.rules,
      ...tseslint.configs.recommended.rules
    }
  },

  // ----------  SVELTE ----------
  {
    files: ["src/**/*.{js,ts,svelte}"],
    languageOptions: { env: { browser: true } }
  },

  // ----------  NODE SCRIPTS ----------
  {
    files: ["scripts/**/*.{js,mjs,ts}"],
    languageOptions: { env: { node: true } },
    rules: {
      "no-console": "off"          // CLI tool = console OK
    }
  }
];
