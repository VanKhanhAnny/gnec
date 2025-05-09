// @ts-check
import eslint                from '@eslint/js';
import eslintPluginPrettier  from 'eslint-plugin-prettier/recommended';
import globals               from 'globals';
import tseslint              from 'typescript-eslint';
import importNewlines        from 'eslint-plugin-import-newlines';

export default tseslint.config(
  {
    ignores: ['eslint.config.mjs'],
  },
  eslint.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  eslintPluginPrettier,

  // your existing languageOptions...
  {
    languageOptions: {
      globals: { ...globals.node, ...globals.jest },
      sourceType: 'commonjs',
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
  },

  // <<< ADD THIS CHUNK >>>
  {
    plugins: { 'import-newlines': importNewlines },
    rules: {
      // enforce single-line imports up to 120 chars or < 5 specifiers,
      // otherwise one specifier per line
      'import-newlines/enforce': ['error', {
        items:    5,
        'max-len': 120,
      }, {endOfLine: 'lf'}],
    },
  },

  // your custom TS rules...
  {
    rules: {
      '@typescript-eslint/no-explicit-any':      'off',
      '@typescript-eslint/no-floating-promises': 'warn',
      '@typescript-eslint/no-unsafe-argument':   'warn',
    },
  },
);
