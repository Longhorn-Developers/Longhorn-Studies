// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      // The package root bundles all ~1,500 icons (+6MB). Import each icon from its own file.
      '@typescript-eslint/no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'phosphor-react-native',
              allowTypeImports: true,
              message:
                'Import icons one at a time: import { ClockIcon } from "phosphor-react-native/src/icons/Clock"',
            },
          ],
        },
      ],
    },
  },
]);
