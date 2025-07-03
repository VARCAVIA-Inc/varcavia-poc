// eslint.config.js  – flat-config ESLint 9
import js from '@eslint/js';
import ts from 'typescript-eslint';

export default [
  // Regole base JS
  js.configs.recommended,

  // Regole TS senza type-checking pesante (niente “await-thenable”)
  ...ts.configs.recommended,

  // Ignora file/directory che non vogliamo lintare
  {
    ignores: [
      '**/*.config.*',
      '.eslintrc.*',
      '.svelte-kit/**',
      'node_modules/**',
      'dist/**',
      'build/**'
    ]
  }
];
