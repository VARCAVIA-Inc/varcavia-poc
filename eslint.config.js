// eslint.config.js – flat config per ESLint 9
import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  js.configs.recommended,
  tseslint.configs.strictTypeChecked,  // regole TS severe
];
