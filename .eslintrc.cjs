# crea/riscrive .eslintrc.cjs
cat > .eslintrc.cjs <<'EOF'
/** @type {import('eslint').Linter.Config} */
module.exports = {
  root: true,
  env: {
    browser: true,  // per SvelteKit
    node: true,     // per script Node
    es2023: true
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  parserOptions: { ecmaVersion: 2023, sourceType: 'module' },

  // 👇 Qui facciamo override sui file dentro /scripts
  overrides: [
    {
      files: ['scripts/**/*.{js,mjs,ts}'],
      env: { node: true },
      rules: {
        'no-console': 'off'  // consentiamo console.log nei tool CLI
      }
    }
  ]
};
EOF
