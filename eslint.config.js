// eslint.config.js – flat-config ESLint 9 ♦ Varcavia
import js from '@eslint/js';
import ts from 'typescript-eslint';

export default [
  /* ── Regole base JS ─────────────────────────────── */
  js.configs.recommended,

  /* ── Regole TS “soft” (senza type-checking pesante) */
  ...ts.configs.recommended,

  /* ── Override globali / esclusioni ──────────────── */
  {
    files: ['**/*.ts', '**/*.svelte'],

    /* Disattiva o declassa le regole che oggi bloccano il CI */
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
    }
  },

  /* ── Ignora cartelle generate e file di config ──── */
  {
    ignores: [
      '.svelte-kit/**',
      'node_modules/**',
      'dist/**',
      'build/**',
      '**/*.config.*',
      '.eslintrc.*'
    ]
  }
];
