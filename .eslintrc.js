module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2021: true,
  },
  extends: ['google'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
  },
  plugins: ['@typescript-eslint'],
  rules: {
    'no-console': 'off',
    'no-unused-vars': 'off',
    'no-array-constructor': 'off',
    'camelcase': 'off',
    'require-jsdoc': 'off',
    'max-len': 'off',
    'prefer-const': 'off',
    'new-cap': 'off',
  },
};
