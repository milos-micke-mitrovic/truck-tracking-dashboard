import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist', 'public/mockServiceWorker.js']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    rules: {
      // Disable - common pattern to export hooks/constants alongside components
      'react-refresh/only-export-components': 'off',
      // Disable - TanStack Table returns functions that can't be memoized
      'react-hooks/incompatible-library': 'off',
      // Disable - dependency arrays should be intentional, not exhaustive
      'react-hooks/exhaustive-deps': 'off',
    },
  },
])
