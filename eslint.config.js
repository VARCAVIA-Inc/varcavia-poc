// eslint.config.js  – flat-config per ESLint 9
import js from '@eslint/js';
import ts from 'typescript-eslint';

export default [
  // regole base JS
  js.configs.recommended,

  // regole TypeScript rigorose  (array → lo spaghettiamo con …)
  ...ts.configs.strictTypeChecked
];
