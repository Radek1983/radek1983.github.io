import js from '@eslint/js'
import globals from 'globals'

export default [
  {
    ignores: ['dist/**', 'node_modules/**', 'playwright-report/**', 'test-results/**'],
  },
  js.configs.recommended,
  {
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: globals.browser,
    },
    rules: {
      // Dane uzytkownika nie moga trafiac do konsoli w produkcji (spec 8.2).
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-var': 'error',
      'prefer-const': 'error',
      eqeqeq: ['error', 'always'],
      'no-implicit-globals': 'error',
    },
  },
  {
    files: ['scripts/**/*.mjs', '*.config.js', '*.config.mjs'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      globals: globals.nodeBuiltin,
    },
  },
  {
    files: ['tests/**/*.js'],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: 'module',
      /*
       * Specyfikacje Playwright mieszaja dwa konteksty: kod testu dziala w Node,
       * ale cialo page.evaluate() jest serializowane i wykonywane w przegladarce.
       * Oba zestawy globali sa wiec poprawne w tym samym pliku.
       */
      globals: { ...globals.node, ...globals.browser },
    },
  },
]
