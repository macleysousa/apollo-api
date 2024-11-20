const typescriptParser = require('@typescript-eslint/parser');
const typescriptPlugin = require('@typescript-eslint/eslint-plugin');
const importPlugin = require('eslint-plugin-import');
const simpleImportSortPlugin = require('eslint-plugin-simple-import-sort');
const prettierPlugin = require('eslint-plugin-prettier');

/** @type {import('eslint').Linter.FlatConfig[]} */
const config = [
  {
    files: ['**/*.ts', '**/*.tsx'],
    ignores: ['.eslintrc.js', '**/src/i18n/**'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      import: importPlugin,
      'simple-import-sort': simpleImportSortPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/ban-types': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-var-requires': 'off',
      'prettier/prettier': [
        'error',
        {
          trailingComma: 'all',
          endOfLine: 'auto',
          singleQuote: true,
          tabWidth: 2,
          printWidth: 130,
        },
      ],
      'simple-import-sort/imports': [
        'warn',
        {
          groups: [
            ['^nest(.*)$', '^@?\\w'],
            ['^src/(.*)$'],
            ['^(../)+(.*)$'],
            ['^./(.*)$'],
          ],
        },
      ],
      'simple-import-sort/exports': 'warn',
      'import/order': 'off',
      'import/no-unresolved': 'off',
    },
    settings: {
      'import/resolver': {
        typescript: {
          alwaysTryTypes: true,
          project: './tsconfig.json',
        },
      },
    },
  },
  {
    languageOptions: {
      globals: {
        jest: true,
        node: true,
      },
    },
  },
];

module.exports = config;
