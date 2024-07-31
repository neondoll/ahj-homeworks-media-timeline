import globals from 'globals';
import pluginJest from 'eslint-plugin-jest';
import pluginJs from '@eslint/js';
import pluginStylistic from '@stylistic/eslint-plugin';

export default [
  { files: ['jest.config.js', 'webpack.*.js'], languageOptions: { globals: globals.node, sourceType: 'commonjs' } },
  { languageOptions: { globals: globals.browser } },
  pluginStylistic.configs.customize({ indent: 2, quotes: 'single', semi: true, jsx: true }),
  pluginJs.configs.recommended,
  { ignores: ['dist/*', 'coverage/*'] },
  { files: ['**/*.test.js'], ...pluginJest.configs['flat/recommended'] },
];
