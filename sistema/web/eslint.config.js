import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist', 'node_modules'] },
  {
    files: ['**/*.{ts,tsx}'],
    extends: [js.configs.recommended, ...tseslint.configs.recommended, reactHooks.configs.flat.recommended, reactRefresh.configs.vite],
    languageOptions: { ecmaVersion: 2022, globals: globals.browser },
    rules: {
      // componentes exportam só componentes; hooks/constantes vivem em arquivo próprio (HMR confiável)
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      '@typescript-eslint/consistent-type-imports': ['error', { prefer: 'type-imports', fixStyle: 'inline-type-imports' }],
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['../../*'], message: 'Use o alias @/ em vez de subir mais de um nível.' },
            { group: ['@/features/*/*', '!@/features/*/index'], message: 'Importe de outra feature só pelo index dela.' },
            { group: ['@radix-ui/*'], message: 'Radix só dentro de src/shared/ui; use o componente embrulhado.' },
          ],
        },
      ],
    },
  },
  {
    // o design system é o único lugar que embrulha os primitivos do Radix
    files: ['src/shared/ui/**/*.{ts,tsx}'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          patterns: [
            { group: ['../../*'], message: 'Use o alias @/ em vez de subir mais de um nível.' },
            { group: ['@/features/*/*', '!@/features/*/index'], message: 'Importe de outra feature só pelo index dela.' },
          ],
        },
      ],
    },
  },
)
