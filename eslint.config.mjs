import js from '@eslint/js';
import globals from 'globals';
import playwright from 'eslint-plugin-playwright';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'node_modules/',
      'playwright-report/',
      'test-results/',
      'reports/',
      '.auth/',
      '.playwright-mcp/',
      'perf/',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['scripts/**/*.mjs', '*.config.mjs'],
    languageOptions: { globals: globals.node },
  },
  {
    files: ['**/tests/**/*.ts'],
    ...playwright.configs['flat/recommended'],
    rules: {
      ...playwright.configs['flat/recommended'].rules,
      'playwright/no-wait-for-timeout': 'error', // no hard waits
      'playwright/no-force-option': 'error',
      'playwright/no-skipped-test': 'off', // setup skips tests when a role has no credentials
      'playwright/expect-expect': 'off', // assertions can live in page-object helpers such as evidence()
    },
  },
  {
    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-empty-pattern': 'off', // Playwright fixtures: async ({}, use) => ...
    },
  },
);
