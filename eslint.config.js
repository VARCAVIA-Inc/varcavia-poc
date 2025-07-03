// eslint.config.js – flat-config ESLint 9 • Varcavia
import js from '@eslint/js';
import ts from 'typescript-eslint';

export default [
  /* Regole base JS */
  js.configs.recommended,

  /* Regole TS “soft” */
  ...ts.configs.recommended,

  /* Override globali per sorgenti TS */
  {
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-empty-object-type': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }]
    }
  },

  /* Ignora file/cartelle che non vogliamo lintare */
  {
    ignores: [
      '**/*.d.ts',         // <-- tutte le declaration files
      '**/*.svelte',
      '.svelte-kit/**',
      'node_modules/**',
      'dist/**',
      'build/**',
      '**/*.config.*',
      '.eslintrc.*'
    ]
  }
];
