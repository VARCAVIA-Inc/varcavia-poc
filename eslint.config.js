// eslint.config.js — flat-config ESLint 9
import js from '@eslint/js';
import ts from 'typescript-eslint';

export default [
  // regole base JavaScript
  js.configs.recommended,

  // regole TypeScript con type-checking
  ...ts.configs.strictTypeChecked,

  // ignora tutti i file di config ESLint/Tailwind/Vite ecc.
  {
    ignores: [
      '**/*.config.*',
      '.eslintrc.*'
    ]
  }
];
